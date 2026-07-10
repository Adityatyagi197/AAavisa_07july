const crypto = require('crypto');
const { communicationsQueue } = require('../queues/queueSetup');
const { processPaymentEvent } = require('../services/paymentService');

exports.verifyMetaSignature = (req, res, next) => {
  const signature = req.headers['x-hub-signature-256'];
  const appSecret = process.env.META_APP_SECRET;
  
  if (!appSecret) {
    console.warn('META_APP_SECRET not configured. Skipping signature validation.');
    return next();
  }

  if (!signature) {
    return res.status(401).send('No signature provided');
  }

  const payload = JSON.stringify(req.body);
  const expectedSignature = `sha256=${crypto
    .createHmac('sha256', appSecret)
    .update(payload)
    .digest('hex')}`;

  if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return next();
  }
  
  return res.status(401).send('Invalid signature');
};

exports.handleMetaWebhook = async (req, res) => {
  const payload = req.body;
  console.log('Received Meta Webhook:', JSON.stringify(payload, null, 2));

  // Meta requires a 200 OK immediately
  res.status(200).send('EVENT_RECEIVED');

  // Enqueue job to process message and auto-reply
  await communicationsQueue.add('process-meta-message', payload, {
    jobId: payload.entry?.[0]?.id || Date.now().toString(), // Simple idempotency
  });
};

exports.handleStripeWebhook = async (req, res) => {
  // Stripe requires raw body for signature validation
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    if (endpointSecret) {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } else {
      event = req.body;
    }
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();

  // Enqueue payment event (We can handle this later in Payment State Machine)
  await processPaymentEvent(event).catch(console.error);
};

exports.handleTikTokWebhook = async (req, res) => {
  const payload = req.body;
  res.status(200).send('EVENT_RECEIVED');
  
  await communicationsQueue.add('process-tiktok-lead', payload, {
    jobId: payload.lead_id || Date.now().toString(),
  });
};

exports.verifyMetaWebhook = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const verifyToken = process.env.META_VERIFY_TOKEN || 'aaa_consultancy_secret_token';

  if (mode && token) {
    if (mode === 'subscribe' && token === verifyToken) {
      console.log('Meta Webhook Verified Successfully!');
      return res.status(200).send(challenge);
    } else {
      console.warn('Meta Webhook Verification Failed: Token Mismatch');
      return res.status(403).send('Forbidden');
    }
  }
  return res.status(400).send('Bad Request');
};
