import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getTokenFromHeader, verifyToken } from '@/lib/auth'
import { assessLegalRisk } from '@/lib/ai'

const schema = z.object({
  propertyId: z.string().optional(),
  title: z.string().optional(),
  location: z.string(),
  area: z.string().optional(),
  price: z.number(),
  sourceUrl: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromHeader(req.headers.get('authorization'))
    const payload = token ? verifyToken(token) : null
    const body = await req.json()
    const data = schema.parse(body)

    let property = data.propertyId
      ? await prisma.property.findUnique({ where: { id: data.propertyId } })
      : null

    const assessment = await assessLegalRisk({
      title: property?.title || data.title || 'Unknown Property',
      location: property?.location || data.location,
      area: property?.area || data.area,
      price: Number(property?.price || data.price),
      sourceUrl: property?.sourceUrl || data.sourceUrl,
    })

    // Save to DB if user is authenticated and propertyId given
    if (payload && data.propertyId) {
      await prisma.legalCheck.create({
        data: {
          propertyId: data.propertyId,
          userId: payload.userId,
          riskScore: assessment.riskScore,
          riskLevel: assessment.riskLevel,
          checksPassed: assessment.checksPassed,
          checksFailed: assessment.checksFailed,
          warnings: assessment.warnings,
          reportData: assessment as any,
        },
      })

      // Update property risk score
      await prisma.property.update({
        where: { id: data.propertyId },
        data: {
          riskScore: assessment.riskLevel === 'LOW' ? 'low' : assessment.riskLevel === 'MEDIUM' ? 'medium' : 'high',
          legalStatus: assessment.checksFailed.length === 0 ? 'clean' : assessment.riskLevel === 'HIGH' ? 'disputed' : 'pending',
        },
      })
    }

    return NextResponse.json({ success: true, data: assessment })
  } catch (err: any) {
    if (err.name === 'ZodError') return NextResponse.json({ error: err.errors }, { status: 400 })
    console.error('Legal check error:', err)
    return NextResponse.json({ error: 'Legal check failed' }, { status: 500 })
  }
}
