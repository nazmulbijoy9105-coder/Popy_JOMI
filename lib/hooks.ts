'use client'
import { useState, useEffect, useCallback } from 'react'
import { api } from './api-client'

// Generic data fetcher hook
export function useData<T>(fetcher: () => Promise<{ data: T }>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetcher()
      setData(res.data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, deps)

  useEffect(() => { load() }, [load])

  return { data, loading, error, refetch: load }
}

export function useKPIs() {
  return useData(() => api.getKPIs())
}

export function useProperties(params?: Record<string, string | number>) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getProperties(params)
      .then(res => setData(res))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [JSON.stringify(params)])

  return { data, loading }
}

export function useLeads(params?: Record<string, string>) {
  return useData(() => api.getLeads(params), [JSON.stringify(params)])
}

export function useAlerts() {
  const [alerts, setAlerts] = useState<any[]>([])
  const [unread, setUnread] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchAlerts = async () => {
    try {
      const res = await api.getAlerts()
      setAlerts(res.data || [])
      setUnread(res.meta?.unreadCount || 0)
    } catch {
      // Use mock data as fallback
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAlerts() }, [])

  const markAllRead = async () => {
    await api.markAllRead().catch(() => {})
    setAlerts(a => a.map(x => ({ ...x, read: true })))
    setUnread(0)
  }

  return { alerts, unread, loading, markAllRead, refetch: fetchAlerts }
}

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const t = localStorage.getItem('popy_token')
    const u = localStorage.getItem('popy_user')
    if (t && u) {
      setToken(t)
      setUser(JSON.parse(u))
    }
  }, [])

  const logout = () => {
    localStorage.removeItem('popy_token')
    localStorage.removeItem('popy_user')
    setUser(null)
    setToken(null)
  }

  return { user, token, logout, isAuth: !!token }
}
