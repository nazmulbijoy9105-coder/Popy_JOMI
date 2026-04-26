import { NextResponse } from 'next/server'
import { getDashboardKPIs, getMarketIndex } from '@/lib/analytics'
import { PROPERTIES, LEADS, ALERTS, AREA_STATS } from '@/lib/data'

export async function GET() {
  try {
    // Try real DB first, fall back to mock data
    const [kpis, market] = await Promise.all([
      getDashboardKPIs().catch(() => null),
      getMarketIndex().catch(() => null),
    ])

    if (kpis && kpis.totalListings > 0) {
      return NextResponse.json({ success: true, data: { ...kpis, ...market, source: 'db' } })
    }

    // Fallback to mock data
    return NextResponse.json({
      success: true,
      data: {
        totalListings: 2847,
        urgentListings: PROPERTIES.filter(p => p.status === 'urgent').length,
        hotLeads: LEADS.filter(l => l.urgency === 'hot').length,
        avgDealScore: 78,
        newToday: 124,
        avgPricePerSqft: 8240,
        source: 'mock',
      }
    })
  } catch {
    return NextResponse.json({ error: 'Failed to get KPIs' }, { status: 500 })
  }
}
