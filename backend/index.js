const express = require('express');
const sendOtpEmail = require('./resend');
require('dotenv').config();

const app = express();
app.use(express.json());

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

app.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();

  const sent = await sendOtpEmail(email, otp);
  if (sent) {
    res.status(200).json({ message: 'OTP sent!' });
  } else {
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

app.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});
    