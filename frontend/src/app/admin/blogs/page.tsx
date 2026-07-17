'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { PenTool, Plus, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';

export default function BlogManagement() {
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get('/blogs');
      setBlogs(res.data);
    } catch (err) {
      console.error('Failed to fetch blogs', err);
    }
  };

  const deleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    try {
      await axios.delete(`/blogs/${id}`);
      fetchBlogs();
    } catch (err) {
      console.error('Failed to delete blog', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-black text-black">Travel Blogs</h2>
          <p className="text-gray-500 font-medium">Manage travel guides and articles.</p>
        </div>
        <Link href="/admin/blogs/create" className="bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition">
          <Plus size={20} />
          Write New Blog
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400">
            <tr>
              <th className="p-4 font-bold">Title</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4 font-bold">Author</th>
              <th className="p-4 font-bold">Published</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map(blog => (
              <tr key={blog.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="p-4">
                  <p className="font-bold text-sm text-black">{blog.title}</p>
                  <p className="text-xs text-gray-400">/{blog.slug}</p>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${blog.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {blog.status}
                  </span>
                </td>
                <td className="p-4 text-gray-600 text-sm font-medium">{blog.author}</td>
                <td className="p-4 text-gray-500 text-sm">{new Date(blog.publishedAt).toLocaleDateString()}</td>
                <td className="p-4 text-right">
                  <button onClick={() => deleteBlog(blog.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition ml-2">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {blogs.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-gray-500 font-bold">No blogs found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
