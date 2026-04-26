'use client';
import { Download, FileText, BarChart3, TrendingUp, Users, Shield, Calendar, ChevronRight } from 'lucide-react';

const REPORTS = [
  { id:'r1', title:'Weekly Market Report', desc:'Price trends, new listings, area analysis', type:'market', date:'Apr 27, 2026', size:'2.4 MB', badge:'badge-blue', ready:true },
  { id:'r2', title:'Lead Performance Report', desc:'Hot leads, conversion rates, pipeline value', type:'leads', date:'Apr 26, 2026', size:'1.1 MB', badge:'badge-green', ready:true },
  { id:'r3', title:'Area Intelligence — Gulshan', desc:'Deep-dive: pricing, demand, competition', type:'area', date:'Apr 25, 2026', size:'3.2 MB', badge:'badge-purple', ready:true },
  { id:'r4', title:'Legal Risk Summary', desc:'All checked properties risk overview', type:'legal', date:'Apr 24, 2026', size:'890 KB', badge:'badge-yellow', ready:true },
  { id:'r5', title:'Investment Opportunity Report', desc:'Top 10 deals with ROI estimates', type:'invest', date:'Generating...', size:'—', badge:'badge-orange', ready:false },
];

const ICON_MAP: Record<string, any> = { market: TrendingUp, leads: Users, area: BarChart3, legal: Shield, invest: FileText };

export default function ReportsPage() {
  return (
    <div style={{ padding:'24px', maxWidth:'900px' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'24px' }}>
        {/* Generate report */}
        <div className="card" style={{ padding:'20px' }}>
          <h3 style={{ fontFamily:'Syne', fontSize:'14px', fontWeight:'700', marginBottom:'16px' }}>Generate Custom Report</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            <div>
              <label style={{ fontSize:'11px', color:'var(--text-muted)', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.07em', display:'block', marginBottom:'5px', fontFamily:'Syne' }}>Report Type</label>
              <select>
                <option>Market Intelligence</option>
                <option>Lead Pipeline</option>
                <option>Area Deep-Dive</option>
                <option>Legal Summary</option>
                <option>Investment Opportunities</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize:'11px', color:'var(--text-muted)', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.07em', display:'block', marginBottom:'5px', fontFamily:'Syne' }}>Area Filter</label>
              <select>
                <option>All Dhaka</option>
                <option>Gulshan</option>
                <option>Dhanmondi</option>
                <option>Bashundhara</option>
                <option>Mirpur</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize:'11px', color:'var(--text-muted)', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.07em', display:'block', marginBottom:'5px', fontFamily:'Syne' }}>Date Range</label>
              <select>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
                <option>Custom Range</option>
              </select>
            </div>
            <button className="btn-primary" style={{ justifyContent:'center', marginTop:'4px' }}><FileText size={13} />Generate Report</button>
          </div>
        </div>

        {/* Quick stats */}
        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          {[
            { label:'Reports Generated', value:'47', sub:'This month', color:'var(--accent)' },
            { label:'Google Sheet Exports', value:'12', sub:'Active sync', color:'var(--success)' },
            { label:'API Calls', value:'1,284', sub:'Last 30 days', color:'var(--accent-2)' },
          ].map(s => (
            <div key={s.label} className="stat-card cyan" style={{ display:'flex', alignItems:'center', gap:'14px', padding:'14px 18px' }}>
              <div style={{ fontSize:'24px', fontWeight:'800', fontFamily:'Syne', color:s.color }}>{s.value}</div>
              <div>
                <div style={{ fontSize:'13px', fontWeight:'600', color:'var(--text-primary)' }}>{s.label}</div>
                <div style={{ fontSize:'11px', color:'var(--text-muted)' }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report list */}
      <div className="card" style={{ overflow:'hidden' }}>
        <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <h3 style={{ fontFamily:'Syne', fontSize:'14px', fontWeight:'700' }}>Recent Reports</h3>
          <button className="btn-ghost" style={{ fontSize:'12px', padding:'6px 12px' }}>View All <ChevronRight size={11} /></button>
        </div>
        <div>
          {REPORTS.map(report => {
            const Icon = ICON_MAP[report.type];
            return (
              <div key={report.id} style={{ display:'flex', alignItems:'center', gap:'14px', padding:'16px 20px', borderBottom:'1px solid rgba(30,45,69,0.5)', transition:'background 0.15s', cursor:'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:'var(--bg-elevated)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon size={16} style={{ color:'var(--text-secondary)' }} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:'600', fontSize:'14px', color:'var(--text-primary)', marginBottom:'2px', fontFamily:'Syne' }}>{report.title}</div>
                  <div style={{ fontSize:'12px', color:'var(--text-muted)' }}>{report.desc}</div>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'4px', justifyContent:'flex-end' }}>
                    <span className={`badge ${report.badge}`}>{report.type.toUpperCase()}</span>
                  </div>
                  <div style={{ fontSize:'11px', color:'var(--text-muted)' }}>{report.date} · {report.size}</div>
                </div>
                {report.ready ? (
                  <button className="btn-ghost" style={{ padding:'8px', flexShrink:0 }}><Download size={14} /></button>
                ) : (
                  <div style={{ width:'36px', height:'36px', borderRadius:'8px', background:'var(--bg-elevated)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <div style={{ width:'14px', height:'14px', borderRadius:'50%', border:'2px solid var(--accent)', borderTopColor:'transparent', animation:'spin 1s linear infinite' }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Google Sheets Export */}
      <div className="card" style={{ padding:'20px', marginTop:'20px', background:'rgba(0,229,160,0.04)', border:'1px solid rgba(0,229,160,0.15)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
          <div style={{ fontSize:'32px' }}>📊</div>
          <div style={{ flex:1 }}>
            <h3 style={{ fontFamily:'Syne', fontSize:'14px', fontWeight:'700', marginBottom:'4px' }}>Google Sheets Auto-Sync</h3>
            <p style={{ fontSize:'12px', color:'var(--text-secondary)' }}>Automatically export filtered listings to your Google Sheet every day. Perfect for agents who prefer spreadsheets.</p>
          </div>
          <button className="btn-primary" style={{ flexShrink:0 }}>Connect Sheet</button>
        </div>
      </div>
    </div>
  );
}
