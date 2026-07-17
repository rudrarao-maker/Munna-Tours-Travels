'use client';

import { useState } from 'react';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateBlog() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    author: 'Admin',
    status: 'published'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/blogs', formData);
      router.push('/admin/blogs');
    } catch (err) {
      console.error('Failed to create blog', err);
      alert('Error creating blog');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <Link href="/admin/blogs" className="p-2 rounded-xl hover:bg-gray-100 text-gray-500">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="text-2xl font-black text-black">Write Blog</h2>
            <p className="text-gray-500 font-medium">Create a new travel guide or article.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
            <input 
              type="text" required
              className="w-full border rounded-xl p-3 outline-none focus:border-black font-medium"
              value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Slug (optional)</label>
            <input 
              type="text" 
              placeholder="e.g. top-10-places"
              className="w-full border rounded-xl p-3 outline-none focus:border-black font-medium"
              value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Cover Image URL</label>
            <input 
              type="text" 
              placeholder="https://..."
              className="w-full border rounded-xl p-3 outline-none focus:border-black font-medium"
              value={formData.coverImage} onChange={e => setFormData({...formData, coverImage: e.target.value})}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Short Excerpt</label>
            <textarea 
              rows={2}
              className="w-full border rounded-xl p-3 outline-none focus:border-black font-medium"
              value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Blog Content (HTML or Text)</label>
            <textarea 
              required rows={15}
              className="w-full border rounded-xl p-4 outline-none focus:border-black font-medium font-mono text-sm"
              value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Author</label>
            <input 
              type="text" 
              className="w-full border rounded-xl p-3 outline-none focus:border-black font-medium"
              value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
            <select 
              className="w-full border rounded-xl p-3 outline-none focus:border-black font-medium bg-white"
              value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t flex justify-end">
          <button type="submit" className="bg-black text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition">
            <Save size={20} /> Publish Blog
          </button>
        </div>
      </form>
    </div>
  );
}
