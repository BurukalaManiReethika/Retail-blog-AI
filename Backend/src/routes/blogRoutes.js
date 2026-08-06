import { Router } from 'express';
import {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getScheduledBlogs,
} from '../services/storageService.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const blogs = await getAllBlogs();
    res.json(blogs);
  } catch (err) {
    next(err);
  }
});

router.get('/scheduled', async (_req, res, next) => {
  try {
    const blogs = await getScheduledBlogs();
    res.json(blogs);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const blog = await getBlogById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    const blog = await createBlog(req.body);
    res.status(201).json(blog);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const blog = await updateBlog(req.params.id, req.body);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await deleteBlog(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Blog not found' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/schedule', async (req, res, next) => {
  try {
    const { scheduledAt } = req.body;
    if (!scheduledAt) {
      return res.status(400).json({ error: 'scheduledAt is required (ISO date string)' });
    }

    const publishDate = new Date(scheduledAt);
    if (Number.isNaN(publishDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }
    if (publishDate <= new Date()) {
      return res.status(400).json({ error: 'Scheduled date must be in the future' });
    }

    const blog = await updateBlog(req.params.id, {
      status: 'scheduled',
      scheduledAt: publishDate.toISOString(),
    });
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/publish', async (req, res, next) => {
  try {
    const blog = await updateBlog(req.params.id, {
      status: 'published',
      publishedAt: new Date().toISOString(),
      scheduledAt: null,
    });
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    next(err);
  }
});

export default router;
