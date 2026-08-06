const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '◈' },
  { id: 'generate', label: 'AI Generate', icon: '✦' },
  { id: 'blogs', label: 'All Posts', icon: '☰' },
  { id: 'schedule', label: 'Schedule', icon: '◷' },
];

export default function Sidebar({ currentView, onNavigate, health }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-icon">🛍</span>
        <div>
          <h1>Retail Blog AI</h1>
          <p>Content Platform</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${currentView === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className={`status-dot ${health?.geminiConfigured ? 'online' : 'offline'}`} />
        <span>
          {health?.geminiConfigured ? 'Gemini Connected' : 'API Key Required'}
        </span>
      </div>
    </aside>
  );
}
