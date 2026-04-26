'use client'
import { useState, useEffect } from 'react'
import LandingPage from '@/components/LandingPage'
import AuthPage from '@/components/auth/AuthPage'
import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'
import Dashboard from '@/components/Dashboard'
import PropertiesPage from '@/components/PropertiesPage'
import LeadsPage from '@/components/LeadsPage'
import AnalyticsPage from '@/components/AnalyticsPage'
import AlertsPage from '@/components/AlertsPage'
import LegalPage from '@/components/LegalPage'
import ReportsPage from '@/components/ReportsPage'
import { useAlerts } from '@/lib/hooks'

type Page = 'dashboard'|'properties'|'leads'|'analytics'|'alerts'|'legal'|'reports'

const PAGE_META: Record<Page, { title: string; subtitle: string }> = {
  dashboard:  { title:'Dashboard',        subtitle:'Live property intelligence overview' },
  properties: { title:'Properties',       subtitle:'Browse & filter all tracked listings' },
  leads:      { title:'Lead Engine',      subtitle:'Hot leads & pipeline management' },
  analytics:  { title:'Market Analytics', subtitle:'Price trends, heatmaps & area intelligence' },
  alerts:     { title:'Alerts',           subtitle:'Real-time notifications & custom rules' },
  legal:      { title:'Legal Check',      subtitle:'AI-powered property legal verification' },
  reports:    { title:'Reports & Export', subtitle:'Download reports & sync to Google Sheets' },
}

type AppState = 'landing' | 'auth' | 'app'

export default function Home() {
  const [appState, setAppState] = useState<AppState>('landing')
  const [activePage, setActivePage] = useState<Page>('dashboard')
  const [user, setUser] = useState<any>(null)
  const { unread } = useAlerts()

  // Check existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('popy_token')
    const savedUser = localStorage.getItem('popy_user')
    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
      setAppState('app')
    }
  }, [])

  const handleAuthSuccess = (token: string, userData: any) => {
    setUser(userData)
    setAppState('app')
  }

  const handleLogout = () => {
    localStorage.removeItem('popy_token')
    localStorage.removeItem('popy_user')
    setUser(null)
    setAppState('landing')
  }

  if (appState === 'landing') {
    return <LandingPage onEnter={() => setAppState('auth')} />
  }

  if (appState === 'auth') {
    return <AuthPage onSuccess={handleAuthSuccess} />
  }

  const meta = PAGE_META[activePage]

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':  return <Dashboard onNav={p => setActivePage(p as Page)} />
      case 'properties': return <PropertiesPage />
      case 'leads':      return <LeadsPage />
      case 'analytics':  return <AnalyticsPage />
      case 'alerts':     return <AlertsPage />
      case 'legal':      return <LegalPage />
      case 'reports':    return <ReportsPage />
      default:           return <Dashboard onNav={p => setActivePage(p as Page)} />
    }
  }

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', position:'relative', zIndex:1 }}>
      <Sidebar
        active={activePage}
        onNav={p => setActivePage(p as Page)}
        unreadAlerts={unread}
        user={user}
        onLogout={handleLogout}
      />
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <Topbar
          title={meta.title}
          subtitle={meta.subtitle}
          unread={unread}
          user={user}
          onAlertsClick={() => setActivePage('alerts')}
          onLogout={handleLogout}
        />
        <main style={{ flex:1, overflowY:'auto' }}>{renderPage()}</main>
      </div>
    </div>
  )
}
