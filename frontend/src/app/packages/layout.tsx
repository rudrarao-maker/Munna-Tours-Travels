import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tour Packages | Munna Tours & Travels',
  description: 'Explore our premium tour packages to top destinations across India. Book your dream vacation with Munna Tours & Travels today.',
  openGraph: {
    title: 'Tour Packages | Munna Tours & Travels',
    description: 'Explore our premium tour packages to top destinations across India.',
    images: [{ url: 'https://images.unsplash.com/photo-1506461883276-594c39bb2400?w=1200' }],
  },
};

export default function PackagesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
