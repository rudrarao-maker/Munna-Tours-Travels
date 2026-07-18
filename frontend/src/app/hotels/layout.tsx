import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Premium Hotels | Munna Tours & Travels',
  description: 'Book the best luxury hotels and resorts for your next trip with Munna Tours & Travels.',
  openGraph: {
    title: 'Premium Hotels | Munna Tours & Travels',
    description: 'Book the best luxury hotels and resorts for your next trip.',
    images: [{ url: 'https://images.unsplash.com/photo-1542314831-c6a4d14d8379?w=1200' }],
  },
};

export default function HotelsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
