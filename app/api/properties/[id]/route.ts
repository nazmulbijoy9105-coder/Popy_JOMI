import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        priceHistory: { orderBy: { recordedAt: 'desc' }, take: 30 },
        legalChecks: { orderBy: { checkedAt: 'desc' }, take: 1 },
        leads: { where: { urgency: 'hot' }, take: 5 },
      },
    })
    if (!property) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: property })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const property = await prisma.property.update({
      where: { id },
      data: { isVerified: body.isVerified, legalStatus: body.legalStatus, status: body.status },
    })
    return NextResponse.json({ success: true, data: property })
  } catch (err) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
