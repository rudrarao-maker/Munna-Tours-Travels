const fs = require('fs');
const path = require('path');

const files = [
  'bookingController.ts',
  'eticketController.ts', 
  'feedbackController.ts', 
  'fleetController.ts', 
  'hotelController.ts', 
  'notificationController.ts', 
  'packageController.ts', 
  'routeController.ts', 
  'trackingController.ts'
];

files.forEach(f => {
  const p = path.join('src/controllers', f);
  if (!fs.existsSync(p)) return;
  
  let c = fs.readFileSync(p, 'utf8');
  
  // Fix TS2322: Type 'string | string[]' is not assignable to type 'string'
  // by casting req.params.foo and req.query.foo to string
  c = c.replace(/req\.params\.([a-zA-Z0-9_]+)(?! as string)/g, 'req.params.$1 as string');
  c = c.replace(/req\.query\.([a-zA-Z0-9_]+)(?! as string)/g, 'req.query.$1 as string');
  
  // Fix totalPrice for booking controller pdfBuffer line
  if (f === 'bookingController.ts') {
    c = c.replace('const pdfBuffer = await generateTicketPDF(booking);', 'const pdfBuffer = await generateTicketPDF(booking as any);');
  }

  fs.writeFileSync(p, c);
});

console.log('Fixed controllers');
