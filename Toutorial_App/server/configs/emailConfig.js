import nodemailer from "nodemailer";

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  const emailHost = process.env.EMAIL_HOST || process.env.MAIL_HOST;
  const emailPort = Number(process.env.EMAIL_PORT || 587);
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;

  if (!emailHost || !emailUser || !emailPassword) {
    throw new Error(
      "Email configuration missing. Set EMAIL_HOST (or MAIL_HOST), EMAIL_USER, and EMAIL_PASSWORD in server/.env"
    );
  }

  return nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    secure: emailPort === 465,
    auth: {
      user: emailUser,
      pass: emailPassword,
    },
  });
};

export default createTransporter;
