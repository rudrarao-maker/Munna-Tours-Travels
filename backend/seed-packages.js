const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  await prisma.tourPackage.createMany({
    data: [
      {
        title: 'Golden Triangle Tour',
        slug: 'golden-triangle-tour',
        description: 'Explore Delhi, Agra, and Jaipur in a magnificent 5-day journey.',
        destination: 'Delhi-Agra-Jaipur',
        duration: '4N/5D',
        price: 25000,
        category: 'Family',
        images: JSON.stringify(['https://images.unsplash.com/photo-1564507592227-0b0f5c06a33b?w=800']),
        isPopular: true
      },
      {
        title: 'Kerala Backwaters Retreat',
        slug: 'kerala-backwaters-retreat',
        description: 'Relax in the beautiful houseboats of Alleppey.',
        destination: 'Kerala',
        duration: '3N/4D',
        price: 18000,
        category: 'Couple',
        images: JSON.stringify(['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800']),
        isPopular: true
      },
      {
        title: 'Himalayan Adventure',
        slug: 'himalayan-adventure',
        description: 'Trek the mountains of Manali and experience the thrill.',
        destination: 'Manali, Himachal Pradesh',
        duration: '5N/6D',
        price: 15000,
        category: 'Adventure',
        images: JSON.stringify(['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800']),
        isPopular: false
      }
    ]
  });
  console.log('Seeded packages');
}
seed().finally(() => prisma.$disconnect());
