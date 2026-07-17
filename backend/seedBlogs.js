const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const blogs = [
  {
    title: 'Top 5 Hill Stations to Visit by Train in India',
    slug: 'top-5-hill-stations-train',
    excerpt: 'Skip the winding mountain roads and enjoy scenic, comfortable rail journeys to India’s most beautiful high-altitude destinations.',
    content: '<p>Traveling by train offers a nostalgic and scenic way to explore India. When it comes to hill stations, toy trains and narrow-gauge railways provide an experience unlike any other.</p><h2>1. Shimla (Kalka-Shimla Railway)</h2><p>This UNESCO World Heritage site is a must-visit. The toy train takes you through 102 tunnels and over 800 bridges.</p><h2>2. Darjeeling (Himalayan Railway)</h2><p>The oldest mountain railway in India, offering breathtaking views of Kanchenjunga.</p><h2>3. Ooty (Nilgiri Mountain Railway)</h2><p>A completely unique rack railway that climbs the steep gradients of the Nilgiris.</p>',
    coverImage: 'https://images.unsplash.com/photo-1596884639943-7a95632eb518?q=80&w=1000&auto=format&fit=crop',
    tags: JSON.stringify(['Trains', 'Hill Stations', 'Scenic']),
    author: 'Rahul Sharma',
    status: 'published'
  },
  {
    title: 'Ultimate Guide to Renting Luxury Cars for Road Trips',
    slug: 'luxury-car-rental-guide',
    excerpt: 'Make your next road trip unforgettable. Learn how to securely rent and drive premium cars like Mercedes, BMW, and Audi across India.',
    content: '<p>Road trips are about the journey, not just the destination. Driving a luxury car elevates this experience significantly.</p><h2>Why Rent a Luxury Car?</h2><p>Comfort, advanced safety features, and sheer driving pleasure. Modern rental services offer self-drive luxury cars at surprisingly accessible rates.</p><h2>Things to Keep in Mind</h2><ul><li><strong>Insurance:</strong> Always opt for zero-depreciation coverage.</li><li><strong>Deposit:</strong> Be prepared for a substantial security deposit.</li><li><strong>Fuel Policy:</strong> Understand whether it is full-to-full or pre-paid.</li></ul><p>With Munna Travels, you can book premium fleet vehicles seamlessly from our app!</p>',
    coverImage: 'https://images.unsplash.com/photo-1503376712351-468305f57fcb?q=80&w=1000&auto=format&fit=crop',
    tags: JSON.stringify(['Cars', 'Luxury', 'Road Trip']),
    author: 'Neha Gupta',
    status: 'published'
  },
  {
    title: 'How Early Should You Book Flights for Holiday Seasons?',
    slug: 'when-to-book-holiday-flights',
    excerpt: 'Diwali and Christmas can drain your wallet if you book late. Discover the mathematical sweet spot for cheap airline tickets.',
    content: '<p>Booking flights during peak Indian festivals like Diwali, Holi, or Christmas is notoriously expensive. But when is the absolute best time to book?</p><h2>The "Sweet Spot"</h2><p>Data shows that booking <strong>45 to 60 days in advance</strong> yields the lowest fares for domestic flights.</p><h2>Mid-Week Magic</h2><p>Flying on a Tuesday or Wednesday is historically 15-20% cheaper than flying on a Friday or Sunday.</p><p>Use Munna Travels to track flight prices and set alerts so you never miss a great deal!</p>',
    coverImage: 'https://images.unsplash.com/photo-1436491865332-7a615061c4ca?q=80&w=1000&auto=format&fit=crop',
    tags: JSON.stringify(['Flights', 'Budget', 'Festivals']),
    author: 'Vikram Singh',
    status: 'published'
  }
];

async function main() {
  console.log('Seeding blogs...');
  for (const blog of blogs) {
    await prisma.blog.upsert({
      where: { slug: blog.slug },
      update: {},
      create: blog,
    });
  }
  console.log('✅ Blogs seeded successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
