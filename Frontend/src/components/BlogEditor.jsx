import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { api } from '../services/api';

const CATEGORIES = ['Trends', 'Product Reviews', 'Shopping Tips', 'Seasonal', 'Industry News', 'General'];

export default function BlogEditor({ blog, generated, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'General',
    tags: [],
    seoTitle: '',
    seoDescription: '',
    status: 'draft',
  });
  const [tagInput, setTagInput] = useState('');
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [seoLoading, setSeoLoading] = useState(false);
  const [seoTips, setSeoTips] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (blog) {
      setForm({
        title: blog.title || '',
        content: blog.content || '',
        excerpt: blog.excerpt || '',
        category: blog.category || 'General',
        tags: blog.tags || [],
        seoTitle: blog.seoTitle || '',
        seoDescription: blog.seoDescription || '',
        status: blog.status || 'draft',
      });
    } else if (generated) {
      setForm({
        title: generated.title || '',
        content: generated.content || '',
        excerpt: generated.excerpt || '',
        category: generated.category || 'General',
        tags: generated.tags || [],
        seoTitle: generated.seoTitle || generated.title || '',
        seoDescription: generated.seoDescription || generated.excerpt || '',
        status: 'draft',
      });
    }
  }, [blog, generated]);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function addTag() {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      updateField('tags', [...form.tags, tag]);
      setTagInput('');
    }
  }

  function removeTag(tag) {
    updateField('tags', form.tags.filter((t) => t !== tag));
  }

  async function handleSeoImprove() {
    setSeoLoading(true);
    setError(null);
    try {
      const result = await api.improveSeo({
        title: form.title,
        content: form.content,
        keywords: form.tags.join(', '),
      });
      setForm((prev) => ({
        ...prev,
        seoTitle: result.seoTitle || prev.seoTitle,
        seoDescription: result.seoDescription || prev.seoDescription,
        tags: result.suggestedTags || prev.tags,
      }));
      setSeoTips(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setSeoLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSave(form);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2>{blog ? 'Edit Post' : 'New Post'}</h2>
          <p>Review and refine your retail blog content</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-ghost" onClick={() => setPreview(!preview)}>
            {preview ? 'Edit' : 'Preview'}
          </button>
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        </div>
      </header>

      {error && <div className="alert alert-error">{error}</div>}

      {preview ? (
        <article className="card preview-card">
          <h1>{form.title}</h1>
          <p className="preview-meta">{form.category} · {form.tags.join(', ')}</p>
          <ReactMarkdown>{form.content}</ReactMarkdown>
        </article>
      ) : (
        <form className="editor-layout" onSubmit={handleSubmit}>
          <div className="editor-main">
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Content * (Markdown supported)</label>
              <textarea
                rows={18}
                value={form.content}
                onChange={(e) => updateField('content', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Excerpt</label>
              <textarea
                rows={3}
                value={form.excerpt}
                onChange={(e) => updateField('excerpt', e.target.value)}
              />
            </div>
          </div>

          <aside className="editor-sidebar">
            <div className="card">
              <h3>Publish</h3>
              <div className="form-group">
                <label>Status</label>
                <select value={form.status} onChange={(e) => updateField('status', e.target.value)}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
                {saving ? 'Saving...' : 'Save Post'}
              </button>
            </div>

            <div className="card">
              <h3>Category & Tags</h3>
              <div className="form-group">
                <label>Category</label>
                <select value={form.category} onChange={(e) => updateField('category', e.target.value)}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Tags</label>
                <div className="tag-input-row">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add tag"
                  />
                  <button type="button" className="btn btn-secondary btn-sm" onClick={addTag}>+</button>
                </div>
                <div className="tags">
                  {form.tags.map((tag) => (
                    <span key={tag} className="tag removable" onClick={() => removeTag(tag)}>
                      {tag} ×
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header-row">
                <h3>SEO</h3>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleSeoImprove}
                  disabled={seoLoading}
                >
                  {seoLoading ? '...' : '✦ Improve'}
                </button>
              </div>
              <div className="form-group">
                <label>SEO Title</label>
                <input
                  type="text"
                  value={form.seoTitle}
                  onChange={(e) => updateField('seoTitle', e.target.value)}
                  maxLength={60}
                />
                <span className="char-count">{form.seoTitle.length}/60</span>
              </div>
              <div className="form-group">
                <label>Meta Description</label>
                <textarea
                  rows={3}
                  value={form.seoDescription}
                  onChange={(e) => updateField('seoDescription', e.target.value)}
                  maxLength={160}
                />
                <span className="char-count">{form.seoDescription.length}/160</span>
              </div>
              {seoTips && (
                <div className="seo-tips">
                  <p>SEO Score: <strong>{seoTips.seoScore}/100</strong></p>
                  <ul>
                    {seoTips.suggestions?.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </form>
      )}
    </div>
  );
}
