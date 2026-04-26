import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const jobId = searchParams.get('jobId')

    if (jobId) {
      const job = await prisma.scraperJob.findUnique({ where: { id: jobId } })
      return NextResponse.json({ success: true, data: job })
    }

    const jobs = await prisma.scraperJob.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    })
    return NextResponse.json({ success: true, data: jobs })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to get scraper status' }, { status: 500 })
  }
}
