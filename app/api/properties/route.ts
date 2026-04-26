import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getTokenFromHeader, verifyToken } from '@/lib/auth'

const querySchema = z.object({
  area: z.string().optional(),
  type: z.enum(['apartment', 'house', 'plot', 'commercial']).optional(),
  status: z.enum(['active', 'urgent', 'sold', 'pending']).optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  minBeds: z.coerce.number().optional(),
  sort: z.enum(['newest', 'price_asc', 'price_desc', 'score']).optional().default('newest'),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().max(100).optional().default(20),
})

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const params = querySchema.parse(Object.fromEntries(searchParams))
    const skip = (params.page - 1) * params.limit

    const where: any = { isDuplicate: false }
    if (params.area) where.area = { contains: params.area, mode: 'insensitive' }
    if (params.type) where.type = params.type
    if (params.status) where.status = params.status
    if (params.minPrice || params.maxPrice) {
      where.price = {}
      if (params.minPrice) where.price.gte = params.minPrice
      if (params.maxPrice) where.price.lte = params.maxPrice
    }
    if (params.minBeds) where.bedrooms = { gte: params.minBeds }

    const orderBy: any =
      params.sort === 'price_asc' ? { price: 'asc' }
      : params.sort === 'price_desc' ? { price: 'desc' }
      : params.sort === 'score' ? { dealScore: 'desc' }
      : { scrapedAt: 'desc' }

    const [properties, total] = await Promise.all([
      prisma.property.findMany({ where, orderBy, skip, take: params.limit,
        select: {
          id: true, title: true, price: true, pricePerSqft: true, location: true,
          area: true, district: true, sqft: true, bedrooms: true, bathrooms: true,
          type: true, status: true, source: true, dealScore: true, riskScore: true,
          priceChangePct: true, isVerified: true, isUrgent: true, legalStatus: true,
          imageUrls: true, scrapedAt: true, lat: true, lng: true,
        }
      }),
      prisma.property.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: properties,
      meta: { total, page: params.page, limit: params.limit, pages: Math.ceil(total / params.limit) },
    })
  } catch (err: any) {
    if (err.name === 'ZodError') return NextResponse.json({ error: 'Invalid query params' }, { status: 400 })
    console.error('Properties GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 })
  }
}
