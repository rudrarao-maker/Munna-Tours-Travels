import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Travel Blogs & Guides | Munna Tours & Travels',
  description: 'Read the latest travel tips, destination guides, and stories from Munna Tours & Travels.',
  openGraph: {
    title: 'Travel Blogs & Guides | Munna Tours & Travels',
    description: 'Read the latest travel tips, destination guides, and stories.',
    images: [{ url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200' }],
  },
};

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
