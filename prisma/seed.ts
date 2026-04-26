// POPY Database Seed — populates demo data
// Run: npx ts-node prisma/seed.ts OR npx prisma db seed

// Prisma imported via lib/prisma.ts
import bcrypt from 'bcryptjs'

import { prisma } from "../lib/prisma"

async function main() {
  console.log('🌱 Seeding POPY database...')

  // Admin user
  const adminHash = await bcrypt.hash('admin1234', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@popy.bd' },
    update: {},
    create: { email: 'admin@popy.bd', name: 'POPY Admin', password: adminHash, role: 'admin', plan: 'enterprise' },
  })

  // Demo agent
  const agentHash = await bcrypt.hash('demo1234', 12)
  const agent = await prisma.user.upsert({
    where: { email: 'demo@popy.bd' },
    update: {},
    create: { email: 'demo@popy.bd', name: 'Demo Agent', password: agentHash, role: 'agent', plan: 'agent' },
  })

  // Demo investor
  const investor = await prisma.user.upsert({
    where: { email: 'investor@popy.bd' },
    update: {},
    create: { email: 'investor@popy.bd', name: 'Demo Investor', password: await bcrypt.hash('invest123', 12), role: 'investor', plan: 'investor' },
  })

  // Scraper job
  const job = await prisma.scraperJob.create({
    data: { source: 'seed', status: 'done', listingsFound: 8, listingsNew: 8, startedAt: new Date(), completedAt: new Date() }
  })

  // Sample properties
  const props = [
    { title:'Modern 3BHK Apartment, Gulshan 2', price:12500000n, pricePerSqft:8928, location:'Gulshan 2, Dhaka', area:'Gulshan', district:'Dhaka', sqft:1400, bedrooms:3, bathrooms:2, type:'apartment' as const, status:'urgent' as const, source:'Bproperty', sourceUrl:'https://www.bproperty.com/listing/1', dealScore:92, riskScore:'low' as const, isVerified:true, legalStatus:'clean' as const, isUrgent:true, priceChangePct:-8 },
    { title:'Corner Plot 5 Katha, Bashundhara RA', price:22000000n, pricePerSqft:0, location:'Block-F, Bashundhara R/A', area:'Bashundhara', district:'Dhaka', sqft:3600, bedrooms:0, bathrooms:0, type:'plot' as const, status:'active' as const, source:'Lamudi', sourceUrl:'https://www.lamudi.com.bd/listing/2', dealScore:78, riskScore:'medium' as const, legalStatus:'pending' as const },
    { title:'Duplex House 4BHK, Dhanmondi 27', price:35000000n, pricePerSqft:11666, location:'Road 27, Dhanmondi', area:'Dhanmondi', district:'Dhaka', sqft:3000, bedrooms:4, bathrooms:3, type:'house' as const, status:'active' as const, source:'Bproperty', dealScore:65, riskScore:'low' as const, isVerified:true, legalStatus:'clean' as const },
    { title:'2BHK Ready Flat, Mirpur DOHS', price:7800000n, pricePerSqft:7090, location:'Mirpur DOHS, Dhaka', area:'Mirpur', district:'Dhaka', sqft:1100, bedrooms:2, bathrooms:2, type:'apartment' as const, status:'urgent' as const, source:'Bproperty', dealScore:88, riskScore:'low' as const, isVerified:true, legalStatus:'clean' as const, isUrgent:true, priceChangePct:-12 },
    { title:'Commercial Space G/F, Uttara Sector 4', price:18000000n, pricePerSqft:12000, location:'Sector 4, Uttara', area:'Uttara', district:'Dhaka', sqft:1500, bedrooms:0, bathrooms:2, type:'commercial' as const, status:'active' as const, source:'Lamudi', dealScore:71, riskScore:'medium' as const, legalStatus:'pending' as const },
    { title:'4BHK Penthouse, Banani 11', price:48000000n, pricePerSqft:16000, location:'Road 11, Banani', area:'Banani', district:'Dhaka', sqft:3000, bedrooms:4, bathrooms:4, type:'apartment' as const, status:'active' as const, source:'Bproperty', dealScore:82, riskScore:'low' as const, isVerified:true, legalStatus:'clean' as const, priceChangePct:5 },
    { title:'Ready Flat 2BHK, Rampura', price:5200000n, pricePerSqft:6500, location:'East Rampura, Dhaka', area:'Rampura', district:'Dhaka', sqft:800, bedrooms:2, bathrooms:1, type:'apartment' as const, status:'urgent' as const, source:'Facebook', dealScore:90, riskScore:'low' as const, isUrgent:true, priceChangePct:-15 },
    { title:'3 Katha Plot, Narayanganj', price:4500000n, location:'Fatullah, Narayanganj', area:'Fatullah', district:'Narayanganj', sqft:2160, bedrooms:0, bathrooms:0, type:'plot' as const, status:'active' as const, source:'Facebook', dealScore:55, riskScore:'high' as const, legalStatus:'disputed' as const },
  ]

  for (const p of props) {
    const prop = await prisma.property.create({ data: { ...p, scrapeJobId: job.id } })
    await prisma.priceHistory.create({ data: { propertyId: prop.id, price: p.price } })
  }

  // Alert rules for demo user
  await prisma.alertRule.createMany({
    data: [
      { userId: agent.id, type: 'urgent_sale', isActive: true },
      { userId: agent.id, type: 'new_listing', area: 'Gulshan', isActive: true },
      { userId: agent.id, type: 'price_drop', isActive: true },
    ],
    skipDuplicates: true,
  })

  // Sample alerts
  await prisma.alert.createMany({
    data: [
      { userId: agent.id, type: 'urgent_sale', title:'⚡ Urgent Sale — Rampura', body:'2BHK flat 15% below market. Act fast!', priority:'high' },
      { userId: agent.id, type: 'price_drop', title:'Price Drop — Gulshan 2', body:'Apartment dropped ৳1.2M. Now ৳12.5M', priority:'high' },
      { userId: agent.id, type: 'new_listing', title:'7 New Listings in Bashundhara', body:'New properties match your saved filter', priority:'medium' },
      { userId: agent.id, type: 'lead', title:'New Hot Lead', body:'Seller: Rafiqul Islam, Gulshan 2 flat', priority:'high', read: false },
    ],
  })

  // Area stats
  await prisma.areaStat.createMany({
    data: [
      { area:'Gulshan', avgPrice:125000000, avgPricePerSqft:10800, totalListings:342, demandScore:92, growthPct:8.2 },
      { area:'Dhanmondi', avgPrice:95000000, avgPricePerSqft:8700, totalListings:287, demandScore:85, growthPct:6.1 },
      { area:'Banani', avgPrice:140000000, avgPricePerSqft:12400, totalListings:198, demandScore:78, growthPct:5.8 },
      { area:'Uttara', avgPrice:80000000, avgPricePerSqft:7200, totalListings:456, demandScore:88, growthPct:9.4 },
      { area:'Bashundhara', avgPrice:85000000, avgPricePerSqft:7500, totalListings:523, demandScore:91, growthPct:11.2 },
      { area:'Mirpur', avgPrice:65000000, avgPricePerSqft:6000, totalListings:612, demandScore:82, growthPct:7.3 },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Seeding complete!')
  console.log('👤 Demo login: demo@popy.bd / demo1234')
  console.log('👑 Admin login: admin@popy.bd / admin1234')
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
