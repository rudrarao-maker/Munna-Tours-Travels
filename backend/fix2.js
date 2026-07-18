const fs = require('fs');
const path = require('path');

const files = [
  'aiController.ts',
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
  
  c = c.replace(/as stringe/g, 'as string');
  c = c.replace(/as stringt/g, 'as string');
  c = c.replace(/as stringd/g, 'as string');
  
  // also fix trackingController.ts, aiController.ts which had Type 'string | string[]' is not assignable to type 'string'
  if (f === 'fleetController.ts') {
    c = c.replace(/const { vehicleId } = req.params;/g, 'const vehicleId = req.params.vehicleId as string;');
    c = c.replace(/const { type } = req.query;/g, 'const type = req.query.type as string;');
  }
  if (f === 'aiController.ts') {
    c = c.replace(/where: { sessionId: req.params.sessionId },/g, 'where: { sessionId: req.params.sessionId as string },');
  }
  if (f === 'trackingController.ts') {
    c = c.replace(/const { driverId } = req.params;/g, 'const driverId = req.params.driverId as string;');
  }
  if (f === 'packageController.ts') {
    c = c.replace(/const { id } = req.params;/g, 'const id = req.params.id as string;');
    c = c.replace(/const { slug } = req.params;/g, 'const slug = req.params.slug as string;');
  }

  fs.writeFileSync(p, c);
});

console.log('Fixed typos');
