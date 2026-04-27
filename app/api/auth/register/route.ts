import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { hashPassword, signToken, createSession } from '@/lib/auth'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  role: z.enum(['agent', 'investor', 'developer', 'buyer']).optional().default('agent'),
  phone: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    let existing: any
    try {
      existing = await prisma.user.findUnique({ where: { email: data.email } })
    } catch {
      return NextResponse.json({ error: 'Database unavailable. Please add DATABASE_URL in environment variables.' }, { status: 503 })
    }
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const hashed = await hashPassword(data.password)
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashed,
        name: data.name,
        role: data.role as any,
        phone: data.phone,
      },
    })

    const token = signToken({ userId: user.id, email: user.email, role: user.role, plan: user.plan })
    await createSession(user.id, token)

    // Default alert rules for new users
    await prisma.alertRule.createMany({
      data: [
        { userId: user.id, type: 'urgent_sale', isActive: true },
        { userId: user.id, type: 'new_listing', isActive: true },
      ],
    })

    return NextResponse.json({
      success: true,
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, plan: user.plan },
    }, { status: 201 })
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed', details: err.errors }, { status: 400 })
    }
    console.error('Register error:', err)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
