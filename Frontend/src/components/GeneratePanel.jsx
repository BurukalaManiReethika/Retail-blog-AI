import { useState } from 'react';
import { api } from '../services/api';

const CATEGORIES = ['Trends', 'Product Reviews', 'Shopping Tips', 'Seasonal', 'Industry News'];
const TONES = ['informative and friendly', 'professional', 'casual and engaging', 'persuasive'];

export default function GeneratePanel({ onGenerated }) {
  const [tab, setTab] = useState('post');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ideas, setIdeas] = useState([]);

  const [postForm, setPostForm] = useState({
    topic: '',
    category: 'Trends',
    keywords: '',
    tone: 'informative and friendly',
    wordCount: 800,
  });

  const [ideasForm, setIdeasForm] = useState({
    niche: 'retail trends, product reviews, shopping tips',
    count: 5,
  });

  async function handleGeneratePost(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await api.generatePost(postForm);
      onGenerated(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateIdeas(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await api.generateIdeas(ideasForm);
      setIdeas(result.ideas || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function useIdea(idea) {
    setPostForm({
      ...postForm,
      topic: idea.title,
      category: idea.category,
      keywords: idea.keywords?.join(', ') || '',
    });
    setTab('post');
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2>AI Content Generator</h2>
          <p>Generate SEO-optimized retail blog posts with Gemini</p>
        </div>
      </header>

      <div className="tabs">
        <button className={tab === 'post' ? 'active' : ''} onClick={() => setTab('post')}>
          Generate Post
        </button>
        <button className={tab === 'ideas' ? 'active' : ''} onClick={() => setTab('ideas')}>
          Blog Ideas
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {tab === 'post' && (
        <form className="card form-card" onSubmit={handleGeneratePost}>
          <div className="form-group">
            <label>Topic *</label>
            <input
              type="text"
              value={postForm.topic}
              onChange={(e) => setPostForm({ ...postForm, topic: e.target.value })}
              placeholder="e.g. Top 10 Sustainable Fashion Trends for 2026"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                value={postForm.category}
                onChange={(e) => setPostForm({ ...postForm, category: e.target.value })}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Word Count</label>
              <input
                type="number"
                min={300}
                max={3000}
                value={postForm.wordCount}
                onChange={(e) => setPostForm({ ...postForm, wordCount: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>SEO Keywords</label>
            <input
              type="text"
              value={postForm.keywords}
              onChange={(e) => setPostForm({ ...postForm, keywords: e.target.value })}
              placeholder="sustainable fashion, eco-friendly clothing, retail trends"
            />
          </div>

          <div className="form-group">
            <label>Tone</label>
            <select
              value={postForm.tone}
              onChange={(e) => setPostForm({ ...postForm, tone: e.target.value })}
            >
              {TONES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Generating with Gemini...' : '✦ Generate Blog Post'}
          </button>
        </form>
      )}

      {tab === 'ideas' && (
        <>
          <form className="card form-card" onSubmit={handleGenerateIdeas}>
            <div className="form-group">
              <label>Niche / Focus</label>
              <input
                type="text"
                value={ideasForm.niche}
                onChange={(e) => setIdeasForm({ ...ideasForm, niche: e.target.value })}
                placeholder="e.g. home decor, fashion, electronics retail"
              />
            </div>
            <div className="form-group">
              <label>Number of Ideas</label>
              <input
                type="number"
                min={3}
                max={10}
                value={ideasForm.count}
                onChange={(e) => setIdeasForm({ ...ideasForm, count: Number(e.target.value) })}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Generating ideas...' : 'Generate Blog Ideas'}
            </button>
          </form>

          {ideas.length > 0 && (
            <div className="ideas-grid">
              {ideas.map((idea, i) => (
                <div key={i} className="idea-card">
                  <span className="badge">{idea.category}</span>
                  <h4>{idea.title}</h4>
                  <p>{idea.description}</p>
                  <div className="tags">
                    {idea.keywords?.map((kw) => (
                      <span key={kw} className="tag">{kw}</span>
                    ))}
                  </div>
                  <button className="btn btn-secondary btn-sm" onClick={() => useIdea(idea)}>
                    Use This Idea →
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
