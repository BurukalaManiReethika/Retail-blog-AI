const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export const api = {
  health: () => request('/health'),

  getBlogs: () => request('/blogs'),
  getBlog: (id) => request(`/blogs/${id}`),
  createBlog: (data) => request('/blogs', { method: 'POST', body: JSON.stringify(data) }),
  updateBlog: (id, data) => request(`/blogs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBlog: (id) => request(`/blogs/${id}`, { method: 'DELETE' }),
  scheduleBlog: (id, scheduledAt) =>
    request(`/blogs/${id}/schedule`, { method: 'POST', body: JSON.stringify({ scheduledAt }) }),
  publishBlog: (id) => request(`/blogs/${id}/publish`, { method: 'POST' }),
  getScheduled: () => request('/blogs/scheduled'),

  generatePost: (data) => request('/ai/generate', { method: 'POST', body: JSON.stringify(data) }),
  generateIdeas: (data) => request('/ai/ideas', { method: 'POST', body: JSON.stringify(data) }),
  improveSeo: (data) => request('/ai/seo', { method: 'POST', body: JSON.stringify(data) }),
};
