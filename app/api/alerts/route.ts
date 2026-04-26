import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTokenFromHeader, verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromHeader(req.headers.get('authorization'))
    const payload = token ? verifyToken(token) : null
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const unreadOnly = new URL(req.url).searchParams.get('unread') === 'true'
    const where: any = { userId: payload.userId }
    if (unreadOnly) where.read = false

    const [alerts, unreadCount] = await Promise.all([
      prisma.alert.findMany({ where, orderBy: { createdAt: 'desc' }, take: 50 }),
      prisma.alert.count({ where: { userId: payload.userId, read: false } }),
    ])

    return NextResponse.json({ success: true, data: alerts, meta: { unreadCount } })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = getTokenFromHeader(req.headers.get('authorization'))
    const payload = token ? verifyToken(token) : null
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { markAllRead } = await req.json()
    if (markAllRead) {
      await prisma.alert.updateMany({ where: { userId: payload.userId }, data: { read: true } })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update alerts' }, { status: 500 })
  }
}
