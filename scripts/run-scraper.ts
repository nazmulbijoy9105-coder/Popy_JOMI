// Run scraper manually: npm run scraper:run
import { scrapeBproperty, scrapeLamudi, saveProperty } from '../lib/scraper'
import { prisma } from '../lib/prisma'

async function main() {
  console.log('🕷️ POPY Scraper Starting...')

  const job = await prisma.scraperJob.create({
    data: { source: 'manual', status: 'running', startedAt: new Date() }
  })

  let total = 0, newCount = 0, dupeCount = 0

  for (let page = 1; page <= 3; page++) {
    console.log(`Scraping page ${page}...`)
    const [bpProps, lamudiProps] = await Promise.all([
      scrapeBproperty(page),
      scrapeLamudi(page),
    ])

    const allProps = [...bpProps, ...lamudiProps]
    console.log(`  Found ${allProps.length} listings`)

    for (const prop of allProps) {
      total++
      const result = await saveProperty(prop, job.id)
      if (result.saved) { newCount++; console.log(`  ✓ Saved: ${prop.title}`) }
      else { dupeCount++; }
    }

    await new Promise(r => setTimeout(r, 2500))
  }

  await prisma.scraperJob.update({
    where: { id: job.id },
    data: { status: 'done', listingsFound: total, listingsNew: newCount, listingsDupe: dupeCount, completedAt: new Date() }
  })

  console.log(`\n✅ Scraper done! Found: ${total}, New: ${newCount}, Dupes: ${dupeCount}`)
  await prisma.$disconnect()
}

main().catch(async e => { console.error(e); await prisma.$disconnect(); process.exit(1) })
