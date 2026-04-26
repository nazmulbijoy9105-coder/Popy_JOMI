// Cron scheduler — run with: npx ts-node scripts/scheduler.ts
// Handles: automatic scraping every 6 hours, area stats updates
import cron from 'node-cron'
import { scrapeBproperty, scrapeLamudi, saveProperty } from '../lib/scraper'
import { prisma } from '../lib/prisma'
import { processAlertRules } from '../lib/notifications'

console.log('⏰ POPY Scheduler started')

// Every 6 hours — scrape fresh listings
cron.schedule('0 */6 * * *', async () => {
  console.log('🕷️ Auto-scrape triggered:', new Date().toISOString())
  const job = await prisma.scraperJob.create({
    data: { source: 'auto', status: 'running', startedAt: new Date() }
  })

  let total = 0, newCount = 0
  for (let page = 1; page <= 5; page++) {
    const props = [...await scrapeBproperty(page), ...await scrapeLamudi(page)]
    for (const prop of props) {
      total++
      const result = await saveProperty(prop, job.id)
      if (result.saved) {
        newCount++
        if (result.propertyId) {
          await processAlertRules(result.propertyId).catch(console.error)
        }
      }
    }
    await new Promise(r => setTimeout(r, 3000))
  }

  await prisma.scraperJob.update({
    where: { id: job.id },
    data: { status: 'done', listingsFound: total, listingsNew: newCount, completedAt: new Date() }
  })
  console.log(`✅ Auto-scrape done: ${newCount} new listings`)
})

// Every day at midnight — update area stats
cron.schedule('0 0 * * *', async () => {
  console.log('📊 Updating area stats...')
  const areas = await prisma.property.groupBy({
    by: ['area'],
    where: { status: { not: 'sold' }, isDuplicate: false },
    _avg: { price: true, pricePerSqft: true },
    _count: { id: true },
  })

  for (const a of areas) {
    if (!a.area) continue
    await prisma.areaStat.upsert({
      where: { area: a.area },
      create: { area: a.area, avgPrice: Number(a._avg.price || 0), avgPricePerSqft: Math.round(a._avg.pricePerSqft || 0), totalListings: a._count.id },
      update: { avgPrice: Number(a._avg.price || 0), avgPricePerSqft: Math.round(a._avg.pricePerSqft || 0), totalListings: a._count.id },
    })
  }
  console.log(`✅ Area stats updated for ${areas.length} areas`)
})

console.log('⏰ Cron jobs registered. Running...')
