'use client';
import { useState } from 'react';
import { Bell, Zap, TrendingDown, Home, Shield, Users, CheckCheck, Settings, Plus } from 'lucide-react';
import { ALERTS, Alert } from '@/lib/data';

const iconMap = { new_listing: Home, price_drop: TrendingDown, urgent_sale: Zap, lead: Users, legal: Shield };
const colorMap = { high: 'var(--danger)', medium: 'var(--warning)', low: 'var(--text-muted)' };
const bgMap = { new_listing: 'rgba(0,212,255,0.08)', price_drop: 'rgba(255,68,68,0.08)', urgent_sale: 'rgba(255,107,53,0.08)', lead: 'rgba(0,229,160,0.08)', legal: 'rgba(124,58,237,0.08)' };

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(ALERTS);
  const [filter, setFilter] = useState<string>('all');
  
  const markAllRead = () => setAlerts(a => a.map(x => ({...x, read: true})));
  const markRead = (id: string) => setAlerts(a => a.map(x => x.id === id ? {...x, read: true} : x));
  
  const filtered = filter === 'all' ? alerts : filter === 'unread' ? alerts.filter(a => !a.read) : alerts.filter(a => a.type === filter);
  const unread = alerts.filter(a => !a.read).length;

  return (
    <div style={{ padding:'24px', maxWidth:'800px' }}>
      {/* Header controls */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px', flexWrap:'wrap', gap:'12px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <h2 style={{ fontFamily:'Syne', fontSize:'16px', fontWeight:'700' }}>Alert Center</h2>
          {unread > 0 && <span className="badge badge-red">{unread} unread</span>}
        </div>
        <div style={{ display:'flex', gap:'8px' }}>
          <button className="btn-ghost" onClick={markAllRead}><CheckCheck size={13} />Mark All Read</button>
          <button className="btn-ghost"><Settings size={13} />Preferences</button>
          <button className="btn-primary"><Plus size={13} />New Alert Rule</button>
        </div>
      </div>

      {/* Filter chips */}
      <div style={{ display:'flex', gap:'8px', marginBottom:'20px', flexWrap:'wrap' }}>
        {[
          { id:'all', label:`All (${alerts.length})` },
          { id:'unread', label:`Unread (${unread})` },
          { id:'urgent_sale', label:'Urgent Sales' },
          { id:'price_drop', label:'Price Drops' },
          { id:'new_listing', label:'New Listings' },
          { id:'lead', label:'Leads' },
          { id:'legal', label:'Legal' },
        ].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{
            padding:'6px 14px', borderRadius:'99px', border:'1px solid',
            borderColor: filter === f.id ? 'var(--accent)' : 'var(--border)',
            background: filter === f.id ? 'rgba(0,212,255,0.1)' : 'transparent',
            color: filter === f.id ? 'var(--accent)' : 'var(--text-secondary)',
            fontSize:'12px', fontWeight:'600', cursor:'pointer', fontFamily:'Syne'
          }}>{f.label}</button>
        ))}
      </div>

      {/* Alert rules */}
      <div className="card" style={{ padding:'16px', marginBottom:'20px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
          <h3 style={{ fontFamily:'Syne', fontSize:'13px', fontWeight:'700', color:'var(--text-secondary)' }}>YOUR ACTIVE RULES</h3>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'10px' }}>
          {[
            { icon:'📍', rule:'Gulshan — Price drop >5%', active:true },
            { icon:'⚡', rule:'Urgent listings — Dhaka', active:true },
            { icon:'🏘️', rule:'New listings — Mirpur', active:true },
            { icon:'⚖️', rule:'Legal risk alerts', active:false },
          ].map(r => (
            <div key={r.rule} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'8px 12px', background:'var(--bg-elevated)', borderRadius:'8px', border:'1px solid var(--border)' }}>
              <span>{r.icon}</span>
              <span style={{ fontSize:'11px', color:'var(--text-secondary)', flex:1 }}>{r.rule}</span>
              <div style={{ width:'28px', height:'16px', borderRadius:'99px', background: r.active ? 'var(--success)' : 'var(--border)', cursor:'pointer', position:'relative', flexShrink:0 }}>
                <div style={{ width:'12px', height:'12px', borderRadius:'50%', background:'#fff', position:'absolute', top:'2px', left: r.active ? '14px' : '2px', transition:'left 0.2s' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert list */}
      <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
        {filtered.map(alert => {
          const Icon = iconMap[alert.type];
          return (
            <div key={alert.id} onClick={() => markRead(alert.id)} style={{
              background: alert.read ? 'var(--bg-card)' : bgMap[alert.type],
              border: `1px solid ${alert.read ? 'var(--border)' : colorMap[alert.priority] + '40'}`,
              borderRadius:'10px', padding:'16px', cursor:'pointer',
              transition:'all 0.15s', display:'flex', gap:'14px', alignItems:'flex-start'
            }}>
              <div style={{ 
                width:'38px', height:'38px', borderRadius:'10px', flexShrink:0,
                background: bgMap[alert.type], border:`1px solid ${colorMap[alert.priority]}30`,
                display:'flex', alignItems:'center', justifyContent:'center'
              }}>
                <Icon size={16} style={{ color: colorMap[alert.priority] }} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'4px' }}>
                  <span style={{ fontFamily:'Syne', fontWeight:'700', fontSize:'14px', color:'var(--text-primary)' }}>{alert.title}</span>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                    {!alert.read && <div style={{ width:'7px', height:'7px', borderRadius:'50%', background:'var(--accent)' }} />}
                    <span style={{ fontSize:'11px', color:'var(--text-muted)' }}>{alert.time}</span>
                  </div>
                </div>
                <p style={{ fontSize:'13px', color:'var(--text-secondary)' }}>{alert.body}</p>
                <div style={{ marginTop:'8px' }}>
                  <span className={`badge ${alert.priority === 'high' ? 'badge-red' : alert.priority === 'medium' ? 'badge-yellow' : 'badge-blue'}`}>
                    {alert.priority.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:'48px', color:'var(--text-muted)' }}>
            <Bell size={32} style={{ marginBottom:'12px', opacity:0.3 }} />
            <p>No alerts in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
