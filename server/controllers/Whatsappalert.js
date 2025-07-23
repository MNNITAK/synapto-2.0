// controllers/whatsappController.js
import dotenv from 'dotenv';
import twilio from 'twilio';
dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendWhatsAppAlerts = async (req, res) => {
  const { message } = req.body;

  // ✅ Local array of numbers (no DB call)
  const numbers = [
    '+919120991471',
    '+918005366053'
    // add more numbers here
  ];

  try {
    for (const num of numbers) {
      await client.messages.create({
        from: 'whatsapp:+14155238886',
        to: `whatsapp:${num}`,
        body: message
      });
    }

    res.status(200).json({ success: true, message: 'Messages sent successfully to all numbers.' });
  } catch (error) {
    console.error('WhatsApp send error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
