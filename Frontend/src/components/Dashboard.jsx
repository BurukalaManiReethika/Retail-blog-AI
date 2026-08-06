export default function Dashboard({ blogs, onNavigate, health }) {
  const published = blogs.filter((b) => b.status === 'published').length;
  const drafts = blogs.filter((b) => b.status === 'draft').length;
  const scheduled = blogs.filter((b) => b.status === 'scheduled').length;
  const recent = blogs.slice(0, 5);

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p>Automated content creation for retail blogs</p>
        </div>
        <button className="btn btn-primary" onClick={() => onNavigate('generate')}>
          ✦ Generate New Post
        </button>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{blogs.length}</span>
          <span className="stat-label">Total Posts</span>
        </div>
        <div className="stat-card published">
          <span className="stat-value">{published}</span>
          <span className="stat-label">Published</span>
        </div>
        <div className="stat-card draft">
          <span className="stat-value">{drafts}</span>
          <span className="stat-label">Drafts</span>
        </div>
        <div className="stat-card scheduled">
          <span className="stat-value">{scheduled}</span>
          <span className="stat-label">Scheduled</span>
        </div>
      </div>

      {!health?.geminiConfigured && (
        <div className="alert alert-warning">
          Add your <code>GEMINI_API_KEY</code> to <code>backend/.env</code> to enable AI generation.
        </div>
      )}

      <section className="card">
        <h3>Recent Posts</h3>
        {recent.length === 0 ? (
          <p className="empty-text">No posts yet. Generate your first retail blog with AI!</p>
        ) : (
          <ul className="recent-list">
            {recent.map((blog) => (
              <li key={blog.id}>
                <div>
                  <strong>{blog.title}</strong>
                  <span className="meta">{blog.category} · {formatDate(blog.updatedAt)}</span>
                </div>
                <span className={`badge badge-${blog.status}`}>{blog.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="features-grid">
        <div className="feature-card" onClick={() => onNavigate('generate')}>
          <span className="feature-icon">✦</span>
          <h4>AI Content Generation</h4>
          <p>Gemini creates SEO-optimized posts about trends, reviews, and shopping tips.</p>
        </div>
        <div className="feature-card" onClick={() => onNavigate('blogs')}>
          <span className="feature-icon">☰</span>
          <h4>Content Management</h4>
          <p>Edit, preview, and organize all your retail blog posts in one place.</p>
        </div>
        <div className="feature-card" onClick={() => onNavigate('schedule')}>
          <span className="feature-icon">◷</span>
          <h4>Scheduled Publishing</h4>
          <p>Schedule posts to publish automatically at the perfect time.</p>
        </div>
      </section>
    </div>
  );
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
