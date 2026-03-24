const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text, attachments = [] }) => {
  try {
    console.log("👉 Sending email to:", to);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully:", info.response);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
  }
};

module.exports = sendEmail;