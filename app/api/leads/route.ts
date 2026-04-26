import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getTokenFromHeader, verifyToken } from '@/lib/auth'
import { scoreLeadUrgency } from '@/lib/ai'

const createSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email().optional(),
  type: z.enum(['seller', 'buyer']),
  area: z.string().optional(),
  budget: z.number().optional(),
  propertyId: z.string().optional(),
  notes: z.string().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromHeader(req.headers.get('authorization'))
    const payload = token ? verifyToken(token) : null
    const { searchParams } = new URL(req.url)
    const urgency = searchParams.get('urgency')
    const type = searchParams.get('type')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = {}
    if (urgency) where.urgency = urgency
    if (type) where.type = type
    if (payload) where.assignedTo = payload.userId

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where, skip: (page - 1) * limit, take: limit,
        orderBy: [{ urgency: 'asc' }, { score: 'desc' }],
        include: { property: { select: { title: true, area: true, price: true } } },
      }),
      prisma.lead.count({ where }),
    ])

    return NextResponse.json({ success: true, data: leads, meta: { total, page, limit } })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromHeader(req.headers.get('authorization'))
    const payload = token ? verifyToken(token) : null
    const body = await req.json()
    const data = createSchema.parse(body)

    const { score, urgency } = scoreLeadUrgency({
      hasPhone: !!data.phone,
      message: data.notes,
      priceBelow: false,
      listedRecently: true,
    })

    const lead = await prisma.lead.create({
      data: {
        ...data,
        budget: data.budget ? BigInt(data.budget) : null,
        score,
        urgency,
        assignedTo: payload?.userId,
      },
    })

    return NextResponse.json({ success: true, data: lead }, { status: 201 })
  } catch (err: any) {
    if (err.name === 'ZodError') return NextResponse.json({ error: err.errors }, { status: 400 })
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 })
  }
}
