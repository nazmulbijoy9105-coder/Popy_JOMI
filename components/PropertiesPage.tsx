'use client';
import { useState } from 'react';
import { Filter, Grid, List, Download, RefreshCw, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { PROPERTIES, Property, formatPrice } from '@/lib/data';
import PropertyCard from './PropertyCard';

export default function PropertiesPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({ area: '', type: '', status: '', minPrice: '', maxPrice: '' });
  const [sort, setSort] = useState('newest');
  const [selected, setSelected] = useState<Property | null>(null);

  const filtered = PROPERTIES.filter(p => {
    if (filters.area && !p.area.toLowerCase().includes(filters.area.toLowerCase())) return false;
    if (filters.type && p.type !== filters.type) return false;
    if (filters.status && p.status !== filters.status) return false;
    if (filters.minPrice && p.price < parseInt(filters.minPrice)) return false;
    if (filters.maxPrice && p.price > parseInt(filters.maxPrice)) return false;
    return true;
  }).sort((a, b) => {
    if (sort === 'price_asc') return a.price - b.price;
    if (sort === 'price_desc') return b.price - a.price;
    if (sort === 'score') return b.dealScore - a.dealScore;
    return 0;
  });

  return (
    <div style={{ padding:'24px' }}>
      {/* Filter bar */}
      <div className="card" style={{ padding:'14px 18px', marginBottom:'20px', display:'flex', alignItems:'center', gap:'12px', flexWrap:'wrap' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'6px', color:'var(--text-muted)', fontSize:'13px', fontWeight:'600' }}>
          <Filter size={13} /> FILTERS
        </div>
        <input placeholder="Area (e.g. Gulshan)" style={{ width:'160px' }} value={filters.area} onChange={e => setFilters(f => ({...f, area: e.target.value}))} />
        <select value={filters.type} onChange={e => setFilters(f => ({...f, type: e.target.value}))} style={{ width:'140px' }}>
          <option value="">All Types</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="plot">Plot</option>
          <option value="commercial">Commercial</option>
        </select>
        <select value={filters.status} onChange={e => setFilters(f => ({...f, status: e.target.value}))} style={{ width:'140px' }}>
          <option value="">All Status</option>
          <option value="urgent">Urgent</option>
          <option value="active">Active</option>
        </select>
        <input placeholder="Min Price (৳)" style={{ width:'140px' }} value={filters.minPrice} onChange={e => setFilters(f => ({...f, minPrice: e.target.value}))} />
        <input placeholder="Max Price (৳)" style={{ width:'140px' }} value={filters.maxPrice} onChange={e => setFilters(f => ({...f, maxPrice: e.target.value}))} />
        <button className="btn-ghost" onClick={() => setFilters({ area:'', type:'', status:'', minPrice:'', maxPrice:'' })}><RefreshCw size={12} /> Reset</button>
        <div style={{ marginLeft:'auto', display:'flex', gap:'8px', alignItems:'center' }}>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ width:'150px' }}>
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="score">Deal Score</option>
          </select>
          <button className={`btn-ghost ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')} style={{ padding:'9px' }}><Grid size={14} /></button>
          <button className={`btn-ghost ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')} style={{ padding:'9px' }}><List size={14} /></button>
          <button className="btn-primary"><Download size={13} /> Export</button>
        </div>
      </div>

      {/* Results count */}
      <div style={{ marginBottom:'16px', display:'flex', alignItems:'center', gap:'10px' }}>
        <span style={{ fontSize:'13px', color:'var(--text-muted)' }}>Showing <strong style={{ color:'var(--text-primary)' }}>{filtered.length}</strong> properties</span>
        <span className="live-dot" />
        <span style={{ fontSize:'12px', color:'var(--success)' }}>Live data</span>
      </div>

      {view === 'grid' ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:'16px' }}>
          {filtered.map(p => <PropertyCard key={p.id} property={p} onClick={() => setSelected(p)} />)}
        </div>
      ) : (
        <div className="card" style={{ overflow:'hidden' }}>
          <table>
            <thead>
              <tr>
                <th>Property</th>
                <th>Location</th>
                <th>Price</th>
                <th>Size</th>
                <th>Deal Score</th>
                <th>Risk</th>
                <th>Status</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} onClick={() => setSelected(p)} style={{ cursor:'pointer' }}>
                  <td>
                    <div style={{ fontWeight:'600', fontSize:'13px', color:'var(--text-primary)' }}>{p.title}</div>
                    <div style={{ fontSize:'11px', color:'var(--text-muted)' }}>{p.listedAt}</div>
                  </td>
                  <td style={{ fontSize:'12px', color:'var(--text-secondary)' }}>{p.location}</td>
                  <td><span style={{ fontFamily:'Syne', fontWeight:'700', color:'var(--text-primary)' }}>{formatPrice(p.price)}</span></td>
                  <td style={{ fontSize:'12px' }}>{p.sqft.toLocaleString()} sqft</td>
                  <td>
                    <span style={{ 
                      fontFamily:'Syne', fontWeight:'700', fontSize:'14px',
                      color: p.dealScore >= 80 ? 'var(--success)' : p.dealScore >= 60 ? 'var(--warning)' : 'var(--danger)'
                    }}>{p.dealScore}</span>
                  </td>
                  <td>
                    <span className={`badge ${p.riskScore === 'low' ? 'badge-green' : p.riskScore === 'medium' ? 'badge-yellow' : 'badge-red'}`}>
                      {p.riskScore.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${p.status === 'urgent' ? 'badge-orange' : 'badge-blue'}`}>{p.status.toUpperCase()}</span>
                  </td>
                  <td style={{ fontSize:'12px', color:'var(--text-muted)' }}>{p.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Property Detail Modal */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'16px', padding:'28px', maxWidth:'560px', width:'100%', maxHeight:'90vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'20px' }}>
              <h2 style={{ fontFamily:'Syne', fontSize:'18px', fontWeight:'800', flex:1 }}>{selected.title}</h2>
              <button onClick={() => setSelected(null)} style={{ background:'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius:'6px', padding:'6px', cursor:'pointer', color:'var(--text-muted)', marginLeft:'12px' }}>✕</button>
            </div>
            <div style={{ height:'160px', background:`linear-gradient(135deg, ${selected.imageColor}20, ${selected.imageColor}05)`, borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'20px', fontSize:'60px', opacity:0.6 }}>
              {selected.type === 'apartment' ? '🏢' : selected.type === 'house' ? '🏠' : selected.type === 'plot' ? '🗺️' : '🏪'}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'20px' }}>
              {[
                ['Price', formatPrice(selected.price)],
                ['Price/sqft', selected.pricePerSqft ? `৳${selected.pricePerSqft.toLocaleString()}` : 'N/A'],
                ['Area', `${selected.sqft.toLocaleString()} sqft`],
                ['Bedrooms', selected.bedrooms || 'N/A'],
                ['District', selected.district],
                ['Source', selected.source],
                ['Listed', selected.listedAt],
                ['Deal Score', selected.dealScore],
              ].map(([label, value]) => (
                <div key={String(label)} style={{ background:'var(--bg-elevated)', borderRadius:'8px', padding:'12px' }}>
                  <div style={{ fontSize:'10px', color:'var(--text-muted)', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'4px', fontFamily:'Syne' }}>{label}</div>
                  <div style={{ fontSize:'14px', fontWeight:'600', color:'var(--text-primary)', fontFamily:'Syne' }}>{value}</div>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:'10px' }}>
              <button className="btn-primary" style={{ flex:1, justifyContent:'center' }}>Contact Seller</button>
              <button className="btn-ghost" style={{ flex:1, justifyContent:'center' }}>Legal Check</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
