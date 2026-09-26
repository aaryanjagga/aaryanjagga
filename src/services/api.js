const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // If token is invalid on an admin route, clear it
    if (endpoint.startsWith('/admin') || endpoint.startsWith('/auth/me')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || 'An unexpected error occurred');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Public
  getPortfolio: () => request('/portfolio'),
  getProject: (slug) => request(`/projects/${slug}`),
  sendMessage: (payload) => request('/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),

  // Auth
  login: (email, password) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  getMe: () => request('/auth/me'),
  changePassword: (passwords) => request('/auth/change-password', {
    method: 'PUT',
    body: JSON.stringify(passwords),
  }),

  // Admin Stats
  getStats: () => request('/admin/stats'),

  // Profile
  getProfile: () => request('/admin/profile'),
  updateProfile: (data) => request('/admin/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Projects CRUD
  getProjects: () => request('/admin/projects'),
  createProject: (data) => request('/admin/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateProject: (id, data) => request(`/admin/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteProject: (id) => request(`/admin/projects/${id}`, {
    method: 'DELETE',
  }),

  // Skills CRUD
  getSkills: () => request('/admin/skills'),
  createSkill: (data) => request('/admin/skills', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateSkill: (id, data) => request(`/admin/skills/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteSkill: (id) => request(`/admin/skills/${id}`, {
    method: 'DELETE',
  }),

  // Education CRUD
  getEducation: () => request('/admin/education'),
  createEducation: (data) => request('/admin/education', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateEducation: (id, data) => request(`/admin/education/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteEducation: (id) => request(`/admin/education/${id}`, {
    method: 'DELETE',
  }),

  // Experience CRUD
  getExperience: () => request('/admin/experience'),
  createExperience: (data) => request('/admin/experience', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateExperience: (id, data) => request(`/admin/experience/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteExperience: (id) => request(`/admin/experience/${id}`, {
    method: 'DELETE',
  }),

  // Certifications CRUD
  getCerts: () => request('/admin/certifications'),
  createCert: (data) => request('/admin/certifications', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateCert: (id, data) => request(`/admin/certifications/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteCert: (id) => request(`/admin/certifications/${id}`, {
    method: 'DELETE',
  }),

  // Achievements CRUD
  getAchievements: () => request('/admin/achievements'),
  createAchievement: (data) => request('/admin/achievements', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateAchievement: (id, data) => request(`/admin/achievements/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteAchievement: (id) => request(`/admin/achievements/${id}`, {
    method: 'DELETE',
  }),

  // Services CRUD
  getServices: () => request('/admin/services'),
  createService: (data) => request('/admin/services', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateService: (id, data) => request(`/admin/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteService: (id) => request(`/admin/services/${id}`, {
    method: 'DELETE',
  }),

  // Social Links CRUD
  getSocials: () => request('/admin/socials'),
  createSocial: (data) => request('/admin/socials', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateSocial: (id, data) => request(`/admin/socials/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteSocial: (id) => request(`/admin/socials/${id}`, {
    method: 'DELETE',
  }),

  // Messages
  getMessages: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/messages${query ? `?${query}` : ''}`);
  },
  toggleMessageRead: (id, isRead) => request(`/admin/messages/${id}/read`, {
    method: 'PUT',
    body: JSON.stringify({ is_read: isRead }),
  }),
  deleteMessage: (id) => request(`/admin/messages/${id}`, {
    method: 'DELETE',
  }),

  // Site Settings
  getSettings: () => request('/admin/settings'),
  updateSettings: (data) => request('/admin/settings', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Upload File
  uploadImage: async (file) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Upload failed');
    }
    return data;
  },
};
