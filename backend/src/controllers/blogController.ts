import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { publishedAt: 'desc' },
    });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const getBlogBySlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const blog = await prisma.blog.findUnique({
      where: { slug },
    });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const createBlog = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    // Generate slug from title if not provided
    if (!data.slug) {
      data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    
    // Ensure tags is stringified JSON if it comes as an array
    if (Array.isArray(data.tags)) {
      data.tags = JSON.stringify(data.tags);
    }

    const blog = await prisma.blog.create({
      data,
    });
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create blog', error });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const data = req.body;
    
    if (Array.isArray(data.tags)) {
      data.tags = JSON.stringify(data.tags);
    }

    const blog = await prisma.blog.update({
      where: { id },
      data,
    });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update blog', error });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.blog.delete({
      where: { id },
    });
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete blog', error });
  }
};
