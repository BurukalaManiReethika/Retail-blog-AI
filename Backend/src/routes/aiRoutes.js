import { Router } from 'express';
import { generateBlogPost, generateBlogIdeas, improveSeo } from '../services/openaiService.js';

const router = Router();

router.post('/generate', async (req, res, next) => {
  try {
    const { topic, category, keywords, tone, wordCount } = req.body;
    if (!topic?.trim()) {
      return res.status(400).json({ error: 'Topic is required' });
    }
    const result = await generateBlogPost({ topic, category, keywords, tone, wordCount });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/ideas', async (req, res, next) => {
  try {
    const { niche, count } = req.body;
    const result = await generateBlogIdeas({ niche, count });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/seo', async (req, res, next) => {
  try {
    const { title, content, keywords } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    const result = await improveSeo({ title, content, keywords });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
