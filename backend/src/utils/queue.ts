import { Queue, Worker } from 'bullmq';
import { generateAndSendPDF } from './emailService';

// We use the same Redis URL
const connection = {
  url: process.env.REDIS_URL || 'redis://localhost:6379'
};

export const emailQueue = new Queue('email-queue', { connection });

export const emailWorker = new Worker('email-queue', async job => {
  if (job.name === 'sendBookingConfirmation') {
    const { booking, userEmail } = job.data;
    console.log(`Processing email job for booking ${booking.id}...`);
    await generateAndSendPDF(booking, userEmail);
    console.log(`Email job for booking ${booking.id} completed.`);
  }
}, { connection });

emailWorker.on('completed', job => {
  console.log(`${job.id} has completed!`);
});

emailWorker.on('failed', (job, err) => {
  console.log(`${job?.id} has failed with ${err.message}`);
});
