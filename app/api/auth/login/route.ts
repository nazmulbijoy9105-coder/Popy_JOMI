import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyPassword, signToken, createSession } from '@/lib/auth'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = schema.parse(body)

    let user: any
    try {
      user = await prisma.user.findUnique({ where: { email } })
    } catch {
      return NextResponse.json({ error: 'Database unavailable. Please add DATABASE_URL in environment variables.' }, { status: 503 })
    }

    if (!user || !user.password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const valid = await verifyPassword(password, user.password)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role, plan: user.plan })
    await createSession(user.id, token)

    return NextResponse.json({
      success: true,
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, plan: user.plan },
    })
  } catch (err: any) {
    if (err.name === 'ZodError') return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
