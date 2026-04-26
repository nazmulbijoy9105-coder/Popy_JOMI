// POPY API Client — typed fetch wrapper used by all components

const BASE = ''

function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('popy_token')
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
  return data
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<any>('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (body: any) =>
    request<any>('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request<any>('/api/auth/me'),

  // Properties
  getProperties: (params?: Record<string, string | number>) => {
    const qs = params ? '?' + new URLSearchParams(params as any).toString() : ''
    return request<any>(`/api/properties${qs}`)
  },
  getProperty: (id: string) => request<any>(`/api/properties/${id}`),

  // Leads
  getLeads: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return request<any>(`/api/leads${qs}`)
  },
  createLead: (body: any) =>
    request<any>('/api/leads', { method: 'POST', body: JSON.stringify(body) }),

  // Analytics
  getKPIs: () => request<any>('/api/analytics/kpis'),
  getAreaStats: () => request<any>('/api/analytics/areas'),

  // Alerts
  getAlerts: (unreadOnly = false) =>
    request<any>(`/api/alerts${unreadOnly ? '?unread=true' : ''}`),
  markAllRead: () =>
    request<any>('/api/alerts', { method: 'PATCH', body: JSON.stringify({ markAllRead: true }) }),

  // Legal
  runLegalCheck: (body: any) =>
    request<any>('/api/legal/check', { method: 'POST', body: JSON.stringify(body) }),

  // Scraper (admin only)
  runScraper: (source: string, pages: number) =>
    request<any>('/api/scraper/run', { method: 'POST', body: JSON.stringify({ source, pages }) }),
  getScraperStatus: (jobId?: string) =>
    request<any>(`/api/scraper/status${jobId ? `?jobId=${jobId}` : ''}`),

  // Export
  exportToSheets: (sheetUrl?: string) =>
    request<any>('/api/export/sheets', { method: 'POST', body: JSON.stringify({ sheetUrl }) }),
}
