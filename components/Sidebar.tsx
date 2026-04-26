'use client'
import { useState } from 'react'
import { LayoutDashboard, Search, TrendingUp, Bell, Users, Shield, BarChart3, Settings, LogOut, Zap, ChevronRight, Menu, X, Database, Play } from 'lucide-react'

interface SidebarProps {
  active: string
  onNav: (page: string) => void
  unreadAlerts?: number
  user?: any
  onLogout?: () => void
}

const NAV = [
  { id:'dashboard',   label:'Dashboard',        icon:LayoutDashboard },
  { id:'properties',  label:'Properties',       icon:Search },
  { id:'leads',       label:'Lead Engine',      icon:Users },
  { id:'analytics',   label:'Market Analytics', icon:TrendingUp },
  { id:'alerts',      label:'Alerts',           icon:Bell },
  { id:'legal',       label:'Legal Check',      icon:Shield },
  { id:'reports',     label:'Reports & Export', icon:BarChart3 },
]

export default function Sidebar({ active, onNav, unreadAlerts = 0, user, onLogout }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const Content = () => (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', padding:'0 12px' }}>
      {/* Logo */}
      <div style={{ padding:'20px 4px 16px', borderBottom:'1px solid var(--border)', marginBottom:'12px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px' }}>
          <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'linear-gradient(135deg,var(--accent),var(--accent-3))', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Syne', fontWeight:'900', fontSize:'18px', color:'#000', flexShrink:0 }}>P</div>
          <div>
            <div style={{ fontFamily:'Syne', fontWeight:'800', fontSize:'18px', letterSpacing:'-0.02em' }}>POPY</div>
            <div style={{ fontSize:'10px', color:'var(--text-muted)', letterSpacing:'0.1em', textTransform:'uppercase', marginTop:'-1px' }}>Property AI · BD</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
          <span className="live-dot" />
          <span style={{ fontSize:'11px', color:'var(--success)', fontWeight:'500' }}>Live Tracking Active</span>
        </div>
      </div>

      {/* User chip */}
      {user && (
        <div style={{ background:'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius:'8px', padding:'10px 12px', marginBottom:'12px', display:'flex', alignItems:'center', gap:'8px' }}>
          <div style={{ width:'28px', height:'28px', borderRadius:'50%', background:'linear-gradient(135deg,var(--accent),var(--accent-3))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:'800', color:'#000', fontFamily:'Syne', flexShrink:0 }}>
            {(user.name || user.email || 'U')[0].toUpperCase()}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:'12px', fontWeight:'600', color:'var(--text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.name || user.email}</div>
            <div style={{ fontSize:'10px', color:'var(--text-muted)', textTransform:'capitalize' }}>{user.role} · {user.plan}</div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex:1, display:'flex', flexDirection:'column', gap:'2px' }}>
        {NAV.map(({ id, label, icon: Icon }) => (
          <button key={id} className={`sidebar-link ${active === id ? 'active' : ''}`}
            onClick={() => { onNav(id); setMobileOpen(false) }}>
            <Icon size={15} />
            <span style={{ flex:1 }}>{label}</span>
            {id === 'alerts' && unreadAlerts > 0 && (
              <span style={{ background:'var(--danger)', color:'#fff', borderRadius:'99px', padding:'1px 7px', fontSize:'10px', fontWeight:'700', fontFamily:'Syne' }}>{unreadAlerts}</span>
            )}
            {active === id && <ChevronRight size={12} style={{ color:'var(--accent)' }} />}
          </button>
        ))}
      </nav>

      {/* Upgrade banner */}
      {user?.plan === 'free' && (
        <div style={{ margin:'12px 0', padding:'14px', borderRadius:'10px', background:'linear-gradient(135deg,rgba(0,212,255,0.08),rgba(124,58,237,0.08))', border:'1px solid rgba(0,212,255,0.2)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'5px' }}>
            <Zap size={12} style={{ color:'var(--gold)' }} />
            <span style={{ fontSize:'11px', fontWeight:'700', fontFamily:'Syne', color:'var(--gold)' }}>UPGRADE PLAN</span>
          </div>
          <p style={{ fontSize:'11px', color:'var(--text-secondary)', lineHeight:'1.4', marginBottom:'8px' }}>Unlock AI deal scoring, legal checks & API access</p>
          <button className="btn-primary" style={{ padding:'7px 14px', fontSize:'11px', width:'100%', justifyContent:'center' }}>Upgrade Now</button>
        </div>
      )}

      {/* Bottom */}
      <div style={{ borderTop:'1px solid var(--border)', paddingTop:'10px', paddingBottom:'12px', display:'flex', flexDirection:'column', gap:'2px' }}>
        <button className="sidebar-link" onClick={() => onNav('scraper')}><Database size={14} /><span>Scraper Status</span></button>
        <button className="sidebar-link"><Settings size={14} /><span>Settings</span></button>
        <button className="sidebar-link" onClick={onLogout}><LogOut size={14} /><span>Sign Out</span></button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && <div onClick={() => setMobileOpen(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:40 }} />}

      {/* Mobile toggle btn */}
      <button onClick={() => setMobileOpen(!mobileOpen)} style={{
        display:'none', position:'fixed', top:'14px', left:'14px', zIndex:60,
        background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'8px',
        padding:'8px', cursor:'pointer', color:'var(--text-primary)'
      }}>
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Desktop sidebar */}
      <aside style={{ width:'220px', minWidth:'220px', height:'100vh', background:'var(--bg-card)', borderRight:'1px solid var(--border)', position:'sticky', top:0, overflowY:'auto', flexShrink:0, zIndex:50 }}>
        <Content />
      </aside>
    </>
  )
}
