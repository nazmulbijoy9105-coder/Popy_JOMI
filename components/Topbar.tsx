'use client'
import { Bell, Search, ChevronDown, LogOut, User } from 'lucide-react'
import { useState } from 'react'

interface TopbarProps {
  title: string
  subtitle?: string
  unread?: number
  user?: any
  onAlertsClick?: () => void
  onLogout?: () => void
}

export default function Topbar({ title, subtitle, unread = 0, user, onAlertsClick, onLogout }: TopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header style={{ height:'60px', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', borderBottom:'1px solid var(--border)', background:'rgba(7,11,20,0.85)', backdropFilter:'blur(12px)', position:'sticky', top:0, zIndex:30 }}>
      <div>
        <h1 style={{ fontFamily:'Syne', fontSize:'16px', fontWeight:'700' }}>{title}</h1>
        {subtitle && <p style={{ fontSize:'11px', color:'var(--text-muted)', marginTop:'-1px' }}>{subtitle}</p>}
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
        <div style={{ position:'relative', display:'flex', alignItems:'center' }}>
          <Search size={13} style={{ position:'absolute', left:'10px', color:'var(--text-muted)', pointerEvents:'none' }} />
          <input placeholder="Search properties..." style={{ width:'200px', paddingLeft:'30px', height:'34px', fontSize:'13px' }} />
        </div>
        <button onClick={onAlertsClick} style={{ position:'relative', background:'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius:'8px', padding:'8px', cursor:'pointer', color:'var(--text-secondary)', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}>
          <Bell size={14} />
          {unread > 0 && <span style={{ position:'absolute', top:'-4px', right:'-4px', background:'var(--danger)', color:'#fff', borderRadius:'99px', fontSize:'9px', fontWeight:'700', padding:'1px 5px', fontFamily:'Syne' }}>{unread}</span>}
        </button>
        <div style={{ position:'relative' }}>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ display:'flex', alignItems:'center', gap:'7px', cursor:'pointer', padding:'5px 10px', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg-elevated)', transition:'all 0.15s' }}>
            <div style={{ width:'26px', height:'26px', borderRadius:'50%', background:'linear-gradient(135deg,var(--accent),var(--accent-3))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:'800', color:'#000', fontFamily:'Syne' }}>
              {user?.name?.[0]?.toUpperCase() || <User size={11} style={{ color:'#000' }} />}
            </div>
            <span style={{ fontSize:'12px', fontWeight:'500' }}>{user?.name?.split(' ')[0] || 'Account'}</span>
            <ChevronDown size={11} style={{ color:'var(--text-muted)' }} />
          </button>
          {menuOpen && (
            <div style={{ position:'absolute', top:'calc(100% + 6px)', right:0, background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'8px', padding:'6px', minWidth:'160px', zIndex:50, boxShadow:'0 8px 24px rgba(0,0,0,0.4)' }}>
              <div style={{ padding:'8px 10px', borderBottom:'1px solid var(--border)', marginBottom:'4px' }}>
                <div style={{ fontSize:'12px', fontWeight:'600' }}>{user?.name || 'User'}</div>
                <div style={{ fontSize:'10px', color:'var(--text-muted)', textTransform:'capitalize' }}>{user?.role} · {user?.plan}</div>
              </div>
              <button onClick={() => { setMenuOpen(false); onLogout?.() }} style={{ display:'flex', alignItems:'center', gap:'8px', width:'100%', padding:'8px 10px', background:'none', border:'none', color:'var(--danger)', cursor:'pointer', borderRadius:'6px', fontSize:'13px', transition:'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,68,68,0.08)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                <LogOut size={13} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
