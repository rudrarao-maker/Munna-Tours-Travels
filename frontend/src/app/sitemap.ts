import { MetadataRoute } from 'next';
import axios from 'axios';

// In a real app, you would fetch these from your backend
const getRoutesForSitemap = async () => {
  try {
    // const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/routes`);
    // return res.data;
    return [{ id: '1', from: 'Ahmedabad', to: 'Pune' }, { id: '2', from: 'Mumbai', to: 'Goa' }];
  } catch {
    return [];
  }
};

const getPackagesForSitemap = async () => {
  try {
    return [{ slug: 'kerala-backwaters' }, { slug: 'goa-beach' }];
  } catch {
    return [];
  }
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://munnatravels.com';

  const routeData = await getRoutesForSitemap();
  const packageData = await getPackagesForSitemap();

  const routeUrls = routeData.map((r: any) => ({
    url: `${baseUrl}/routes?route=${r.from}-${r.to}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  const packageUrls = packageData.map((p: any) => ({
    url: `${baseUrl}/packages/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/routes`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/packages`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...routeUrls,
    ...packageUrls,
  ];
}
