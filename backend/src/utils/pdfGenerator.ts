import PDFDocument from 'pdfkit';

interface BookingData {
  id: string;
  date: string;
  passengers: number;
  totalPrice: string;
  status: string;
  paymentStatus: string;
  createdAt: Date | string;
  route?: {
    from: string;
    to: string;
    type: string;
    time: string;
    price: string;
  };
  user?: {
    email: string;
  } | null;
}

/**
 * Generates a branded e-ticket PDF for a booking.
 * Returns a Buffer (no file I/O).
 */
export function generateTicketPDF(booking: BookingData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        info: {
          Title: `E-Ticket - ${booking.id}`,
          Author: 'Munna Tours & Travels',
        },
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const pageWidth = doc.page.width - 100; // accounting for margins

      // ─── Header Band ───
      doc.rect(50, 50, pageWidth, 80).fill('#000000');
      doc.fontSize(28).fill('#FFFFFF').font('Helvetica-Bold');
      doc.text('MUNNA TRAVELS', 70, 68, { width: pageWidth - 40 });
      doc.fontSize(11).fill('#AAAAAA').font('Helvetica');
      doc.text('Premium Charter Bus & Group Bookings', 70, 102, { width: pageWidth - 40 });

      // ─── E-Ticket Title ───
      doc.moveDown(2);
      const titleY = 155;
      doc.fontSize(20).fill('#000000').font('Helvetica-Bold');
      doc.text('E-TICKET', 50, titleY);
      doc.fontSize(10).fill('#666666').font('Helvetica');
      doc.text('Present this ticket at the time of boarding', 50, titleY + 26);

      // ─── Dotted Separator ───
      const sepY = titleY + 50;
      doc.moveTo(50, sepY).lineTo(50 + pageWidth, sepY)
        .dash(4, { space: 4 }).strokeColor('#CCCCCC').stroke();
      doc.undash();

      // ─── Booking Reference Box ───
      const refY = sepY + 15;
      doc.rect(50, refY, pageWidth, 45).fill('#F5F5F5');
      doc.fontSize(10).fill('#999999').font('Helvetica');
      doc.text('BOOKING REFERENCE', 70, refY + 8);
      doc.fontSize(16).fill('#000000').font('Helvetica-Bold');
      doc.text(booking.id.toUpperCase(), 70, refY + 22);

      // Status badge
      const statusColor = booking.status === 'Confirmed' ? '#16A34A' : 
                           booking.status === 'Completed' ? '#2563EB' : '#DC2626';
      const badgeX = 50 + pageWidth - 130;
      doc.rect(badgeX, refY + 10, 110, 25).fill(statusColor);
      doc.fontSize(10).fill('#FFFFFF').font('Helvetica-Bold');
      doc.text(booking.status.toUpperCase(), badgeX + 10, refY + 17, { width: 90, align: 'center' });

      // ─── Journey Details ───
      const journeyY = refY + 75;
      doc.fontSize(12).fill('#999999').font('Helvetica');
      doc.text('FROM', 70, journeyY);
      doc.fontSize(22).fill('#000000').font('Helvetica-Bold');
      doc.text(booking.route?.from || 'N/A', 70, journeyY + 18);

      // Arrow
      doc.fontSize(20).fill('#CCCCCC').font('Helvetica');
      doc.text('→', 250, journeyY + 18, { width: 40, align: 'center' });

      doc.fontSize(12).fill('#999999').font('Helvetica');
      doc.text('TO', 310, journeyY);
      doc.fontSize(22).fill('#000000').font('Helvetica-Bold');
      doc.text(booking.route?.to || 'N/A', 310, journeyY + 18);

      // ─── Details Grid ───
      const gridY = journeyY + 70;
      const colWidth = pageWidth / 3;

      // Row 1
      const detailRows = [
        [
          { label: 'TRAVEL DATE', value: booking.date },
          { label: 'PASSENGERS', value: String(booking.passengers) },
          { label: 'BUS TYPE', value: booking.route?.type || 'N/A' },
        ],
        [
          { label: 'JOURNEY DURATION', value: booking.route?.time || 'N/A' },
          { label: 'PRICE PER PERSON', value: booking.route?.price || 'N/A' },
          { label: 'TOTAL PRICE', value: `₹${booking.totalPrice}` },
        ],
        [
          { label: 'PAYMENT STATUS', value: booking.paymentStatus },
          { label: 'BOOKED ON', value: new Date(booking.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) },
          { label: 'PASSENGER EMAIL', value: booking.user?.email || 'Guest' },
        ],
      ];

      detailRows.forEach((row, rowIdx) => {
        const rowY = gridY + rowIdx * 55;

        // Row separator
        if (rowIdx > 0) {
          doc.moveTo(50, rowY - 10).lineTo(50 + pageWidth, rowY - 10)
            .strokeColor('#EEEEEE').lineWidth(1).stroke();
        }

        row.forEach((cell, colIdx) => {
          const cellX = 70 + colIdx * colWidth;
          doc.fontSize(9).fill('#999999').font('Helvetica');
          doc.text(cell.label, cellX, rowY);
          doc.fontSize(13).fill('#000000').font('Helvetica-Bold');
          doc.text(cell.value, cellX, rowY + 14, { width: colWidth - 30 });
        });
      });

      // ─── Bottom Separator ───
      const bottomSepY = gridY + detailRows.length * 55 + 10;
      doc.moveTo(50, bottomSepY).lineTo(50 + pageWidth, bottomSepY)
        .dash(4, { space: 4 }).strokeColor('#CCCCCC').stroke();
      doc.undash();

      // ─── Terms & Conditions ───
      const termsY = bottomSepY + 15;
      doc.fontSize(10).fill('#000000').font('Helvetica-Bold');
      doc.text('Terms & Conditions', 50, termsY);
      doc.fontSize(8).fill('#888888').font('Helvetica');
      const terms = [
        '• Please arrive at the boarding point at least 15 minutes before departure.',
        '• Carry a valid government-issued photo ID during travel.',
        '• Cancellation policy: Full refund if cancelled 24hrs before departure; 50% refund within 24hrs.',
        '• Munna Tours & Travels reserves the right to alter routes due to unforeseen circumstances.',
        '• For support, contact: support@munnatravels.com | +91 98765 43210',
      ];
      terms.forEach((term, i) => {
        doc.text(term, 50, termsY + 16 + i * 13, { width: pageWidth });
      });

      // ─── Footer ───
      const footerY = doc.page.height - 60;
      doc.fontSize(8).fill('#BBBBBB').font('Helvetica');
      doc.text(
        '© ' + new Date().getFullYear() + ' Munna Tours & Travels. All rights reserved. This is a computer-generated ticket and does not require a signature.',
        50, footerY, { width: pageWidth, align: 'center' }
      );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
