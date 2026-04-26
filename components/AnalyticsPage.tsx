'use client';
import { TrendingUp, BarChart3, Map, Building2, ArrowUpRight } from 'lucide-react';
import { AREA_STATS, PRICE_TRENDS } from '@/lib/data';
import MiniChart from './MiniChart';

const HEATMAP_AREAS = [
  { name:'Gulshan', x:65, y:30, size:52, score:92, color:'#00D4FF' },
  { name:'Banani', x:55, y:25, size:42, score:85, color:'#7C3AED' },
  { name:'Dhanmondi', x:42, y:48, size:48, score:82, color:'#FF6B35' },
  { name:'Bashundhara', x:70, y:18, size:56, score:94, color:'#00E5A0' },
  { name:'Uttara', x:48, y:12, size:44, score:88, color:'#F5C842' },
  { name:'Mirpur', x:28, y:38, size:38, score:78, color:'#A78BFA' },
  { name:'Rampura', x:72, y:42, size:34, score:72, color:'#FF6B35' },
  { name:'Mohakhali', x:60, y:36, size:30, score:80, color:'#00D4FF' },
];

export default function AnalyticsPage() {
  return (
    <div style={{ padding:'24px' }}>
      {/* Market Overview */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:'14px', marginBottom:'24px' }}>
        {[
          { label:'Market Index', value:'847.2', change:'+4.2%', color:'var(--accent)' },
          { label:'Avg Dhaka Price', value:'৳8,240', sub:'/sqft', change:'+7.1%', color:'var(--success)' },
          { label:'Monthly Listings', value:'12,847', change:'+18%', color:'var(--accent-2)' },
          { label:'Price Growth YoY', value:'22.4%', change:'vs 18% last yr', color:'var(--gold)' },
        ].map(s => (
          <div key={s.label} className="stat-card cyan" style={{ padding:'18px' }}>
            <div style={{ fontSize:'11px', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em', fontFamily:'Syne', fontWeight:'700', marginBottom:'8px' }}>{s.label}</div>
            <div style={{ fontSize:'24px', fontWeight:'800', fontFamily:'Syne', color:s.color, marginBottom:'4px' }}>{s.value}{s.sub && <span style={{ fontSize:'12px', color:'var(--text-muted)' }}>{s.sub}</span>}</div>
            <div style={{ fontSize:'11px', color:'var(--success)' }}>{s.change}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'20px' }}>
        {/* Price trend chart */}
        <div className="card" style={{ padding:'20px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
            <div>
              <h2 style={{ fontFamily:'Syne', fontSize:'15px', fontWeight:'700' }}>Price Trends (৳/sqft)</h2>
              <p style={{ fontSize:'11px', color:'var(--text-muted)', marginTop:'2px' }}>Monthly average by area</p>
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            {[
              { key:'gulshan' as const, label:'Gulshan', color:'#00D4FF' },
              { key:'dhanmondi' as const, label:'Dhanmondi', color:'#FF6B35' },
              { key:'bashundhara' as const, label:'Bashundhara', color:'#7C3AED' },
              { key:'mirpur' as const, label:'Mirpur', color:'#00E5A0' },
            ].map(area => {
              const data = PRICE_TRENDS[area.key];
              const latest = data[data.length - 1];
              const change = ((latest - data[0]) / data[0] * 100).toFixed(1);
              return (
                <div key={area.key} style={{ display:'grid', gridTemplateColumns:'100px 80px 1fr 60px', alignItems:'center', gap:'12px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                    <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:area.color, flexShrink:0 }} />
                    <span style={{ fontSize:'12px', color:'var(--text-primary)', fontWeight:'600' }}>{area.label}</span>
                  </div>
                  <span style={{ fontSize:'13px', fontFamily:'Syne', fontWeight:'700', color:'var(--text-primary)' }}>৳{latest.toLocaleString()}</span>
                  <MiniChart data={data} color={area.color} height={36} showArea={false} />
                  <span style={{ fontSize:'11px', color:'var(--success)', textAlign:'right' }}>+{change}%</span>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop:'16px', paddingTop:'16px', borderTop:'1px solid var(--border)', display:'flex', gap:'12px', justifyContent:'center' }}>
            {PRICE_TRENDS.labels.map(l => (
              <span key={l} style={{ fontSize:'11px', color:'var(--text-muted)' }}>{l}</span>
            ))}
          </div>
        </div>

        {/* Demand Heatmap */}
        <div className="card" style={{ padding:'20px' }}>
          <div style={{ marginBottom:'16px' }}>
            <h2 style={{ fontFamily:'Syne', fontSize:'15px', fontWeight:'700', marginBottom:'2px' }}>Demand Heatmap</h2>
            <p style={{ fontSize:'11px', color:'var(--text-muted)' }}>Dhaka city — bubble size = demand intensity</p>
          </div>
          <div style={{ position:'relative', background:'var(--bg-elevated)', borderRadius:'10px', height:'260px', border:'1px solid var(--border)', overflow:'hidden' }}>
            {/* Grid lines */}
            {[20,40,60,80].map(v => (
              <div key={v} style={{ position:'absolute', left:`${v}%`, top:0, bottom:0, borderLeft:'1px solid rgba(255,255,255,0.04)' }} />
            ))}
            {[25,50,75].map(v => (
              <div key={v} style={{ position:'absolute', top:`${v}%`, left:0, right:0, borderTop:'1px solid rgba(255,255,255,0.04)' }} />
            ))}
            {HEATMAP_AREAS.map(area => (
              <div key={area.name} style={{
                position:'absolute',
                left:`${area.x}%`, top:`${area.y}%`,
                transform:'translate(-50%, -50%)',
                width:`${area.size}px`, height:`${area.size}px`,
                borderRadius:'50%',
                background:`radial-gradient(circle, ${area.color}40, ${area.color}10)`,
                border:`1.5px solid ${area.color}60`,
                display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                cursor:'pointer', transition:'transform 0.2s',
              }} onMouseEnter={e => (e.currentTarget.style.transform = 'translate(-50%,-50%) scale(1.15)') }
                 onMouseLeave={e => (e.currentTarget.style.transform = 'translate(-50%,-50%) scale(1)')}>
                <span style={{ fontSize:area.size > 44 ? '10px' : '9px', fontWeight:'700', color:'var(--text-primary)', fontFamily:'Syne', textAlign:'center', lineHeight:'1.1' }}>{area.name}</span>
                <span style={{ fontSize:'9px', color:area.color, fontWeight:'700' }}>{area.score}</span>
              </div>
            ))}
            <div style={{ position:'absolute', bottom:'8px', left:'8px', fontSize:'10px', color:'var(--text-muted)' }}>← West · North ↑</div>
          </div>
        </div>
      </div>

      {/* Area Table */}
      <div className="card" style={{ padding:'20px' }}>
        <h2 style={{ fontFamily:'Syne', fontSize:'15px', fontWeight:'700', marginBottom:'16px' }}>Area Performance Breakdown</h2>
        <table>
          <thead>
            <tr>
              <th>Area</th>
              <th>Avg ৳/sqft</th>
              <th>6M Growth</th>
              <th>Active Listings</th>
              <th>Demand Score</th>
              <th>Investment Grade</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {AREA_STATS.map((area, i) => (
              <tr key={area.area}>
                <td>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                    <span style={{ fontSize:'11px', color:'var(--text-muted)', fontFamily:'Syne', fontWeight:'700', width:'16px' }}>#{i+1}</span>
                    <span style={{ fontWeight:'600', color:'var(--text-primary)' }}>{area.area}</span>
                  </div>
                </td>
                <td><span style={{ fontFamily:'Syne', fontWeight:'700' }}>৳{area.avgPrice.toLocaleString()}</span></td>
                <td><span style={{ color:'var(--success)', fontWeight:'600' }}>+{area.growth}% <TrendingUp size={11} style={{ display:'inline' }} /></span></td>
                <td>{area.listings.toLocaleString()}</td>
                <td>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                    <div className="progress-bar" style={{ width:'80px' }}>
                      <div className="progress-fill" style={{ width:`${area.demand}%`, background: area.demand >= 85 ? 'var(--success)' : 'var(--warning)' }} />
                    </div>
                    <span style={{ fontSize:'12px', fontWeight:'600' }}>{area.demand}</span>
                  </div>
                </td>
                <td>
                  <span className={`badge ${area.growth >= 8 ? 'badge-green' : area.growth >= 5 ? 'badge-yellow' : 'badge-blue'}`}>
                    {area.growth >= 8 ? 'A+' : area.growth >= 5 ? 'A' : 'B'}
                  </span>
                </td>
                <td><ArrowUpRight size={14} style={{ color:'var(--success)' }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
