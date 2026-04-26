'use client'
import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Loader2 } from 'lucide-react'

interface AuthPageProps {
  onSuccess: (token: string, user: any) => void
}

export default function AuthPage({ onSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', name: '', phone: '', role: 'agent' })

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const submit = async () => {
    setError('')
    setLoading(true)
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
      const body = mode === 'login'
        ? { email: form.email, password: form.password }
        : { email: form.email, password: form.password, name: form.name, phone: form.phone, role: form.role }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      localStorage.setItem('popy_token', data.token)
      localStorage.setItem('popy_user', JSON.stringify(data.user))
      onSuccess(data.token, data.user)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', background:'var(--bg)' }}>
      <div style={{ width:'100%', maxWidth:'420px' }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'32px' }}>
          <div style={{ width:'52px', height:'52px', borderRadius:'14px', background:'linear-gradient(135deg, var(--accent), var(--accent-3))', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Syne', fontWeight:'900', fontSize:'24px', color:'#000', margin:'0 auto 12px' }}>P</div>
          <h1 style={{ fontFamily:'Syne', fontSize:'24px', fontWeight:'800' }}>POPY Platform</h1>
          <p style={{ color:'var(--text-muted)', fontSize:'13px', marginTop:'4px' }}>Bangladesh Property Intelligence</p>
        </div>

        <div className="card" style={{ padding:'28px' }}>
          {/* Mode toggle */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px', background:'var(--bg-elevated)', padding:'4px', borderRadius:'8px', marginBottom:'24px' }}>
            {(['login','register'] as const).map(m => (
              <button key={m} onClick={() => { setMode(m); setError('') }} style={{
                padding:'8px', borderRadius:'6px', border:'none', cursor:'pointer',
                background: mode === m ? 'var(--bg-card)' : 'transparent',
                color: mode === m ? 'var(--text-primary)' : 'var(--text-muted)',
                fontFamily:'Syne', fontWeight:'700', fontSize:'13px',
                boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
                transition:'all 0.15s'
              }}>{m === 'login' ? 'Sign In' : 'Register'}</button>
            ))}
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            {mode === 'register' && (
              <>
                <div style={{ position:'relative' }}>
                  <User size={14} style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', pointerEvents:'none' }} />
                  <input placeholder="Full Name" value={form.name} onChange={e => set('name', e.target.value)} style={{ paddingLeft:'36px' }} />
                </div>
                <div style={{ position:'relative' }}>
                  <Phone size={14} style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', pointerEvents:'none' }} />
                  <input placeholder="Phone (+880...)" value={form.phone} onChange={e => set('phone', e.target.value)} style={{ paddingLeft:'36px' }} />
                </div>
                <select value={form.role} onChange={e => set('role', e.target.value)}>
                  <option value="agent">Real Estate Agent</option>
                  <option value="investor">Property Investor</option>
                  <option value="developer">Developer / Builder</option>
                  <option value="buyer">General Buyer</option>
                </select>
              </>
            )}

            <div style={{ position:'relative' }}>
              <Mail size={14} style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', pointerEvents:'none' }} />
              <input type="email" placeholder="Email address" value={form.email} onChange={e => set('email', e.target.value)} style={{ paddingLeft:'36px' }} />
            </div>

            <div style={{ position:'relative' }}>
              <Lock size={14} style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', pointerEvents:'none' }} />
              <input type={showPass ? 'text' : 'password'} placeholder="Password (min 8 chars)" value={form.password} onChange={e => set('password', e.target.value)} style={{ paddingLeft:'36px', paddingRight:'40px' }} onKeyDown={e => e.key === 'Enter' && submit()} />
              <button onClick={() => setShowPass(!showPass)} style={{ position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:'2px' }}>
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>

            {error && (
              <div style={{ background:'rgba(255,68,68,0.08)', border:'1px solid rgba(255,68,68,0.3)', borderRadius:'6px', padding:'10px 14px', fontSize:'13px', color:'var(--danger)' }}>
                {error}
              </div>
            )}

            <button className="btn-primary" onClick={submit} disabled={loading} style={{ width:'100%', justifyContent:'center', padding:'12px', fontSize:'15px', marginTop:'4px' }}>
              {loading ? <><Loader2 size={14} style={{ animation:'spin 1s linear infinite' }} />Processing...</> : <>{mode === 'login' ? 'Sign In' : 'Create Account'}<ArrowRight size={14} /></>}
            </button>

            {/* Demo login */}
            <button onClick={() => { set('email','demo@popy.bd'); set('password','demo1234'); }} style={{ background:'rgba(0,212,255,0.06)', border:'1px dashed rgba(0,212,255,0.3)', borderRadius:'6px', padding:'8px', color:'var(--accent)', fontSize:'12px', cursor:'pointer', textAlign:'center' }}>
              Use demo account → demo@popy.bd / demo1234
            </button>
          </div>
        </div>

        <p style={{ textAlign:'center', fontSize:'11px', color:'var(--text-muted)', marginTop:'16px' }}>
          By continuing you agree to POPY's Terms & Privacy Policy
        </p>
      </div>
    </div>
  )
}
