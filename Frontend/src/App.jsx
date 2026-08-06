import { useState, useEffect, useCallback } from 'react';
import { api } from './services/api';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import GeneratePanel from './components/GeneratePanel';
import BlogEditor from './components/BlogEditor';
import BlogList from './components/BlogList';
import SchedulePanel from './components/SchedulePanel';
import './styles/App.css';

const VIEWS = {
  dashboard: 'dashboard',
  generate: 'generate',
  blogs: 'blogs',
  editor: 'editor',
  schedule: 'schedule',
};

export default function App() {
  const [view, setView] = useState(VIEWS.dashboard);
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [draftContent, setDraftContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [health, setHealth] = useState(null);

  const loadBlogs = useCallback(async () => {
    try {
      const data = await api.getBlogs();
      setBlogs(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const [healthData] = await Promise.all([api.health(), loadBlogs()]);
        setHealth(healthData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [loadBlogs]);

  function openEditor(blog = null, generated = null) {
    setSelectedBlog(blog);
    setDraftContent(generated);
    setView(VIEWS.editor);
  }

  function handleGenerated(content) {
    setDraftContent(content);
    setSelectedBlog(null);
    setView(VIEWS.editor);
  }

  async function handleSave(blogData) {
    if (selectedBlog?.id) {
      await api.updateBlog(selectedBlog.id, blogData);
    } else {
      await api.createBlog(blogData);
    }
    await loadBlogs();
    setView(VIEWS.blogs);
    setSelectedBlog(null);
    setDraftContent(null);
  }

  async function handleDelete(id) {
    if (!confirm('Delete this blog post?')) return;
    await api.deleteBlog(id);
    await loadBlogs();
    if (selectedBlog?.id === id) {
      setSelectedBlog(null);
      setView(VIEWS.blogs);
    }
  }

  async function handleSchedule(id, scheduledAt) {
    await api.scheduleBlog(id, scheduledAt);
    await loadBlogs();
  }

  async function handlePublish(id) {
    await api.publishBlog(id);
    await loadBlogs();
  }

  return (
    <div className="app">
      <Sidebar
        currentView={view}
        onNavigate={setView}
        health={health}
      />

      <main className="main">
        {error && (
          <div className="alert alert-error">
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        {loading ? (
          <div className="loading">Loading platform...</div>
        ) : (
          <>
            {view === VIEWS.dashboard && (
              <Dashboard blogs={blogs} onNavigate={setView} health={health} />
            )}
            {view === VIEWS.generate && (
              <GeneratePanel onGenerated={handleGenerated} />
            )}
            {view === VIEWS.blogs && (
              <BlogList
                blogs={blogs}
                onEdit={openEditor}
                onDelete={handleDelete}
                onPublish={handlePublish}
                onSchedule={(blog) => {
                  setSelectedBlog(blog);
                  setView(VIEWS.schedule);
                }}
                onNew={() => openEditor()}
              />
            )}
            {view === VIEWS.editor && (
              <BlogEditor
                blog={selectedBlog}
                generated={draftContent}
                onSave={handleSave}
                onCancel={() => {
                  setView(VIEWS.blogs);
                  setDraftContent(null);
                }}
              />
            )}
            {view === VIEWS.schedule && (
              <SchedulePanel
                blogs={blogs}
                selectedBlog={selectedBlog}
                onSchedule={handleSchedule}
                onBack={() => setView(VIEWS.blogs)}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
