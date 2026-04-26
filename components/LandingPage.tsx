'use client';
import { useState } from 'react';
import { ArrowRight, Check, Zap, Shield, TrendingUp, BarChart3, Users, Search, Star, ChevronRight, Globe } from 'lucide-react';

const FEATURES = [
  { icon: Search, title: 'Smart Property Search', desc: 'AI-powered search across Bproperty, Lamudi, Facebook & more. No duplicates, clean data daily.', color: 'var(--accent)' },
  { icon: Zap, title: 'Hot Lead Detection', desc: 'Automatic urgent seller detection. Get first access before other agents even see the listing.', color: 'var(--accent-2)' },
  { icon: TrendingUp, title: 'Market Intelligence', desc: 'Real-time price trends, area heatmaps, ROI estimates. Data-driven decisions in BD market.', color: 'var(--success)' },
  { icon: Shield, title: 'Legal Risk Engine ⚖️', desc: "Bangladesh's only automated legal check. Title deed, mutation, dispute detection — your exclusive moat.", color: '#A78BFA' },
  { icon: BarChart3, title: 'Deal Scoring AI', desc: 'Every property scored 0–100. Find underpriced deals instantly. Never overpay again.', color: 'var(--gold)' },
  { icon: Users, title: 'Lead Management', desc: 'Organized lead pipeline with urgency scoring. Export to Google Sheets or use our API.', color: 'var(--accent)' },
];

const PLANS = [
  { name:'Agent', price:'৳3,000', period:'/month', color:'var(--accent)', features:['Daily fresh listings', 'Lead alerts (instant)', 'Area-based filtering', 'Google Sheet export', 'Contact-ready listings'], popular:false },
  { name:'Investor', price:'৳8,000', period:'/month', color:'var(--accent-2)', features:['Everything in Agent', 'AI Deal scoring', 'Price trend analysis', 'ROI estimation', 'Price drop alerts', 'Investment dashboard'], popular:true },
  { name:'Developer', price:'৳20,000', period:'/month', color:'#A78BFA', features:['Everything in Investor', 'Market heatmaps', 'Competitor tracking', 'Custom reports', 'API access', 'Dedicated support'], popular:false },
];

const STATS = [
  { value:'12,847', label:'Active Listings Tracked' },
  { value:'3 hrs', label:'Avg Time Saved/Day' },
  { value:'89%', label:'Legal Clean Rate' },
  { value:'৳2.4Cr', label:'Avg Deal Value Found' },
];

export default function LandingPage({ onEnter }: { onEnter: () => void }) {
  const [email, setEmail] = useState('');

  return (
    <div style={{ minHeight:'100vh', overflow:'hidden' }}>
      {/* Nav */}
      <nav style={{ 
        position:'sticky', top:0, zIndex:50,
        background:'rgba(7,11,20,0.85)', backdropFilter:'blur(16px)',
        borderBottom:'1px solid var(--border)',
        padding:'0 40px', height:'64px',
        display:'flex', alignItems:'center', justifyContent:'space-between'
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:'linear-gradient(135deg, var(--accent), var(--accent-3))', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Syne', fontWeight:'900', fontSize:'16px', color:'#000' }}>P</div>
          <span style={{ fontFamily:'Syne', fontWeight:'800', fontSize:'20px', letterSpacing:'-0.02em' }}>POPY</span>
          <span style={{ fontSize:'10px', color:'var(--text-muted)', padding:'2px 7px', border:'1px solid var(--border)', borderRadius:'4px', letterSpacing:'0.1em', textTransform:'uppercase' }}>Beta</span>
        </div>
        <div style={{ display:'flex', gap:'12px', alignItems:'center' }}>
          <button className="btn-ghost" style={{ fontSize:'13px' }}>Pricing</button>
          <button className="btn-ghost" style={{ fontSize:'13px' }}>Features</button>
          <button className="btn-primary" onClick={onEnter}>Open Dashboard <ArrowRight size={13} /></button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ 
        minHeight:'90vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        padding:'60px 40px', textAlign:'center', position:'relative'
      }}>
        {/* Glow */}
        <div style={{ position:'absolute', top:'20%', left:'50%', transform:'translateX(-50%)', width:'600px', height:'300px', background:'radial-gradient(ellipse, rgba(0,212,255,0.08) 0%, transparent 70%)', pointerEvents:'none' }} />

        <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'6px 16px', borderRadius:'99px', border:'1px solid rgba(0,212,255,0.3)', background:'rgba(0,212,255,0.05)', marginBottom:'28px', fontSize:'12px', color:'var(--accent)', fontWeight:'600' }}>
          <span className="live-dot" />
          Bangladesh's First AI Property Intelligence Platform
        </div>

        <h1 style={{ 
          fontFamily:'Syne', fontSize:'clamp(36px, 6vw, 72px)', fontWeight:'900',
          lineHeight:'1.05', marginBottom:'24px', maxWidth:'800px',
          background:'linear-gradient(135deg, var(--text-primary) 0%, var(--accent) 100%)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          backgroundClip:'text'
        }}>
          Find Better<br />Property Deals<br />Faster
        </h1>

        <p style={{ fontSize:'18px', color:'var(--text-secondary)', maxWidth:'520px', lineHeight:'1.7', marginBottom:'36px' }}>
          AI-powered property intelligence for Bangladesh. Auto-collect listings, detect hot deals, verify legal status — all in one dashboard.
        </p>

        <div style={{ display:'flex', gap:'12px', marginBottom:'16px', flexWrap:'wrap', justifyContent:'center' }}>
          <input 
            placeholder="Enter your email"
            value={email} onChange={e => setEmail(e.target.value)}
            style={{ width:'280px' }}
          />
          <button className="btn-primary" style={{ padding:'10px 28px', fontSize:'15px' }} onClick={onEnter}>
            Start Free Trial <ArrowRight size={14} />
          </button>
        </div>
        <p style={{ fontSize:'12px', color:'var(--text-muted)' }}>No credit card required · 14-day free trial</p>

        {/* Stats bar */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'0', marginTop:'64px', maxWidth:'700px', width:'100%', background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'12px', overflow:'hidden' }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{ padding:'20px', textAlign:'center', borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ fontFamily:'Syne', fontSize:'22px', fontWeight:'900', color:'var(--text-primary)', marginBottom:'4px' }}>{s.value}</div>
              <div style={{ fontSize:'11px', color:'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding:'80px 40px', maxWidth:'1200px', margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'56px' }}>
          <h2 style={{ fontFamily:'Syne', fontSize:'clamp(28px, 4vw, 44px)', fontWeight:'800', marginBottom:'14px' }}>
            Everything You Need to Win<br />in BD Real Estate
          </h2>
          <p style={{ color:'var(--text-secondary)', fontSize:'16px', maxWidth:'480px', margin:'0 auto' }}>
            Built specifically for the Bangladesh market. No generic tools — purpose-built for Dhaka, Chittagong & beyond.
          </p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'16px' }}>
          {FEATURES.map(f => (
            <div key={f.title} className="card" style={{ padding:'24px', transition:'transform 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
              <div style={{ width:'44px', height:'44px', borderRadius:'10px', background:`${f.color}15`, border:`1px solid ${f.color}30`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'16px' }}>
                <f.icon size={20} style={{ color:f.color }} />
              </div>
              <h3 style={{ fontFamily:'Syne', fontSize:'16px', fontWeight:'700', marginBottom:'8px' }}>{f.title}</h3>
              <p style={{ fontSize:'13px', color:'var(--text-secondary)', lineHeight:'1.6' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding:'80px 40px', maxWidth:'1100px', margin:'0 auto' }} id="pricing">
        <div style={{ textAlign:'center', marginBottom:'48px' }}>
          <h2 style={{ fontFamily:'Syne', fontSize:'clamp(28px, 4vw, 44px)', fontWeight:'800', marginBottom:'12px' }}>Simple, Transparent Pricing</h2>
          <p style={{ color:'var(--text-secondary)' }}>In Bangladesh, people pay for results. We deliver results.</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'16px' }}>
          {PLANS.map(plan => (
            <div key={plan.name} style={{
              background:'var(--bg-card)', border:`1px solid ${plan.popular ? plan.color + '50' : 'var(--border)'}`,
              borderRadius:'16px', padding:'28px', position:'relative',
              transform: plan.popular ? 'scale(1.03)' : 'scale(1)',
              boxShadow: plan.popular ? `0 0 40px ${plan.color}15` : 'none'
            }}>
              {plan.popular && (
                <div style={{ position:'absolute', top:'-12px', left:'50%', transform:'translateX(-50%)', background:plan.color, color:'#000', padding:'4px 16px', borderRadius:'99px', fontSize:'11px', fontWeight:'800', fontFamily:'Syne', whiteSpace:'nowrap' }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ marginBottom:'20px' }}>
                <h3 style={{ fontFamily:'Syne', fontSize:'18px', fontWeight:'800', marginBottom:'4px', color: plan.color }}>{plan.name}</h3>
                <div style={{ display:'flex', alignItems:'baseline', gap:'4px' }}>
                  <span style={{ fontFamily:'Syne', fontSize:'32px', fontWeight:'900', color:'var(--text-primary)' }}>{plan.price}</span>
                  <span style={{ color:'var(--text-muted)', fontSize:'13px' }}>{plan.period}</span>
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginBottom:'24px' }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                    <Check size={13} style={{ color:'var(--success)', flexShrink:0 }} />
                    <span style={{ fontSize:'13px', color:'var(--text-secondary)' }}>{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={onEnter} style={{ 
                width:'100%', padding:'12px', borderRadius:'8px', border:`1px solid ${plan.color}50`,
                background: plan.popular ? plan.color : 'transparent',
                color: plan.popular ? '#000' : plan.color,
                fontFamily:'Syne', fontWeight:'700', fontSize:'14px', cursor:'pointer',
                transition:'all 0.2s'
              }}>
                Get Started <ChevronRight size={13} style={{ display:'inline' }} />
              </button>
            </div>
          ))}
        </div>
        <p style={{ textAlign:'center', marginTop:'20px', fontSize:'12px', color:'var(--text-muted)' }}>
          Legal services billed per case · API access available for Lead Gen businesses · Banks get custom enterprise pricing
        </p>
      </section>

      {/* CTA */}
      <section style={{ padding:'80px 40px', textAlign:'center' }}>
        <div style={{ maxWidth:'600px', margin:'0 auto', background:'linear-gradient(135deg, rgba(0,212,255,0.06), rgba(124,58,237,0.06))', border:'1px solid rgba(0,212,255,0.15)', borderRadius:'20px', padding:'48px' }}>
          <h2 style={{ fontFamily:'Syne', fontSize:'32px', fontWeight:'800', marginBottom:'14px' }}>Ready to get ahead?</h2>
          <p style={{ color:'var(--text-secondary)', marginBottom:'28px' }}>Join 500+ agents, investors & developers already using POPY to win more deals.</p>
          <button className="btn-primary" style={{ padding:'14px 40px', fontSize:'16px' }} onClick={onEnter}>
            Open Platform Free <ArrowRight size={15} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop:'1px solid var(--border)', padding:'28px 40px', display:'flex', alignItems:'center', justifyContent:'space-between', color:'var(--text-muted)', fontSize:'12px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <Globe size={12} />
          <span>© 2026 POPY · Bangladesh Property Intelligence Platform</span>
        </div>
        <div style={{ display:'flex', gap:'20px' }}>
          <span style={{ cursor:'pointer' }}>Privacy</span>
          <span style={{ cursor:'pointer' }}>Terms</span>
          <span style={{ cursor:'pointer' }}>Contact</span>
        </div>
      </footer>
    </div>
  );
}
