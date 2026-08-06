import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config.js';

async function ensureDataDir() {
  await fs.mkdir(config.dataDir, { recursive: true });
}

async function readBlogs() {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(config.blogsFile, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeBlogs(blogs) {
  await ensureDataDir();
  await fs.writeFile(config.blogsFile, JSON.stringify(blogs, null, 2), 'utf-8');
}

export async function getAllBlogs() {
  const blogs = await readBlogs();
  return blogs.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

export async function getBlogById(id) {
  const blogs = await readBlogs();
  return blogs.find((b) => b.id === id) || null;
}

export async function createBlog(data) {
  const blogs = await readBlogs();
  const now = new Date().toISOString();
  const blog = {
    id: uuidv4(),
    title: data.title,
    slug: data.slug || slugify(data.title),
    content: data.content,
    excerpt: data.excerpt || '',
    tags: data.tags || [],
    category: data.category || 'General',
    seoTitle: data.seoTitle || data.title,
    seoDescription: data.seoDescription || data.excerpt || '',
    status: data.status || 'draft',
    scheduledAt: data.scheduledAt || null,
    publishedAt: data.publishedAt || null,
    createdAt: now,
    updatedAt: now,
  };
  blogs.push(blog);
  await writeBlogs(blogs);
  return blog;
}

export async function updateBlog(id, updates) {
  const blogs = await readBlogs();
  const index = blogs.findIndex((b) => b.id === id);
  if (index === -1) return null;

  const updated = {
    ...blogs[index],
    ...updates,
    id,
    updatedAt: new Date().toISOString(),
  };

  if (updates.title && !updates.slug) {
    updated.slug = slugify(updates.title);
  }

  blogs[index] = updated;
  await writeBlogs(blogs);
  return updated;
}

export async function deleteBlog(id) {
  const blogs = await readBlogs();
  const filtered = blogs.filter((b) => b.id !== id);
  if (filtered.length === blogs.length) return false;
  await writeBlogs(filtered);
  return true;
}

export async function getScheduledBlogs() {
  const blogs = await readBlogs();
  return blogs.filter((b) => b.status === 'scheduled' && b.scheduledAt);
}

export async function publishBlog(id) {
  return updateBlog(id, {
    status: 'published',
    publishedAt: new Date().toISOString(),
    scheduledAt: null,
  });
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
