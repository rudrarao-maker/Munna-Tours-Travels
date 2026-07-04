import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@munnatravels.com' },
    update: {},
    create: {
      email: 'admin@munnatravels.com',
      password: hashedPassword,
      role: 'admin',
    },
  });
  console.log('Admin user created (admin@munnatravels.com / admin123)');

  // Create Routes
  const popularRoutes = [
    { routeId: 'ahmedabad-mumbai', from: 'Ahmedabad', to: 'Mumbai', price: '₹900', time: '8 hrs 30 mins', type: 'Volvo A/C Sleeper', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=800&auto=format&fit=crop' },
    { routeId: 'ahmedabad-pune', from: 'Ahmedabad', to: 'Pune', price: '₹1200', time: '11 hrs 45 mins', type: 'Scania Multi-Axle Sleeper', image: 'https://images.unsplash.com/photo-1514498308433-ed3e100ce613?q=80&w=800&auto=format&fit=crop' },
    { routeId: 'ahmedabad-udaipur', from: 'Ahmedabad', to: 'Udaipur', price: '₹550', time: '5 hrs 15 mins', type: 'BharatBenz Premium Seater', image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2403f55?q=80&w=800&auto=format&fit=crop' },
    { routeId: 'ahmedabad-jaipur', from: 'Ahmedabad', to: 'Jaipur', price: '₹850', time: '10 hrs 30 mins', type: 'Volvo A/C Sleeper', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=800&auto=format&fit=crop' },
    { routeId: 'ahmedabad-jodhpur', from: 'Ahmedabad', to: 'Jodhpur', price: '₹750', time: '8 hrs 45 mins', type: 'A/C Semi-Sleeper', image: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?q=80&w=800&auto=format&fit=crop' },
    { routeId: 'ahmedabad-delhi', from: 'Ahmedabad', to: 'Delhi', price: '₹1500', time: '16 hrs 20 mins', type: 'Volvo Multi-Axle Sleeper', image: 'https://images.unsplash.com/photo-1585016595856-1e35a16d5526?q=80&w=800&auto=format&fit=crop' },
    { routeId: 'ahmedabad-surat', from: 'Ahmedabad', to: 'Surat', price: '₹350', time: '4 hrs 30 mins', type: 'Non-A/C Seater', image: 'https://images.unsplash.com/photo-1628198305002-3908db8c0e2a?q=80&w=800&auto=format&fit=crop' },
    { routeId: 'ahmedabad-vadodara', from: 'Ahmedabad', to: 'Vadodara', price: '₹200', time: '2 hrs 15 mins', type: 'A/C Seater', image: 'https://images.unsplash.com/photo-1562916895-3bc454921fbd?q=80&w=800&auto=format&fit=crop' },
    { routeId: 'ahmedabad-rajkot', from: 'Ahmedabad', to: 'Rajkot', price: '₹400', time: '4 hrs 45 mins', type: 'Premium A/C Seater', image: 'https://images.unsplash.com/photo-1622308644420-96896245a49b?q=80&w=800&auto=format&fit=crop' },
    { routeId: 'ahmedabad-indore', from: 'Ahmedabad', to: 'Indore', price: '₹650', time: '8 hrs 10 mins', type: 'A/C Sleeper', image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?q=80&w=800&auto=format&fit=crop' },
    { routeId: 'ahmedabad-ujjain', from: 'Ahmedabad', to: 'Ujjain', price: '₹700', time: '9 hrs 15 mins', type: 'Scania Multi-Axle Sleeper', image: 'https://images.unsplash.com/photo-1600100397608-f010f419c894?q=80&w=800&auto=format&fit=crop' },
    { routeId: 'ahmedabad-nathdwara', from: 'Ahmedabad', to: 'Nathdwara', price: '₹500', time: '6 hrs 10 mins', type: 'A/C Semi-Sleeper', image: 'https://images.unsplash.com/photo-1587222318667-27083dd4940e?q=80&w=800&auto=format&fit=crop' },
    { routeId: 'ahmedabad-mount-abu', from: 'Ahmedabad', to: 'Mount Abu', price: '₹450', time: '5 hrs 20 mins', type: 'Volvo A/C Seater', image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=800&auto=format&fit=crop' },
    { routeId: 'ahmedabad-bhuj', from: 'Ahmedabad', to: 'Bhuj', price: '₹600', time: '7 hrs 30 mins', type: 'A/C Sleeper', image: 'https://images.unsplash.com/photo-1582654316140-5e2069792e31?q=80&w=800&auto=format&fit=crop' },
    { routeId: 'ahmedabad-somnath', from: 'Ahmedabad', to: 'Somnath', price: '₹750', time: '8 hrs 45 mins', type: 'Volvo Multi-Axle Sleeper', image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=800&auto=format&fit=crop' },
  ];

  for (const route of popularRoutes) {
    await prisma.route.upsert({
      where: { routeId: route.routeId },
      update: {},
      create: route,
    });
  }
  console.log('15 Ahmedabad Routes seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
