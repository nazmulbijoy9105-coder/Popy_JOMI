import { NextRequest, NextResponse } from 'next/server'
import { getTokenFromHeader, verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Google Sheets export via Apps Script webhook
export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromHeader(req.headers.get('authorization'))
    const payload = token ? verifyToken(token) : null
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { sheetUrl, filters } = await req.json()

    const properties = await prisma.property.findMany({
      where: { isDuplicate: false, status: { not: 'sold' } },
      orderBy: { dealScore: 'desc' },
      take: 500,
      select: {
        title: true, price: true, pricePerSqft: true, location: true,
        area: true, sqft: true, bedrooms: true, type: true, status: true,
        source: true, dealScore: true, riskScore: true, sourceUrl: true, scrapedAt: true,
      },
    })

    // Format for Google Sheets
    const rows = properties.map((p: any) => ({
      Title: p.title,
      'Price (BDT)': Number(p.price),
      'Price/sqft': p.pricePerSqft || '',
      Location: p.location,
      Area: p.area || '',
      'Sqft': p.sqft || '',
      Beds: p.bedrooms,
      Type: p.type,
      Status: p.status,
      Source: p.source,
      'Deal Score': p.dealScore,
      'Risk': p.riskScore,
      URL: p.sourceUrl || '',
      'Listed At': p.scrapedAt.toISOString(),
    }))

    // If sheetUrl provided — post to Google Sheets webhook (Apps Script)
    if (sheetUrl) {
      try {
        await fetch(sheetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rows }),
        })
      } catch {}
    }

    return NextResponse.json({
      success: true,
      data: rows,
      meta: { count: rows.length, exportedAt: new Date() },
    })
  } catch (err) {
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}
