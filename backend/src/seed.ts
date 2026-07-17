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

  const userHashedPassword = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: userHashedPassword,
      role: 'customer',
      name: 'John Doe',
      phone: '1234567890'
    },
  });
  console.log('Customer user created (user@example.com / password123)');

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

  // Generate 100+ Hotels
  console.log('Seeding 100+ Hotels...');
  const statesAndCities = [
    { state: 'Rajasthan', cities: ['Jaipur', 'Udaipur', 'Jodhpur', 'Jaisalmer', 'Mount Abu'] },
    { state: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Lonavala', 'Mahabaleshwar', 'Aurangabad'] },
    { state: 'Gujarat', cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhuj'] },
    { state: 'Kerala', cities: ['Munnar', 'Kochi', 'Alleppey', 'Wayanad', 'Trivandrum'] },
    { state: 'Uttarakhand', cities: ['Mussoorie', 'Nainital', 'Dehradun', 'Rishikesh', 'Haridwar'] },
    { state: 'Himachal Pradesh', cities: ['Manali', 'Shimla', 'Dharamshala', 'Dalhousie', 'Kasol'] },
    { state: 'Goa', cities: ['North Goa', 'South Goa', 'Panaji', 'Vagator'] },
    { state: 'Karnataka', cities: ['Bangalore', 'Mysore', 'Coorg', 'Chikmagalur'] },
    { state: 'Tamil Nadu', cities: ['Ooty', 'Kodaikanal', 'Chennai', 'Coimbatore'] },
    { state: 'West Bengal', cities: ['Darjeeling', 'Kolkata', 'Siliguri'] }
  ];

  const prefixes = ['The Grand', 'Royal', 'Taj', 'Lemon Tree', 'Radisson', 'ITC', 'Oberoi', 'Trident', 'Novotel', 'Hyatt', 'Marriott', 'Zostel', 'Sterling', 'Club Mahindra'];
  const suffixes = ['Palace', 'Resort & Spa', 'Hotel', 'Retreat', 'Residency', 'Inn', 'Suites', 'Boutique Hotel'];
  const types = ['5-Star Hotel', '4-Star Hotel', '3-Star Hotel', 'Resort', 'Boutique Hotel', 'Hostel'];
  const baseImages = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
    'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'
  ];

  let hotelCount = 0;

  // Clear existing hotels first to avoid duplicates on re-seed
  await prisma.hotel.deleteMany({});

  for (const region of statesAndCities) {
    for (const city of region.cities) {
      // Create 2 to 4 hotels per city
      const numHotels = Math.floor(Math.random() * 3) + 2; 
      
      for (let i = 0; i < numHotels; i++) {
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        const type = types[Math.floor(Math.random() * types.length)];
        const image = baseImages[Math.floor(Math.random() * baseImages.length)];
        
        let starRating = 3;
        if (type === '5-Star Hotel' || prefix === 'Taj' || prefix === 'Oberoi') starRating = 5;
        if (type === '4-Star Hotel' || prefix === 'Marriott') starRating = 4;
        if (type === 'Hostel') starRating = 2;

        let basePrice = 2000;
        if (starRating === 5) basePrice = 12000 + Math.floor(Math.random() * 8000);
        if (starRating === 4) basePrice = 6000 + Math.floor(Math.random() * 4000);
        if (starRating === 3) basePrice = 2500 + Math.floor(Math.random() * 2000);
        if (starRating === 2) basePrice = 800 + Math.floor(Math.random() * 800);

        await prisma.hotel.create({
          data: {
            name: `${prefix} ${city} ${suffix}`,
            location: `Central ${city}, ${region.state}`,
            city: city,
            state: region.state,
            type: type,
            description: `Experience the best of ${city} at our premium ${type.toLowerCase()}. Enjoy modern amenities, excellent service, and a memorable stay.`,
            starRating: starRating,
            pricePerNight: basePrice,
            amenities: JSON.stringify(['WiFi', 'AC', 'Restaurant', 'Room Service', 'TV', starRating > 3 ? 'Pool' : '', starRating === 5 ? 'Spa' : ''].filter(Boolean)),
            images: JSON.stringify([image]),
            contactPhone: `+91 ${Math.floor(1000000000 + Math.random() * 9000000000)}`,
            contactEmail: `info@${prefix.toLowerCase().replace(/ /g, '')}${city.toLowerCase()}.com`,
            latitude: 20 + Math.random() * 10,
            longitude: 70 + Math.random() * 10,
            isActive: true,
            totalRooms: 50 + Math.floor(Math.random() * 100),
            availableRooms: 10 + Math.floor(Math.random() * 40)
          }
        });
        hotelCount++;
      }
    }
  }

  console.log(`Successfully seeded ${hotelCount} hotels across India!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
