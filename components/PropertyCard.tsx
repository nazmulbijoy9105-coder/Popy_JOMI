'use client';
import { Bed, Bath, Square, MapPin, TrendingDown, TrendingUp, Zap, ShieldCheck, Clock } from 'lucide-react';
import { Property, formatPrice } from '@/lib/data';

interface PropertyCardProps { property: Property; onClick?: () => void; }

export default function PropertyCard({ property, onClick }: PropertyCardProps) {
  const isUrgent = property.status === 'urgent';
  return (
    <div onClick={onClick} style={{
      background:'var(--bg-card)', border:`1px solid ${isUrgent ? 'rgba(255,107,53,0.4)' : 'var(--border)'}`,
      borderRadius:'12px', overflow:'hidden', cursor:'pointer',
      transition:'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
    }} onMouseEnter={e => {
      (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
      (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.4)';
    }} onMouseLeave={e => {
      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
    }}>
      {/* Image area */}
      <div style={{ height:'140px', background:`linear-gradient(135deg, ${property.imageColor}20, ${property.imageColor}08)`, position:'relative', borderBottom:'1px solid var(--border)' }}>
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ fontSize:'42px', opacity:0.3 }}>
            {property.type === 'apartment' ? '🏢' : property.type === 'house' ? '🏠' : property.type === 'plot' ? '🗺️' : '🏪'}
          </div>
        </div>
        <div style={{ position:'absolute', top:'10px', left:'10px', display:'flex', gap:'6px', flexWrap:'wrap' }}>
          {isUrgent && <span className="badge badge-orange"><Zap size={9} />URGENT</span>}
          {property.isNew && <span className="badge badge-blue">NEW</span>}
          {property.isVerified && <span className="badge badge-green"><ShieldCheck size={9} />Verified</span>}
        </div>
        {property.priceChange !== undefined && property.priceChange !== 0 && (
          <div style={{ position:'absolute', top:'10px', right:'10px' }}>
            <span className={`badge ${property.priceChange < 0 ? 'badge-red' : 'badge-green'}`}>
              {property.priceChange < 0 ? <TrendingDown size={9} /> : <TrendingUp size={9} />}
              {Math.abs(property.priceChange)}%
            </span>
          </div>
        )}
        <div style={{ position:'absolute', bottom:'10px', right:'10px' }}>
          <div style={{ 
            background:'rgba(0,0,0,0.7)', borderRadius:'6px', padding:'3px 8px',
            display:'flex', alignItems:'center', gap:'4px'
          }}>
            <div style={{ fontSize:'10px', color:'var(--text-muted)' }}>Score</div>
            <div style={{ 
              fontSize:'12px', fontWeight:'700', fontFamily:'Syne',
              color: property.dealScore >= 80 ? 'var(--success)' : property.dealScore >= 60 ? 'var(--warning)' : 'var(--danger)'
            }}>{property.dealScore}</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding:'14px' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'8px', marginBottom:'8px' }}>
          <h3 style={{ fontSize:'13px', fontWeight:'600', fontFamily:'Syne', color:'var(--text-primary)', lineHeight:'1.3', flex:1 }}>{property.title}</h3>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'4px', marginBottom:'10px' }}>
          <MapPin size={11} style={{ color:'var(--text-muted)', flexShrink:0 }} />
          <span style={{ fontSize:'11px', color:'var(--text-secondary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{property.location}</span>
        </div>
        <div style={{ fontSize:'20px', fontWeight:'800', fontFamily:'Syne', color:'var(--text-primary)', marginBottom:'10px' }}>
          {formatPrice(property.price)}
          {(property.pricePerSqft ?? 0) > 0 && <span style={{ fontSize:'11px', fontWeight:'400', color:'var(--text-muted)', marginLeft:'6px' }}>৳{property.pricePerSqft}/sqft</span>}
        </div>
        {(property.bedrooms > 0 || property.sqft > 0) && (
          <div style={{ display:'flex', gap:'12px', paddingTop:'10px', borderTop:'1px solid var(--border)' }}>
            {property.bedrooms > 0 && <div style={{ display:'flex', alignItems:'center', gap:'4px', fontSize:'12px', color:'var(--text-secondary)' }}><Bed size={11} />{property.bedrooms} bed</div>}
            {property.bathrooms > 0 && <div style={{ display:'flex', alignItems:'center', gap:'4px', fontSize:'12px', color:'var(--text-secondary)' }}><Bath size={11} />{property.bathrooms} bath</div>}
            <div style={{ display:'flex', alignItems:'center', gap:'4px', fontSize:'12px', color:'var(--text-secondary)' }}><Square size={11} />{property.sqft.toLocaleString()} sqft</div>
            <div style={{ display:'flex', alignItems:'center', gap:'4px', fontSize:'12px', color:'var(--text-muted)', marginLeft:'auto' }}><Clock size={11} />{property.listedAt}</div>
          </div>
        )}
      </div>
    </div>
  );
}
