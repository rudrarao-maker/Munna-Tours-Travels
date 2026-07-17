'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, User, Share2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function BlogDetail() {
  const { slug } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/blogs/${slug}`);
        setBlog(res.data);
      } catch (err) {
        console.error('Failed to load blog', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchBlog();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
    </div>
  );

  if (error || !blog) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-black mb-4 text-black">Blog Not Found</h1>
      <p className="text-gray-500 mb-8 font-medium">The travel guide you're looking for doesn't exist or has been removed.</p>
      <Link href="/blogs" className="bg-black text-white px-8 py-3 rounded-xl font-bold flex items-center">
        <ArrowLeft className="mr-2" size={20} /> Back to Blogs
      </Link>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <article className="max-w-4xl mx-auto px-4">
          
          <Link href="/blogs" className="inline-flex items-center text-gray-500 hover:text-black font-bold mb-8 transition-colors">
            <ArrowLeft className="mr-2" size={20} /> All Articles
          </Link>

          <div className="mb-10">
            <div className="flex gap-2 mb-6">
              {(() => {
                let parsedTags = [];
                try { parsedTags = JSON.parse(blog.tags); } catch(e) {}
                if (!Array.isArray(parsedTags)) parsedTags = [];
                return parsedTags.map((tag: string, idx: number) => (
                  <span key={idx} className="bg-blue-100 text-blue-700 text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {tag}
                  </span>
                ));
              })()}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-black leading-tight mb-6">
              {blog.title}
            </h1>
            
            <div className="flex items-center gap-6 text-gray-500 font-medium pb-8 border-b">
              <div className="flex items-center gap-2">
                <User size={18} /> <span>{blog.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} /> <span>{new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <button className="flex items-center gap-2 hover:text-black transition-colors ml-auto">
                <Share2 size={18} /> <span>Share</span>
              </button>
            </div>
          </div>

          {blog.coverImage && (
            <div className="w-full h-[400px] md:h-[600px] rounded-3xl overflow-hidden mb-12 shadow-xl bg-gray-200">
              <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="prose prose-lg md:prose-xl max-w-none text-gray-800"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

        </article>
      </main>

      <Footer />
    </div>
  );
}
