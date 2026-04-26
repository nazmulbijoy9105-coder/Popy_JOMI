'use client';
import { useState } from 'react';
import { Zap, Phone, MapPin, TrendingUp, Filter, Plus, Star } from 'lucide-react';
import { LEADS, PROPERTIES, formatPrice } from '@/lib/data';

export default function LeadsPage() {
  const [filter, setFilter] = useState<'all' | 'hot' | 'warm' | 'cold'>('all');
  const filtered = LEADS.filter(l => filter === 'all' || l.urgency === filter);
  const urgencyMap = { hot: { label:'HOT', class:'badge-red' }, warm: { label:'WARM', class:'badge-yellow' }, cold: { label:'COLD', class:'badge-blue' } };

  return (
    <div style={{ padding:'24px' }}>
      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'14px', marginBottom:'24px' }}>
        {[
          { label:'Total Leads', value:LEADS.length, color:'var(--accent)' },
          { label:'Hot Leads', value:LEADS.filter(l=>l.urgency==='hot').length, color:'var(--danger)' },
          { label:'Avg Score', value:Math.round(LEADS.reduce((s,l)=>s+l.score,0)/LEADS.length), color:'var(--success)' },
          { label:'Total Value', value:'৳8.2Cr', color:'var(--gold)' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ textAlign:'center' }}>
            <div style={{ fontSize:'28px', fontWeight:'800', fontFamily:'Syne', color:s.color, marginBottom:'4px' }}>{s.value}</div>
            <div style={{ fontSize:'12px', color:'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:'8px', marginBottom:'20px', alignItems:'center', flexWrap:'wrap' }}>
        {(['all','hot','warm','cold'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding:'8px 20px', borderRadius:'99px', border:'1px solid',
            borderColor: filter === f ? 'var(--accent)' : 'var(--border)',
            background: filter === f ? 'rgba(0,212,255,0.1)' : 'transparent',
            color: filter === f ? 'var(--accent)' : 'var(--text-secondary)',
            fontWeight:'600', fontFamily:'Syne', fontSize:'12px', cursor:'pointer',
            textTransform:'uppercase', letterSpacing:'0.05em'
          }}>{f === 'all' ? `All (${LEADS.length})` : f === 'hot' ? `🔥 Hot (${LEADS.filter(l=>l.urgency==='hot').length})` : f === 'warm' ? `🌡 Warm (${LEADS.filter(l=>l.urgency==='warm').length})` : `❄️ Cold (${LEADS.filter(l=>l.urgency==='cold').length})`}</button>
        ))}
        <button className="btn-primary" style={{ marginLeft:'auto' }}><Plus size={13} />Add Lead</button>
      </div>

      {/* Lead cards grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'14px' }}>
        {filtered.map(lead => {
          const property = PROPERTIES.find(p => p.id === lead.propertyId);
          const urg = urgencyMap[lead.urgency];
          return (
            <div key={lead.id} className="card" style={{ padding:'18px', cursor:'pointer', borderColor: lead.urgency === 'hot' ? 'rgba(255,68,68,0.3)' : 'var(--border)' }}>
              {/* Header */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                  <div style={{ width:'38px', height:'38px', borderRadius:'50%', background:'linear-gradient(135deg, var(--accent-3), var(--accent))', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Syne', fontWeight:'800', fontSize:'15px', color:'#fff' }}>{lead.name[0]}</div>
                  <div>
                    <div style={{ fontWeight:'600', fontSize:'14px', color:'var(--text-primary)', fontFamily:'Syne' }}>{lead.name}</div>
                    <div style={{ fontSize:'11px', color:'var(--text-muted)' }}>{lead.createdAt}</div>
                  </div>
                </div>
                <span className={`badge ${urg.class}`}><Zap size={8} />{urg.label}</span>
              </div>
              
              {/* Details */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', marginBottom:'12px' }}>
                <div style={{ background:'var(--bg-elevated)', borderRadius:'6px', padding:'8px' }}>
                  <div style={{ fontSize:'10px', color:'var(--text-muted)', marginBottom:'2px', textTransform:'uppercase', letterSpacing:'0.06em' }}>Budget</div>
                  <div style={{ fontFamily:'Syne', fontWeight:'700', fontSize:'13px', color:'var(--text-primary)' }}>{formatPrice(lead.budget)}</div>
                </div>
                <div style={{ background:'var(--bg-elevated)', borderRadius:'6px', padding:'8px' }}>
                  <div style={{ fontSize:'10px', color:'var(--text-muted)', marginBottom:'2px', textTransform:'uppercase', letterSpacing:'0.06em' }}>Score</div>
                  <div style={{ fontFamily:'Syne', fontWeight:'700', fontSize:'13px', color: lead.score >= 80 ? 'var(--success)' : lead.score >= 60 ? 'var(--warning)' : 'var(--danger)' }}>{lead.score}/100</div>
                </div>
              </div>

              <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'6px' }}>
                <MapPin size={11} style={{ color:'var(--text-muted)' }} />
                <span style={{ fontSize:'12px', color:'var(--text-secondary)' }}>{lead.area} • {lead.type}</span>
              </div>

              {property && (
                <div style={{ fontSize:'11px', color:'var(--text-muted)', marginBottom:'12px', padding:'8px', background:'var(--bg-elevated)', borderRadius:'6px' }}>
                  📍 {property.title}
                </div>
              )}

              {/* Score bar */}
              <div style={{ marginBottom:'12px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                  <span style={{ fontSize:'10px', color:'var(--text-muted)' }}>Lead Quality</span>
                  <span style={{ fontSize:'10px', color:'var(--text-muted)' }}>{lead.score}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width:`${lead.score}%`, background: lead.score >= 80 ? 'var(--success)' : lead.score >= 60 ? 'var(--warning)' : 'var(--danger)' }} />
                </div>
              </div>

              <div style={{ display:'flex', gap:'8px' }}>
                <button className="btn-primary" style={{ flex:1, justifyContent:'center', padding:'8px 12px', fontSize:'12px' }}><Phone size={11} />Call</button>
                <button className="btn-ghost" style={{ flex:1, justifyContent:'center', padding:'8px 12px', fontSize:'12px' }}><Star size={11} />Save</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
