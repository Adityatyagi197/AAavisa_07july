const twilio = require('twilio');
const prisma = require('../config/db');
const { connection: redis } = require('../queues/connection');
const axios = require('axios');

const SESSION_TIMEOUT = 3600; // 1 hour session validity

/**
 * Handles incoming client WhatsApp messages, parses their intent, and sends chatbot replies.
 * 
 * @param {string} phone - Inbound sender phone number
 * @param {string} name - Inbound sender name
 * @param {string} text - Message text content
 */
exports.handleChatbotMessage = async (phone, name, text) => {
  // Normalize phone format
  let cleanPhone = phone.trim();
  if (cleanPhone.startsWith('whatsapp:')) {
    cleanPhone = cleanPhone.substring(9);
  }
  cleanPhone = cleanPhone.replace(/[^\d+]/g, ''); // Keep only digits and '+'
  if (!cleanPhone.startsWith('+')) {
    cleanPhone = '+' + cleanPhone;
  }

  // 1. Check if Live Agent Mode is active for this user
  const agentModeKey = `chatbot:agent_mode:${cleanPhone}`;
  const isAgentMode = await redis.get(agentModeKey);
  
  const cleanMessage = text.trim().toLowerCase();

  // If user types 'menu', 'help', or 'start', they can force override agent mode to resume bot
  const isResumeCommand = (cleanMessage === 'menu' || cleanMessage === 'help' || cleanMessage === 'start');
  if (isResumeCommand) {
    if (isAgentMode === 'true') {
      await redis.del(agentModeKey);
      console.log(`Chatbot: Agent mode disabled for ${cleanPhone} by menu reset command.`);
    }
    const sessionKey = `chatbot:session:${cleanPhone}`;
    await redis.set(sessionKey, JSON.stringify({ stage: 'AWAITING_SERVICE' }), 'EX', SESSION_TIMEOUT);
    await sendMenu(cleanPhone);
    return;
  }

  // If agent mode is active, completely skip responding (allows human conversation)
  if (isAgentMode === 'true') {
    console.log(`Chatbot: Agent mode is active for ${cleanPhone}. Skipping chatbot auto-response.`);
    return;
  }

  // Handle initial greeting commands (when agent mode is NOT active)
  if (cleanMessage === 'hello' || cleanMessage === 'hi') {
    const sessionKey = `chatbot:session:${cleanPhone}`;
    await redis.set(sessionKey, JSON.stringify({ stage: 'AWAITING_SERVICE' }), 'EX', SESSION_TIMEOUT);
    await sendMenu(cleanPhone);
    return;
  }

  // Retrieve user session stage
  const sessionKey = `chatbot:session:${cleanPhone}`;
  const userSessionRaw = await redis.get(sessionKey);
  let userSession = userSessionRaw ? JSON.parse(userSessionRaw) : { stage: 'INIT' };

  // 2. Handoff to Live Agent command
  if (cleanMessage === 'agent' || cleanMessage === 'talk to agent') {
    await redis.set(agentModeKey, 'true', 'EX', 86400); // Pause bot for 24 hours
    await redis.del(sessionKey); // Clear temporary menu session
    
    await sendCustomWhatsApp(cleanPhone, "👤 *Live Agent Mode Activated!*\n\nOur consultants have been notified and will message you shortly. The automated assistant is now paused.\n\n_To resume the chatbot at any time, just reply *'menu'*._");
    console.log(`[AGENT HANDOFF] Live agent requested by ${cleanPhone} (${name}). Chatbot paused.`);
    
    // Log to DB
    await logCommunication(cleanPhone, `User requested Live Agent support. Chatbot paused for 24 hours.`, "SYSTEM");
    return;
  }

  // 3. Process options
  if (userSession.stage === 'INIT') {
    userSession.stage = 'AWAITING_SERVICE';
    await redis.set(sessionKey, JSON.stringify(userSession), 'EX', SESSION_TIMEOUT);
    await sendMenu(cleanPhone);
    return;
  }

  if (userSession.stage === 'AWAITING_SERVICE') {
    const choices = {
      '1': 'Schengen Tourist Visa',
      '2': 'Digital Nomad Visa (DNV)',
      '3': 'Non-Lucrative Visa (NLV)',
      '4': 'Self-Employed / Business Residency',
      '5': 'Family Reunification / Partner Residency',
      '6': 'Study Visa'
    };

    const selectedService = choices[cleanMessage];
    if (selectedService) {
      userSession.serviceType = selectedService;
      userSession.stage = 'AWAITING_APPLICANTS';
      await redis.set(sessionKey, JSON.stringify(userSession), 'EX', SESSION_TIMEOUT);
      await askQuestionB(cleanPhone);
      return;
    } else {
      // Check if user asked something else and we have AI enabled
      const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
      const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

      if (OPENAI_API_KEY && OPENAI_API_KEY !== 'your_openai_api_key_here') {
        try {
          const aiAnswer = await getOpenAIAnswer(text);
          await sendCustomWhatsApp(cleanPhone, aiAnswer);
          return;
        } catch (e) {
          console.error("OpenAI chatbot failure:", e.message);
        }
      } else if (GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here') {
        try {
          const aiAnswer = await getGeminiAnswer(text);
          await sendCustomWhatsApp(cleanPhone, aiAnswer);
          return;
        } catch (e) {
          console.error("Gemini chatbot failure:", e.message);
        }
      }

      await sendCustomWhatsApp(cleanPhone, "Sorry, I didn't quite catch that. Please reply with a number (1-6) corresponding to your choice:");
      await sendMenu(cleanPhone);
    }
  } else if (userSession.stage === 'AWAITING_APPLICANTS') {
    const choicesB = {
      '1': 'Main Only',
      '2': 'Main + 1',
      '3': 'Main + 2',
      '4': 'Main + 3',
      '5': 'Main + 4',
      '6': 'Main + 5'
    };

    if (cleanMessage === '7') {
      userSession.stage = 'AWAITING_CUSTOM_APPLICANTS';
      await redis.set(sessionKey, JSON.stringify(userSession), 'EX', SESSION_TIMEOUT);
      await sendCustomWhatsApp(cleanPhone, "Please type the exact number of applicants (e.g. 8):");
      return;
    }

    const selectedApplicants = choicesB[cleanMessage];
    if (selectedApplicants) {
      // Complete onboarding and save to DB
      await completeOnboarding(cleanPhone, name, userSession.serviceType, selectedApplicants, sessionKey);
      return;
    } else {
      await sendCustomWhatsApp(cleanPhone, "Invalid choice. Please reply with a number from 1 to 7:");
      await askQuestionB(cleanPhone);
    }
  } else if (userSession.stage === 'AWAITING_CUSTOM_APPLICANTS') {
    const enteredNumber = parseInt(cleanMessage, 10);
    if (!isNaN(enteredNumber) && enteredNumber > 0) {
      // Map back to standard CRM format, e.g. 8 applicants -> Main + 7
      const mapped = enteredNumber === 1 ? 'Main Only' : `Main + ${enteredNumber - 1}`;
      
      // Complete onboarding and save to DB
      await completeOnboarding(cleanPhone, name, userSession.serviceType, mapped, sessionKey);
      return;
    } else {
      await sendCustomWhatsApp(cleanPhone, "Please enter a valid number (e.g. 8):");
    }
  } else {
    // If state is unknown, reset to menu
    userSession.stage = 'MENU';
    await redis.set(sessionKey, JSON.stringify(userSession), 'EX', SESSION_TIMEOUT);
    await sendMenu(cleanPhone);
  }
};

async function sendMenu(phone) {
  const greetingText = `Greetings from *AAA Business Consultancy LLC*. Thank you for contacting us regarding Spain Visa & Residency Services. For further assistance, please continue the conversation on WhatsApp.`;
  const questionText = `*Which service would you like to apply for?*\n1. Schengen Tourist Visa\n2. Digital Nomad Visa (DNV)\n3. Non-Lucrative Visa (NLV)\n4. Self-Employed / Business Residency\n5. Family Reunification / Partner Residency\n6. Study Visa\n\n_Reply with a number (1-6) to select._`;
  
  await sendCustomWhatsApp(phone, greetingText);
  await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay for natural messaging order
  await sendCustomWhatsApp(phone, questionText);
}

/**
 * Sends Question B (How many applicants are included) to the client.
 */
async function askQuestionB(phone) {
  const message = `*How many applicants are included?*\n1. Main Applicant Only\n2. Main + 1\n3. Main + 2\n4. Main + 3\n5. Main + 4\n6. Main + 5\n7. More than 6 (Type custom number)\n\n_Reply with a number (1-7) to select._`;
  await sendCustomWhatsApp(phone, message);
}

/**
 * Completes the onboarding flow, creates/updates the lead in CRM database, and sends congratulations booking link.
 */
async function completeOnboarding(phone, name, serviceType, applicantsCount, sessionKey) {
  // 1. Save or update Lead details in CRM database
  try {
    const numberPart = phone.replace('+', '');
    let lead = await prisma.lead.findFirst({
      where: { phone: { contains: numberPart } }
    });

    if (lead) {
      await prisma.lead.update({
        where: { id: lead.id },
        data: {
          serviceType: serviceType,
          applicantsCount: applicantsCount,
          status: 'Awaiting Assessment'
        }
      });
      console.log(`[CHATBOT] Updated lead ${lead.id} with service: ${serviceType}, applicants: ${applicantsCount}`);
    } else {
      const nameParts = name ? name.split(' ') : ['WhatsApp', 'Lead'];
      lead = await prisma.lead.create({
        data: {
          firstName: nameParts[0] || 'WhatsApp',
          lastName: nameParts.slice(1).join(' ') || 'Lead',
          phone: phone,
          email: `${numberPart}@whatsapp.com`, // Placeholder email
          serviceType: serviceType,
          applicantsCount: applicantsCount,
          status: 'New Lead',
          source: 'WhatsApp'
        }
      });
      console.log(`[CHATBOT] Created new lead ${lead.id} with service: ${serviceType}, applicants: ${applicantsCount}`);
    }
  } catch (dbError) {
    console.warn("Could not save lead details to CRM database:", dbError.message);
  }

  // 2. Clear chatbot menu stage session
  await redis.del(sessionKey);

  // 3. Send final congratulations and booking invitation message
  const congratsMsg = `Congratulations.\nBased on your initial information, you are invited to book a FREE Assessment & Verification Consultation with one of our consultants.\nPlease use the booking link below to select your preferred date and time.\n\nhttp://localhost:5173/#/public/lead-form`;
  
  await sendCustomWhatsApp(phone, congratsMsg);
}

/**
 * Sends free-text responses via Twilio WhatsApp API or logs in Dry-Run mode.
 */
async function sendCustomWhatsApp(phone, messageBody) {
  const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
  const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
  const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM;

  const isConfigured = !!(
    TWILIO_ACCOUNT_SID && 
    TWILIO_ACCOUNT_SID.startsWith('AC') && 
    TWILIO_AUTH_TOKEN && 
    TWILIO_AUTH_TOKEN !== 'your_twilio_auth_token_here' && 
    TWILIO_WHATSAPP_FROM
  );

  const twilioTo = `whatsapp:${phone}`;

  if (isConfigured) {
    try {
      const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
      await client.messages.create({
        body: messageBody,
        from: TWILIO_WHATSAPP_FROM,
        to: twilioTo
      });
    } catch (err) {
      console.error(`Twilio Chatbot Outbound Send failed to ${twilioTo}:`, err.message);
    }
  } else {
    console.log('------------------------------------------------------------');
    console.log(`[CHATBOT DRY-RUN SEND]`);
    console.log(`To:       ${twilioTo}`);
    console.log(`Body:     ${messageBody}`);
    console.log('------------------------------------------------------------');
  }

  // Log to database communications log
  await logCommunication(phone, messageBody, "OUTBOUND");
}

/**
 * Creates a record in CommunicationLog linked to the matching client.
 */
async function logCommunication(phone, messageText, direction) {
  try {
    const numberPart = phone.replace('+', '');
    const client = await prisma.client.findFirst({
      where: { phone: { contains: numberPart } }
    });
    if (client) {
      await prisma.communicationLog.create({
        data: {
          clientId: client.id,
          channel: 'WHATSAPP',
          direction: direction,
          content: messageText,
          deliveryStatus: 'SENT'
        }
      });
    }
  } catch (e) {
    console.warn("Could not log chatbot message to Database:", e.message);
  }
}

/**
 * Queries OpenAI completions API for general visa enquiries.
 */
async function getOpenAIAnswer(userQuery) {
  const apiKey = process.env.OPENAI_API_KEY;
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful customer support chatbot for AAA Business Consultancy. We help clients obtain visas, residencies (like Digital Nomad Visa, Non-Lucrative Visa, Golden Visa), and Sworn Translations in Spain. Answer briefly, professionally, and keep it under 3 sentences. Mention that the user can reply "agent" to talk to a human consultant.'
        },
        { role: 'user', content: userQuery }
      ],
      max_tokens: 150
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data.choices[0].message.content.trim();
}

/**
 * Queries Google Gemini API for general visa enquiries.
 */
async function getGeminiAnswer(userQuery) {
  const apiKey = process.env.GEMINI_API_KEY;
  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      contents: [
        {
          parts: [
            {
              text: `You are a helpful customer support chatbot for AAA Business Consultancy. We help clients obtain visas, residencies (like Digital Nomad Visa, Non-Lucrative Visa, Golden Visa), and Sworn Translations in Spain. Answer briefly, professionally, and keep it under 3 sentences. Mention that the user can reply "agent" to talk to a human consultant. User Question: ${userQuery}`
            }
          ]
        }
      ],
      generationConfig: {
        maxOutputTokens: 150
      }
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data.candidates[0].content.parts[0].text.trim();
}
