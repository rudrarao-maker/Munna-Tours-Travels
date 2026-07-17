import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// Ethereal is a fake SMTP service, mostly aimed at Node.js developers
// It catches all emails and provides a link to preview them.
let transporter: nodemailer.Transporter | null = null;

const createTransporter = async () => {
  if (transporter) return transporter;

  try {
    // Generate a test account if we don't have real credentials
    const testAccount = await nodemailer.createTestAccount();

    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || testAccount.user, 
        pass: process.env.EMAIL_PASS || testAccount.pass, 
      },
    });

    console.log(`📧 Ethereal Email Service Ready. (User: ${testAccount.user})`);
    return transporter;
  } catch (error) {
    console.error('Failed to create email transporter', error);
    return null;
  }
};

export const generateBookingConfirmationHtml = (booking: any) => {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #000; color: #fff; padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase;">TripNova Holidays</h1>
      </div>
      <div style="padding: 32px;">
        <h2 style="margin-top: 0; color: #111827;">Booking Confirmed! 🎉</h2>
        <p style="color: #4b5563; line-height: 1.6;">Hello,</p>
        <p style="color: #4b5563; line-height: 1.6;">Your booking has been successfully confirmed. Get ready for an amazing journey!</p>
        
        <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 24px 0;">
          <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; color: #6b7280; letter-spacing: 1px;">Booking Details</h3>
          <p style="margin: 8px 0; font-weight: bold;">ID: ${booking.id}</p>
          <p style="margin: 8px 0;">Date: ${booking.date}</p>
          <p style="margin: 8px 0;">Passengers: ${booking.passengers}</p>
          <p style="margin: 8px 0; font-weight: bold; color: #10b981;">Total Paid: ₹${booking.totalPrice}</p>
        </div>

        <p style="color: #4b5563; line-height: 1.6;">You can download your E-Ticket directly from your dashboard.</p>
        
        <div style="text-align: center; margin-top: 32px;">
          <a href="http://localhost:3000/dashboard" style="display: inline-block; background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">View Dashboard</a>
        </div>
      </div>
      <div style="background-color: #f9fafb; padding: 16px; text-align: center; color: #9ca3af; font-size: 12px;">
        © 2026 TripNova Holidays. All rights reserved.
      </div>
    </div>
  `;
};

export const generateAndSendPDF = async (booking: any, userEmail: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      // 1. Generate PDF
      const doc = new PDFDocument();
      const pdfPath = path.join(__dirname, `../booking_${booking.id}.pdf`);
      const stream = fs.createWriteStream(pdfPath);
      doc.pipe(stream);

      doc.fontSize(25).text('TripNova Holidays', { align: 'center' });
      doc.moveDown();
      doc.fontSize(16).text('Booking Confirmation', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Booking ID: ${booking.id}`);
      doc.text(`Date: ${booking.date}`);
      doc.text(`Passengers: ${booking.passengers}`);
      doc.text(`Total Price: ${booking.totalPrice}`);
      doc.text(`Status: ${booking.status}`);
      doc.end();

      // 2. Wait for PDF to finish writing
      stream.on('finish', async () => {
        try {
          const t = await createTransporter();
          if (!t) throw new Error('Transporter not initialized');

          const info = await t.sendMail({
            from: '"TripNova Holidays" <noreply@tripnova.com>',
            to: userEmail || 'customer@example.com',
            subject: 'Your Booking Itinerary - TripNova Holidays',
            html: generateBookingConfirmationHtml(booking),
            attachments: [
              {
                filename: 'Booking_Itinerary.pdf',
                path: pdfPath,
              },
            ],
          });

          console.log('✅ Email sent: %s', info.messageId);
          console.log('🔗 Preview URL: %s', nodemailer.getTestMessageUrl(info));
          
          // Cleanup file
          if (fs.existsSync(pdfPath)) {
            fs.unlinkSync(pdfPath);
          }
          
          resolve(true);
        } catch (err) {
          reject(err);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};
