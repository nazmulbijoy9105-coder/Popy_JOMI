'use client';
import { useState } from 'react';
import { Shield, CheckCircle2, XCircle, AlertTriangle, FileText, Search, Loader2, ChevronRight } from 'lucide-react';
import { PROPERTIES, formatPrice } from '@/lib/data';

const CHECKS = [
  { id:'title', label:'Title Deed Verification', desc:'Verify ownership chain & transfer history' },
  { id:'mutation', label:'Mutation Record (Namjari)', desc:'Check current land record mutation' },
  { id:'tax', label:'Land Tax Clearance', desc:'Verify khazna & tax payment status' },
  { id:'encumbrance', label:'Encumbrance Certificate', desc:'Check for mortgages, liens & charges' },
  { id:'dispute', label:'Court Dispute Check', desc:'Scan for active litigation or disputes' },
  { id:'bs', label:'BS (Cadastral) Survey', desc:'Verify boundary & survey records' },
];

type RiskResult = { score: number; level: 'LOW' | 'MEDIUM' | 'HIGH'; passed: string[]; failed: string[]; warnings: string[] };

export default function LegalPage() {
  const [propertyId, setPropertyId] = useState('');
  const [customAddr, setCustomAddr] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RiskResult | null>(null);
  const [step, setStep] = useState(0);
  const [stepLabels] = useState(['Fetching records...', 'Checking title deed...', 'Verifying mutation...', 'Scanning disputes...', 'Calculating risk score...']);

  const runCheck = () => {
    if (!propertyId && !customAddr) return;
    setLoading(true);
    setResult(null);
    setStep(0);
    const interval = setInterval(() => {
      setStep(s => { if (s >= 4) { clearInterval(interval); return s; } return s + 1; });
    }, 600);
    setTimeout(() => {
      clearInterval(interval);
      setLoading(false);
      const selectedProp = PROPERTIES.find(p => p.id === propertyId);
      const level = selectedProp ? selectedProp.riskScore.toUpperCase() as 'LOW'|'MEDIUM'|'HIGH' : 'MEDIUM';
      setResult({
        score: level === 'LOW' ? 88 : level === 'MEDIUM' ? 61 : 32,
        level,
        passed: ['Title deed found & verified', 'Tax clearance up to date', 'No encumbrance registered'],
        failed: level !== 'LOW' ? ['Mutation record inconsistency detected'] : [],
        warnings: level === 'HIGH' ? ['Active court case found (2019)', 'Boundary dispute with adjacent plot'] : level === 'MEDIUM' ? ['Mutation pending — verify manually'] : [],
      });
    }, 3200);
  };

  return (
    <div style={{ padding:'24px', maxWidth:'900px' }}>
      {/* Header */}
      <div style={{ background:'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(0,212,255,0.08))', border:'1px solid rgba(124,58,237,0.2)', borderRadius:'12px', padding:'20px', marginBottom:'24px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'8px' }}>
          <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:'rgba(124,58,237,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Shield size={20} style={{ color:'#A78BFA' }} />
          </div>
          <div>
            <h2 style={{ fontFamily:'Syne', fontSize:'18px', fontWeight:'800', color:'var(--text-primary)' }}>Legal Verification Engine</h2>
            <p style={{ fontSize:'12px', color:'var(--text-muted)' }}>Bangladesh's most comprehensive property legal check — Your exclusive competitive moat</p>
          </div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:'20px' }}>
        <div>
          {/* Input */}
          <div className="card" style={{ padding:'20px', marginBottom:'20px' }}>
            <h3 style={{ fontFamily:'Syne', fontSize:'14px', fontWeight:'700', marginBottom:'16px' }}>Start Legal Check</h3>
            <div style={{ marginBottom:'12px' }}>
              <label style={{ fontSize:'11px', fontWeight:'700', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em', display:'block', marginBottom:'6px', fontFamily:'Syne' }}>Select from Tracked Properties</label>
              <select value={propertyId} onChange={e => setPropertyId(e.target.value)}>
                <option value="">— Choose a property —</option>
                {PROPERTIES.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', margin:'12px 0' }}>
              <div style={{ flex:1, height:'1px', background:'var(--border)' }} />
              <span style={{ fontSize:'11px', color:'var(--text-muted)' }}>or</span>
              <div style={{ flex:1, height:'1px', background:'var(--border)' }} />
            </div>
            <div style={{ marginBottom:'16px' }}>
              <label style={{ fontSize:'11px', fontWeight:'700', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em', display:'block', marginBottom:'6px', fontFamily:'Syne' }}>Enter Property Address Manually</label>
              <input placeholder="e.g. Plot 14, Road 5, Dhanmondi, Dhaka" value={customAddr} onChange={e => setCustomAddr(e.target.value)} />
            </div>
            <div style={{ marginBottom:'16px' }}>
              <label style={{ fontSize:'11px', fontWeight:'700', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em', display:'block', marginBottom:'10px', fontFamily:'Syne' }}>Checks to Run</label>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
                {CHECKS.map(c => (
                  <label key={c.id} style={{ display:'flex', alignItems:'flex-start', gap:'8px', padding:'10px', background:'var(--bg-elevated)', borderRadius:'8px', border:'1px solid var(--border)', cursor:'pointer' }}>
                    <input type="checkbox" defaultChecked style={{ marginTop:'2px', accentColor:'var(--accent)', width:'auto' }} />
                    <div>
                      <div style={{ fontSize:'12px', fontWeight:'600', color:'var(--text-primary)' }}>{c.label}</div>
                      <div style={{ fontSize:'10px', color:'var(--text-muted)' }}>{c.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <button className="btn-primary" onClick={runCheck} disabled={loading} style={{ width:'100%', justifyContent:'center', padding:'12px', fontSize:'15px' }}>
              {loading ? <><Loader2 size={14} style={{ animation:'spin 1s linear infinite' }} />Running Check...</> : <><Search size={14} />Run Legal Check</>}
            </button>
          </div>

          {/* Loading progress */}
          {loading && (
            <div className="card" style={{ padding:'20px', marginBottom:'20px' }}>
              <h3 style={{ fontFamily:'Syne', fontSize:'14px', fontWeight:'700', marginBottom:'16px' }}>Scanning Records...</h3>
              {stepLabels.map((label, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'10px', opacity: i <= step ? 1 : 0.3 }}>
                  {i < step ? <CheckCircle2 size={16} style={{ color:'var(--success)', flexShrink:0 }} /> : i === step ? <Loader2 size={16} style={{ color:'var(--accent)', flexShrink:0, animation:'spin 1s linear infinite' }} /> : <div style={{ width:'16px', height:'16px', borderRadius:'50%', border:'1px solid var(--border)', flexShrink:0 }} />}
                  <span style={{ fontSize:'13px', color: i <= step ? 'var(--text-primary)' : 'var(--text-muted)' }}>{label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Result */}
          {result && !loading && (
            <div className="card" style={{ padding:'24px', border:`1px solid ${result.level === 'LOW' ? 'rgba(0,229,160,0.3)' : result.level === 'MEDIUM' ? 'rgba(255,184,0,0.3)' : 'rgba(255,68,68,0.3)'}` }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
                <h3 style={{ fontFamily:'Syne', fontSize:'16px', fontWeight:'800' }}>Legal Check Result</h3>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:'36px', fontWeight:'900', fontFamily:'Syne', color: result.level === 'LOW' ? 'var(--success)' : result.level === 'MEDIUM' ? 'var(--warning)' : 'var(--danger)', lineHeight:1 }}>{result.score}</div>
                  <div style={{ fontSize:'11px', color:'var(--text-muted)' }}>Risk Score</div>
                </div>
              </div>
              
              <div style={{ display:'flex', alignItems:'center', gap:'12px', padding:'16px', borderRadius:'10px', background: result.level === 'LOW' ? 'rgba(0,229,160,0.08)' : result.level === 'MEDIUM' ? 'rgba(255,184,0,0.08)' : 'rgba(255,68,68,0.08)', border:`1px solid ${result.level === 'LOW' ? 'rgba(0,229,160,0.2)' : result.level === 'MEDIUM' ? 'rgba(255,184,0,0.2)' : 'rgba(255,68,68,0.2)'}`, marginBottom:'16px' }}>
                <Shield size={24} style={{ color: result.level === 'LOW' ? 'var(--success)' : result.level === 'MEDIUM' ? 'var(--warning)' : 'var(--danger)' }} />
                <div>
                  <div style={{ fontFamily:'Syne', fontSize:'18px', fontWeight:'800', color: result.level === 'LOW' ? 'var(--success)' : result.level === 'MEDIUM' ? 'var(--warning)' : 'var(--danger)' }}>RISK: {result.level}</div>
                  <div style={{ fontSize:'12px', color:'var(--text-secondary)' }}>{result.level === 'LOW' ? 'Property appears legally safe to proceed' : result.level === 'MEDIUM' ? 'Some issues need manual verification' : 'Significant legal risks detected — Do not proceed without lawyer'}</div>
                </div>
              </div>

              {result.passed.length > 0 && (
                <div style={{ marginBottom:'14px' }}>
                  <div style={{ fontSize:'11px', color:'var(--success)', fontWeight:'700', fontFamily:'Syne', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'0.08em' }}>✓ Passed ({result.passed.length})</div>
                  {result.passed.map(p => <div key={p} style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px' }}><CheckCircle2 size={13} style={{ color:'var(--success)', flexShrink:0 }} /><span style={{ fontSize:'13px', color:'var(--text-secondary)' }}>{p}</span></div>)}
                </div>
              )}
              {result.failed.length > 0 && (
                <div style={{ marginBottom:'14px' }}>
                  <div style={{ fontSize:'11px', color:'var(--danger)', fontWeight:'700', fontFamily:'Syne', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'0.08em' }}>✗ Failed ({result.failed.length})</div>
                  {result.failed.map(f => <div key={f} style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px' }}><XCircle size={13} style={{ color:'var(--danger)', flexShrink:0 }} /><span style={{ fontSize:'13px', color:'var(--text-secondary)' }}>{f}</span></div>)}
                </div>
              )}
              {result.warnings.length > 0 && (
                <div style={{ marginBottom:'14px' }}>
                  <div style={{ fontSize:'11px', color:'var(--warning)', fontWeight:'700', fontFamily:'Syne', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'0.08em' }}>⚠ Warnings ({result.warnings.length})</div>
                  {result.warnings.map(w => <div key={w} style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px' }}><AlertTriangle size={13} style={{ color:'var(--warning)', flexShrink:0 }} /><span style={{ fontSize:'13px', color:'var(--text-secondary)' }}>{w}</span></div>)}
                </div>
              )}

              <div style={{ display:'flex', gap:'10px', marginTop:'16px' }}>
                <button className="btn-primary" style={{ flex:1, justifyContent:'center' }}><FileText size={13} />Download Report</button>
                <button className="btn-ghost" style={{ flex:1, justifyContent:'center' }}>Share with Lawyer</button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar info */}
        <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
          <div className="card" style={{ padding:'16px' }}>
            <h3 style={{ fontFamily:'Syne', fontSize:'13px', fontWeight:'700', marginBottom:'12px', color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.06em' }}>Document Checklist</h3>
            {['Title Deed (দলিল)', 'Mutation Certificate (নামজারি)', 'Land Tax Receipt (খাজনা)', 'BS Survey Map', 'NEC (Non-Encumbrance)', 'Approval Plans (RAJUK/CDA)'].map(doc => (
              <div key={doc} style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px' }}>
                <FileText size={11} style={{ color:'var(--accent)', flexShrink:0 }} />
                <span style={{ fontSize:'12px', color:'var(--text-secondary)' }}>{doc}</span>
              </div>
            ))}
          </div>
          <div className="card" style={{ padding:'16px', background:'rgba(124,58,237,0.05)', border:'1px solid rgba(124,58,237,0.2)' }}>
            <h3 style={{ fontFamily:'Syne', fontSize:'13px', fontWeight:'700', marginBottom:'8px' }}>Pricing</h3>
            {[['Basic Check', '৳3,000'], ['Full Legal Report', '৳8,000'], ['Dispute Resolution', '৳25,000']].map(([name, price]) => (
              <div key={String(name)} style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
                <span style={{ fontSize:'12px', color:'var(--text-secondary)' }}>{name}</span>
                <span style={{ fontSize:'12px', fontWeight:'700', fontFamily:'Syne', color:'var(--gold)' }}>{price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
