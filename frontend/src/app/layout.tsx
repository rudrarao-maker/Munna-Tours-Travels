import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AIChatbot from '@/components/AIChatbot';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TripNova Holidays | Premium Charter Bus & Group Bookings',
  description: 'Book premium charter buses and coaches for your group trips across India. We offer Volvo, Scania, and luxury minibuses with customizable itineraries.',
  keywords: 'charter bus, bus booking, group travel, india bus tours, volvo hire, luxury coach rental',
  manifest: '/manifest.json',
  openGraph: {
    title: 'TripNova Holidays | Premium Charter Bus & Group Bookings',
    description: 'Book premium charter buses and coaches for your group trips across India.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'TripNova Holidays',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <AIChatbot />
          </div>
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
