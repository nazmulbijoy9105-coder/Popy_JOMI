import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getTokenFromHeader, verifyToken } from '@/lib/auth'
import { scrapeBproperty, scrapeLamudi, saveProperty } from '@/lib/scraper'

const schema = z.object({
  source: z.enum(['bproperty', 'lamudi', 'all']).default('all'),
  pages: z.number().min(1).max(20).default(3),
})

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromHeader(req.headers.get('authorization'))
    const payload = token ? verifyToken(token) : null
    if (!payload || !['admin', 'developer'].includes(payload.role)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await req.json()
    const { source, pages } = schema.parse(body)

    // Create scraper job
    const job = await prisma.scraperJob.create({
      data: { source, status: 'running', startedAt: new Date() }
    })

    // Run scraper asynchronously (don't await — return job ID immediately)
    runScraper(job.id, source, pages).catch(console.error)

    return NextResponse.json({
      success: true,
      data: { jobId: job.id, status: 'running', message: `Scraping ${source} — ${pages} pages` }
    })
  } catch (err: any) {
    if (err.name === 'ZodError') return NextResponse.json({ error: err.errors }, { status: 400 })
    return NextResponse.json({ error: 'Failed to start scraper' }, { status: 500 })
  }
}

async function runScraper(jobId: string, source: string, pages: number) {
  let total = 0, newCount = 0

  try {
    for (let p = 1; p <= pages; p++) {
      let properties = []
      if (source === 'bproperty' || source === 'all') {
        properties.push(...await scrapeBproperty(p))
      }
      if (source === 'lamudi' || source === 'all') {
        properties.push(...await scrapeLamudi(p))
      }

      for (const prop of properties) {
        total++
        const result = await saveProperty(prop, jobId)
        if (result.saved) newCount++
      }

      // Rate limiting between pages
      await new Promise(r => setTimeout(r, 2000))
    }

    await prisma.scraperJob.update({
      where: { id: jobId },
      data: { status: 'done', listingsFound: total, listingsNew: newCount, listingsDupe: total - newCount, completedAt: new Date() }
    })
  } catch (err: any) {
    await prisma.scraperJob.update({
      where: { id: jobId },
      data: { status: 'failed', errorMessage: err.message, completedAt: new Date() }
    })
  }
}
