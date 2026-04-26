// POPY Analytics Engine — real calculations from DB
import { prisma } from './prisma'

export async function getAreaStats() {
  try {
    const areas = await prisma.property.groupBy({
      by: ['area'],
      where: { status: { not: 'sold' }, isDuplicate: false },
      _avg: { price: true, pricePerSqft: true, dealScore: true },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 20,
    })
    return areas.map((a: any) => ({
      area: a.area || 'Unknown',
      avgPrice: Number(a._avg.price || 0),
      avgPricePerSqft: Math.round(a._avg.pricePerSqft || 0),
      totalListings: a._count.id,
      avgDealScore: Math.round(a._avg.dealScore || 0),
    }))
  } catch {
    return []
  }
}

export async function getPriceTrends(area?: string, days = 180) {
  try {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    const history = await prisma.priceHistory.findMany({
      where: {
        recordedAt: { gte: since },
        property: area ? { area } : undefined,
      },
      orderBy: { recordedAt: 'asc' },
      include: { property: { select: { area: true, pricePerSqft: true } } },
    })
    return history
  } catch {
    return []
  }
}

export async function getDashboardKPIs() {
  try {
    const [total, urgent, hotLeads, avgScore, recentCount] = await Promise.all([
      prisma.property.count({ where: { isDuplicate: false, status: { not: 'sold' } } }),
      prisma.property.count({ where: { status: 'urgent', isDuplicate: false } }),
      prisma.lead.count({ where: { urgency: 'hot' } }),
      prisma.property.aggregate({ _avg: { dealScore: true }, where: { isDuplicate: false } }),
      prisma.property.count({ where: { scrapedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, isDuplicate: false } }),
    ])
    return {
      totalListings: total,
      urgentListings: urgent,
      hotLeads,
      avgDealScore: Math.round(avgScore._avg.dealScore || 0),
      newToday: recentCount,
    }
  } catch {
    return { totalListings: 0, urgentListings: 0, hotLeads: 0, avgDealScore: 0, newToday: 0 }
  }
}

export async function getMarketIndex() {
  try {
    const recent = await prisma.property.findMany({
      where: { isDuplicate: false, pricePerSqft: { gt: 0 } },
      select: { pricePerSqft: true, area: true },
      orderBy: { scrapedAt: 'desc' },
      take: 500,
    })
    const avgPPSF = recent.reduce((s: number, p: any) => s + (p.pricePerSqft || 0), 0) / (recent.length || 1)
    return { avgPricePerSqft: Math.round(avgPPSF), sampleSize: recent.length }
  } catch {
    return { avgPricePerSqft: 0, sampleSize: 0 }
  }
}
