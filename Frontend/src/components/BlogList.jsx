import { useState } from 'react';

export default function BlogList({ blogs, onEdit, onDelete, onPublish, onSchedule, onNew }) {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? blogs : blogs.filter((b) => b.status === filter);

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2>All Posts</h2>
          <p>Manage your retail blog content</p>
        </div>
        <button className="btn btn-primary" onClick={onNew}>+ New Post</button>
      </header>

      <div className="filter-bar">
        {['all', 'draft', 'scheduled', 'published'].map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="count">
              {f === 'all' ? blogs.length : blogs.filter((b) => b.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>No {filter === 'all' ? '' : filter} posts found.</p>
          <button className="btn btn-primary" onClick={onNew}>Create your first post</button>
        </div>
      ) : (
        <div className="blog-table">
          <div className="table-header">
            <span>Title</span>
            <span>Category</span>
            <span>Status</span>
            <span>Updated</span>
            <span>Actions</span>
          </div>
          {filtered.map((blog) => (
            <div key={blog.id} className="table-row">
              <div className="cell-title">
                <strong>{blog.title}</strong>
                {blog.scheduledAt && (
                  <span className="meta">Scheduled: {formatDateTime(blog.scheduledAt)}</span>
                )}
              </div>
              <span>{blog.category}</span>
              <span className={`badge badge-${blog.status}`}>{blog.status}</span>
              <span className="meta">{formatDate(blog.updatedAt)}</span>
              <div className="cell-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => onEdit(blog)}>Edit</button>
                {blog.status !== 'published' && (
                  <button className="btn btn-ghost btn-sm" onClick={() => onPublish(blog.id)}>
                    Publish
                  </button>
                )}
                {blog.status === 'draft' && (
                  <button className="btn btn-ghost btn-sm" onClick={() => onSchedule(blog)}>
                    Schedule
                  </button>
                )}
                <button className="btn btn-danger btn-sm" onClick={() => onDelete(blog.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDateTime(iso) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
