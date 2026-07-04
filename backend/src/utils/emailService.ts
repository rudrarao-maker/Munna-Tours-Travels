import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// Note: To test this, you'll need valid SMTP credentials in .env, e.g. 
// EMAIL_USER=your-email@gmail.com
// EMAIL_PASS=your-app-password

export const generateAndSendPDF = async (booking: any, userEmail: string) => {
  return new Promise((resolve, reject) => {
    try {
      // 1. Generate PDF
      const doc = new PDFDocument();
      const pdfPath = path.join(__dirname, `../booking_${booking.id}.pdf`);
      const stream = fs.createWriteStream(pdfPath);
      doc.pipe(stream);

      doc.fontSize(25).text('Munna Tours & Travels', { align: 'center' });
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
          // 3. Send Email
          const transporter = nodemailer.createTransport({
            service: 'gmail', // or your SMTP provider
            auth: {
              user: process.env.EMAIL_USER || 'test@test.com',
              pass: process.env.EMAIL_PASS || 'password',
            },
          });

          // Only attempt send if credentials exist, otherwise just resolve (for demo purposes)
          if (process.env.EMAIL_USER) {
            await transporter.sendMail({
              from: process.env.EMAIL_USER,
              to: userEmail,
              subject: 'Your Booking Itinerary - Munna Tours & Travels',
              text: 'Please find attached your booking confirmation.',
              attachments: [
                {
                  filename: 'Booking_Itinerary.pdf',
                  path: pdfPath,
                },
              ],
            });
          }
          
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
