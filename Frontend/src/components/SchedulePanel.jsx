import { useState } from 'react';

export default function SchedulePanel({ blogs, selectedBlog, onSchedule, onBack }) {
  const [blogId, setBlogId] = useState(selectedBlog?.id || '');
  const [scheduledAt, setScheduledAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const draftBlogs = blogs.filter((b) => b.status === 'draft');
  const scheduledBlogs = blogs.filter((b) => b.status === 'scheduled');

  async function handleSchedule(e) {
    e.preventDefault();
    if (!blogId || !scheduledAt) return;

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await onSchedule(blogId, new Date(scheduledAt).toISOString());
      setMessage('Post scheduled successfully!');
      setBlogId('');
      setScheduledAt('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2>Schedule Publishing</h2>
          <p>Set automatic publish dates for your retail blog posts</p>
        </div>
        <button className="btn btn-secondary" onClick={onBack}>← Back to Posts</button>
      </header>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <form className="card form-card schedule-form" onSubmit={handleSchedule}>
        <div className="form-group">
          <label>Select Draft Post</label>
          <select value={blogId} onChange={(e) => setBlogId(e.target.value)} required>
            <option value="">Choose a draft...</option>
            {draftBlogs.map((b) => (
              <option key={b.id} value={b.id}>{b.title}</option>
            ))}
          </select>
          {draftBlogs.length === 0 && (
            <p className="hint">No draft posts available. Create or save a post as draft first.</p>
          )}
        </div>

        <div className="form-group">
          <label>Publish Date & Time</label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !blogId || draftBlogs.length === 0}
        >
          {loading ? 'Scheduling...' : '◷ Schedule Post'}
        </button>
      </form>

      <section className="card">
        <h3>Scheduled Posts</h3>
        {scheduledBlogs.length === 0 ? (
          <p className="empty-text">No posts scheduled yet.</p>
        ) : (
          <ul className="scheduled-list">
            {scheduledBlogs.map((blog) => (
              <li key={blog.id}>
                <div>
                  <strong>{blog.title}</strong>
                  <span className="meta">{blog.category}</span>
                </div>
                <span className="schedule-time">
                  {new Date(blog.scheduledAt).toLocaleString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="info-box">
        <p>
          The backend scheduler checks every minute and automatically publishes posts
          when their scheduled time arrives.
        </p>
      </div>
    </div>
  );
}
