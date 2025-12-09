import nodemailer from "nodemailer";

export const sendResetCode = async (toEmail, code) => {
  try {
    const host = process.env.EMAIL_HOST;
    const port = process.env.EMAIL_PORT;
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASSWORD;

    if (!host || !port || !user || !pass) {
      console.log(`⚠️ No SMTP configured, reset code for ${toEmail}: ${code}`);
      return;
    }

    const transporter = nodemailer.createTransport({
      host,
      port: Number(port),
      secure: Number(port) === 465, // true for 465, false for other ports
      auth: { user, pass },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: "Your Himalaya Homes Password Reset Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #2B5BBA;">Password Reset Code</h2>
          <p>Hello,</p>
          <p>Your password reset code is:</p>
          <h1 style="color: #2B5BBA; letter-spacing: 2px; font-size: 32px;">${code}</h1>
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr style="border: 1px solid #ccc;">
          <p style="color: #666; font-size: 12px;">© 2025 Himalaya Homes. All rights reserved.</p>
        </div>
      `,
    });

    console.log("✅ Reset email sent to:", toEmail);
  } catch (err) {
    console.error("❌ Error sending reset email:", err.message);
    throw err;
  }
};
