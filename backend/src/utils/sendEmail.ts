import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
  // Legacy support
  email?: string;
  message?: string;
}

export const sendEmail = async (options: EmailOptions) => {
  const recipientEmail = options.to || options.email || '';
  const emailText = options.text || options.message || '';

  // If no SMTP credentials are provided, just log to console
  if (!process.env.SMTP_HOST && !process.env.EMAIL_USER) {
    console.log(`\n========================================`);
    console.log(`✉️ MOCK EMAIL SENT TO (${recipientEmail})`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Message: \n${emailText}`);
    console.log(`========================================\n`);
    return;
  }

  const transporter = nodemailer.createTransport(
    process.env.EMAIL_USER
      ? {
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        }
      : {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        }
  );

  const message: any = {
    from: process.env.EMAIL_USER || `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: recipientEmail,
    subject: options.subject,
    text: emailText,
  };

  if (options.html) {
    message.html = options.html;
  }

  await transporter.sendMail(message);
};
