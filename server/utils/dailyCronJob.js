
import cron from 'node-cron';
import Deadline from './models/Deadline.js';
import dotenv from 'dotenv';
import twilio from 'twilio';
dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

cron.schedule('0 9 * * *', async () => {
  const today = new Date();
  const deadlines = await Deadline.find({ done: false, sent: false });

  for (const deadline of deadlines) {
    const remindDate = new Date(deadline.deadline);
    remindDate.setDate(remindDate.getDate() - deadline.remindBeforeDays);

    const isToday = today.toDateString() === remindDate.toDateString();

    if (isToday) {
      await client.messages.create({
        from: 'whatsapp:+14155238886',
        to: `whatsapp:${deadline.phoneNumber}`,
        body: `🔔 Reminder: ${deadline.title}\n${deadline.content}`,
      });
      deadline.sent = true;
      await deadline.save();
    }
  }
});
