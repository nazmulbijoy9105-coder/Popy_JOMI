import { NextResponse } from 'next/server'
import { getAreaStats } from '@/lib/analytics'
import { AREA_STATS } from '@/lib/data'

export async function GET() {
  try {
    const dbStats = await getAreaStats().catch(() => [])

    if (dbStats.length > 0) {
      return NextResponse.json({ success: true, data: dbStats, source: 'db' })
    }

    return NextResponse.json({ success: true, data: AREA_STATS, source: 'mock' })
  } catch {
    return NextResponse.json({ error: 'Failed to get area stats' }, { status: 500 })
  }
}
