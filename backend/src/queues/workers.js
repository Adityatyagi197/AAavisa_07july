const { Worker } = require('bullmq');
const { connection } = require('./connection');
const { failedJobsQueue } = require('./queueSetup');

// Helper to handle DLQ (Dead Letter Queue) mechanism
const handleJobFailure = async (job, err) => {
  if (job.attemptsMade >= job.opts.attempts) {
    console.error(`Job ${job.id} of type ${job.name} in queue ${job.queueName} failed permanently. Moving to DLQ.`);
    await failedJobsQueue.add(`dlq-${job.queueName}-${job.name}`, {
      originalJob: job.asJSON(),
      error: err.message,
      stack: err.stack
    }, {
      jobId: `failed-${job.id}` // Prevent duplicate DLQ entries
    });
  }
};

const setupWorkers = () => {
  if (process.env.DISABLE_REDIS === 'true') {
    console.log('BullMQ Workers are disabled (DISABLE_REDIS=true). Skipping worker initialization.');
    return;
  }

  // Communications Worker
  const communicationsWorker = new Worker('communications', async (job) => {
    console.log(`Processing communication job ${job.id}`);
    // Logic for processing webhook payload, auto-reply, saving to DB
  }, { connection });

  communicationsWorker.on('failed', handleJobFailure);

  // Reminders Worker
  const remindersWorker = new Worker('reminders', async (job) => {
    console.log(`Processing reminder job ${job.id}`);
    // Logic for sending meeting reminders
  }, { connection });

  remindersWorker.on('failed', handleJobFailure);

  // No-Show Enforcer Worker
  const noShowEnforcerWorker = new Worker('no-show-enforcer', async (job) => {
    console.log(`Processing no-show-enforcer job ${job.id}`);
    // Logic: check booking status, if not COMPLETED -> NO_SHOW -> block
  }, { connection });

  noShowEnforcerWorker.on('failed', handleJobFailure);

  // Payment Drip Worker
  const paymentDripWorker = new Worker('payment-drip', async (job) => {
    console.log(`Processing payment-drip job ${job.id}`);
    // Logic: send unpaid invoice reminders (2h, 24h, 48h, CEO Discount)
  }, { connection });

  paymentDripWorker.on('failed', handleJobFailure);

  console.log('BullMQ Workers initialized');
};

module.exports = { setupWorkers };
