require('dotenv').config();
const { handleChatbotMessage } = require('./src/services/chatbotService');

async function runTest() {
  const testNumber = '+919999999999';
  const testName = 'Dev tester';

  console.log("1. Sending greeting message...");
  await handleChatbotMessage(testNumber, testName, 'hello');

  console.log("\n2. Sending Option '1' (Services list)...");
  await handleChatbotMessage(testNumber, testName, '1');

  console.log("\n3. Sending Option '2' (Packages list)...");
  await handleChatbotMessage(testNumber, testName, '2');

  console.log("\n4. Sending Option '3' (Status Check)...");
  await handleChatbotMessage(testNumber, testName, '3');

  console.log("\n5. Sending Option '4' (Talk to Live Agent)...");
  await handleChatbotMessage(testNumber, testName, '4');

  console.log("\n6. Sending message while Agent Mode is active (expecting chatbot to ignore it)...");
  await handleChatbotMessage(testNumber, testName, 'hello');

  console.log("\n7. Sending 'menu' to disable Agent Mode and reset bot...");
  await handleChatbotMessage(testNumber, testName, 'menu');
}

runTest().then(() => {
  console.log("\nChatbot interactive test completed successfully.");
  process.exit(0);
}).catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
