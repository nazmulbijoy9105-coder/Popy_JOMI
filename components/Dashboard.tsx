'use client';
import { TrendingUp, TrendingDown, Home, Users, Zap, ShieldCheck, Bell, ArrowUpRight, Building2, DollarSign, Eye, BarChart3 } from 'lucide-react';
import { PROPERTIES, LEADS, ALERTS, AREA_STATS, PRICE_TRENDS, formatPrice } from '@/lib/data';
import PropertyCard from './PropertyCard';
import MiniChart from './MiniChart';

export default function Dashboard({ onNav }: { onNav: (page: string) => void }) {
  const urgentProperties = PROPERTIES.filter(p => p.status === 'urgent');
  const hotLeads = LEADS.filter(l => l.urgency === 'hot');
  const unreadAlerts = ALERTS.filter(a => !a.read);
  
  return (
    <div style={{ padding:'24px', maxWidth:'1400px' }}>
      {/* Ticker */}
      <div style={{ 
        background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'8px',
        padding:'10px 0', marginBottom:'24px', overflow:'hidden'
      }}>
        <div className="ticker-wrap">
          <div className="ticker">
            {[...PROPERTIES, ...PROPERTIES].map((p, i) => (
              <span key={i} style={{ padding:'0 28px', fontSize:'12px', color:'var(--text-secondary)', display:'inline-flex', alignItems:'center', gap:'8px', borderRight:'1px solid var(--border)' }}>
                <span style={{ color:'var(--text-primary)', fontWeight:'600', fontFamily:'Syne' }}>{p.area}</span>
                <span style={{ color: p.status === 'urgent' ? 'var(--accent-2)' : 'var(--text-muted)' }}>{formatPrice(p.price)}</span>
                {p.priceChange !== 0 && p.priceChange !== undefined && (
                  <span style={{ color: p.priceChange < 0 ? 'var(--danger)' : 'var(--success)', fontSize:'11px' }}>
                    {p.priceChange < 0 ? '▼' : '▲'}{Math.abs(p.priceChange)}%
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:'14px', marginBottom:'28px' }}>
        {[
          { label:'Active Listings', value:'2,847', sub:'+124 today', icon:Home, color:'cyan', trend:'up' },
          { label:'Hot Leads', value: String(hotLeads.length), sub:'Needs attention', icon:Users, color:'orange', trend:'up' },
          { label:'Urgent Sales', value: String(urgentProperties.length), sub:'Below market price', icon:Zap, color:'purple', trend:'up' },
          { label:'Avg Deal Score', value:'78.4', sub:'This week ▲2.1', icon:BarChart3, color:'green', trend:'up' },
          { label:'Legal Checks', value:'142', sub:'Clean rate 89%', icon:ShieldCheck, color:'gold', trend:'up' },
        ].map((stat) => (
          <div key={stat.label} className={`stat-card ${stat.color}`} style={{ cursor:'pointer' }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'12px' }}>
              <div style={{ 
                width:'36px', height:'36px', borderRadius:'8px',
                background: stat.color === 'cyan' ? 'rgba(0,212,255,0.1)' : stat.color === 'orange' ? 'rgba(255,107,53,0.1)' : stat.color === 'purple' ? 'rgba(124,58,237,0.1)' : stat.color === 'green' ? 'rgba(0,229,160,0.1)' : 'rgba(245,200,66,0.1)',
                display:'flex', alignItems:'center', justifyContent:'center'
              }}>
                <stat.icon size={16} style={{ color: stat.color === 'cyan' ? 'var(--accent)' : stat.color === 'orange' ? 'var(--accent-2)' : stat.color === 'purple' ? '#A78BFA' : stat.color === 'green' ? 'var(--success)' : 'var(--gold)' }} />
              </div>
              <ArrowUpRight size={13} style={{ color:'var(--text-muted)' }} />
            </div>
            <div style={{ fontFamily:'Syne', fontSize:'26px', fontWeight:'800', color:'var(--text-primary)', marginBottom:'2px' }}>{stat.value}</div>
            <div style={{ fontSize:'12px', fontWeight:'500', color:'var(--text-secondary)', marginBottom:'2px' }}>{stat.label}</div>
            <div style={{ fontSize:'11px', color:'var(--text-muted)' }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:'20px', marginBottom:'28px' }}>
        {/* Price Trends */}
        <div className="card" style={{ padding:'20px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
            <div>
              <h2 style={{ fontFamily:'Syne', fontSize:'15px', fontWeight:'700', color:'var(--text-primary)' }}>Price Trends (৳/sqft)</h2>
              <p style={{ fontSize:'11px', color:'var(--text-muted)', marginTop:'2px' }}>Last 7 months by area</p>
            </div>
            <button className="btn-ghost" style={{ padding:'6px 12px', fontSize:'12px' }} onClick={() => onNav('analytics')}>View Full <ArrowUpRight size={11} /></button>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
            {[
              { key: 'gulshan' as const, label: 'Gulshan', color: '#00D4FF' },
              { key: 'dhanmondi' as const, label: 'Dhanmondi', color: '#FF6B35' },
              { key: 'mirpur' as const, label: 'Mirpur', color: '#00E5A0' },
              { key: 'bashundhara' as const, label: 'Bashundhara', color: '#7C3AED' },
            ].map(area => {
              const data = PRICE_TRENDS[area.key];
              const latest = data[data.length - 1];
              const prev = data[0];
              const growth = ((latest - prev) / prev * 100).toFixed(1);
              return (
                <div key={area.key} style={{ background:'var(--bg-elevated)', borderRadius:'10px', padding:'14px', border:'1px solid var(--border)' }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'8px' }}>
                    <span style={{ fontSize:'12px', fontWeight:'600', fontFamily:'Syne', color:'var(--text-primary)' }}>{area.label}</span>
                    <span style={{ fontSize:'11px', color:'var(--success)' }}>+{growth}%</span>
                  </div>
                  <div style={{ fontSize:'16px', fontWeight:'800', fontFamily:'Syne', color:'var(--text-primary)', marginBottom:'8px' }}>৳{latest.toLocaleString()}</div>
                  <MiniChart data={data} color={area.color} height={40} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Hot Leads Panel */}
        <div className="card" style={{ padding:'20px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px' }}>
            <h2 style={{ fontFamily:'Syne', fontSize:'15px', fontWeight:'700' }}>Hot Leads</h2>
            <button className="btn-ghost" style={{ padding:'5px 10px', fontSize:'11px' }} onClick={() => onNav('leads')}>All Leads</button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {hotLeads.map(lead => (
              <div key={lead.id} style={{ 
                background:'var(--bg-elevated)', borderRadius:'8px', padding:'12px',
                border:'1px solid var(--border)', cursor:'pointer',
                transition:'border-color 0.15s'
              }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'4px' }}>
                  <span style={{ fontSize:'13px', fontWeight:'600', color:'var(--text-primary)' }}>{lead.name}</span>
                  <span className="badge badge-red"><Zap size={8} />HOT</span>
                </div>
                <div style={{ fontSize:'11px', color:'var(--text-muted)', marginBottom:'6px' }}>{lead.area} • {lead.type} • {lead.createdAt}</div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span style={{ fontSize:'13px', fontWeight:'700', fontFamily:'Syne', color:'var(--text-primary)' }}>{formatPrice(lead.budget)}</span>
                  <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
                    <span style={{ fontSize:'10px', color:'var(--text-muted)' }}>Score</span>
                    <span style={{ fontSize:'13px', fontWeight:'700', color:'var(--success)', fontFamily:'Syne' }}>{lead.score}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Area Intelligence */}
      <div className="card" style={{ padding:'20px', marginBottom:'28px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px' }}>
          <h2 style={{ fontFamily:'Syne', fontSize:'15px', fontWeight:'700' }}>Area Intelligence</h2>
          <span className="badge badge-blue"><Eye size={9} />Live Data</span>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Area</th>
                <th>Avg Price/sqft</th>
                <th>6M Growth</th>
                <th>Active Listings</th>
                <th>Demand Score</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {AREA_STATS.map(area => (
                <tr key={area.area}>
                  <td><span style={{ fontWeight:'600', color:'var(--text-primary)' }}>{area.area}</span></td>
                  <td><span style={{ fontFamily:'Syne', fontWeight:'600' }}>৳{area.avgPrice.toLocaleString()}</span></td>
                  <td><span style={{ color:'var(--success)', fontWeight:'600' }}>+{area.growth}%</span></td>
                  <td>{area.listings.toLocaleString()}</td>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                      <div className="progress-bar" style={{ width:'60px' }}>
                        <div className="progress-fill" style={{ width:`${area.demand}%`, background: area.demand >= 85 ? 'var(--success)' : area.demand >= 70 ? 'var(--warning)' : 'var(--danger)' }} />
                      </div>
                      <span style={{ fontSize:'12px', fontWeight:'600' }}>{area.demand}</span>
                    </div>
                  </td>
                  <td><TrendingUp size={14} style={{ color:'var(--success)' }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Urgent Listings */}
      <div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px' }}>
          <h2 style={{ fontFamily:'Syne', fontSize:'15px', fontWeight:'700' }}>Urgent Listings</h2>
          <button className="btn-ghost" style={{ padding:'6px 14px', fontSize:'12px' }} onClick={() => onNav('properties')}>View All →</button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:'14px' }}>
          {urgentProperties.map(p => <PropertyCard key={p.id} property={p} onClick={() => onNav('properties')} />)}
        </div>
      </div>
    </div>
  );
}
