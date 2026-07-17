'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get('/blogs');
        // Only show published blogs to public
        setBlogs(res.data.filter((b: any) => b.status === 'published'));
      } catch (err) {
        console.error('Error fetching blogs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-7xl">
          
          <div className="text-center mb-16">
            <h1 className="text-5xl font-black mb-4">Travel Guides & Stories</h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Discover the best destinations, travel tips, and exclusive guides from the Munna Travels experts.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center p-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map(blog => (
                <Link href={`/blogs/${blog.slug}`} key={blog.id} className="group bg-white rounded-3xl overflow-hidden border shadow-sm hover:shadow-xl transition-all block">
                  <div className="h-60 overflow-hidden relative bg-gray-200">
                    {blog.coverImage ? (
                      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
                           style={{ backgroundImage: `url('${blog.coverImage}')` }}></div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-400">No Image</div>
                    )}
                  </div>
                  <div className="p-8">
                    <div className="flex gap-2 mb-4">
                      {(() => {
                        let parsedTags = [];
                        try { parsedTags = JSON.parse(blog.tags); } catch(e) {}
                        if (!Array.isArray(parsedTags)) parsedTags = [];
                        return parsedTags.slice(0,2).map((tag: string, idx: number) => (
                          <span key={idx} className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                            {tag}
                          </span>
                        ));
                      })()}
                    </div>
                    <h3 className="text-2xl font-black mb-3 text-black leading-tight group-hover:text-blue-600 transition-colors">{blog.title}</h3>
                    <p className="text-gray-500 mb-6 line-clamp-3 font-medium">
                      {blog.excerpt || 'Read the full story to learn more about this destination.'}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-gray-800">{blog.author}</span>
                      <span className="text-gray-400 font-medium">{new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && blogs.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border">
              <h3 className="text-2xl font-bold text-gray-400">No travel guides available right now.</h3>
              <p className="text-gray-500 mt-2">Check back soon for exciting travel stories!</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
