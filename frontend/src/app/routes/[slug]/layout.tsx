import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  // Create a default title based on slug (e.g. ahmedabad-mumbai -> Ahmedabad Mumbai)
  const formattedSlug = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' to ');

  return {
    title: `Charter Bus from ${formattedSlug} | Munna Travels`,
    description: `Request a quote for a private charter bus from ${formattedSlug}. We offer premium coaches, minibuses, and sleepers for group travel.`,
    openGraph: {
      title: `Charter Bus from ${formattedSlug} | Munna Travels`,
      description: `Request a quote for a private charter bus from ${formattedSlug}. We offer premium coaches, minibuses, and sleepers for group travel.`,
    }
  };
}

export default function RouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
