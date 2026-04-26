// POPY Scraper Engine
// Collects property listings from Bangladesh real estate sources
// Uses: axios + cheerio (static), puppeteer-core (JS-heavy sites)

import axios from 'axios'
import * as cheerio from 'cheerio'
import { prisma } from './prisma'

export interface RawProperty {
  title: string
  price: number
  location: string
  area?: string
  sqft?: number
  bedrooms?: number
  bathrooms?: number
  type: 'apartment' | 'house' | 'plot' | 'commercial'
  sourceUrl: string
  source: string
  contactPhone?: string
  imageUrls?: string[]
  description?: string
}

// ── Bproperty scraper ──────────────────────────────────────────
export async function scrapeBproperty(page = 1): Promise<RawProperty[]> {
  const results: RawProperty[] = []
  try {
    const url = `https://www.bproperty.com/en/bangladesh/apartments-for-sale/?page=${page}`
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 15000,
    })
    const $ = cheerio.load(data)

    $('[class*="listing-card"], [class*="property-card"], article').each((_, el) => {
      const title = $(el).find('h2, h3, [class*="title"]').first().text().trim()
      const priceText = $(el).find('[class*="price"]').first().text().trim()
      const price = parsePrice(priceText)
      const location = $(el).find('[class*="location"], [class*="address"]').first().text().trim()
      const sourceUrl = $(el).find('a').first().attr('href') || ''
      const sqftText = $(el).find('[class*="area"], [class*="sqft"]').first().text().trim()
      const sqft = parseSqft(sqftText)
      const bedsText = $(el).find('[class*="bed"]').first().text().trim()
      const bedrooms = parseInt(bedsText) || 0

      if (title && price > 0) {
        results.push({
          title,
          price,
          location,
          area: extractArea(location),
          sqft,
          bedrooms,
          type: detectType(title),
          sourceUrl: sourceUrl.startsWith('http') ? sourceUrl : `https://www.bproperty.com${sourceUrl}`,
          source: 'Bproperty',
        })
      }
    })
  } catch (err) {
    console.error('Bproperty scrape error:', err)
  }
  return results
}

// ── Lamudi scraper ─────────────────────────────────────────────
export async function scrapeLamudi(page = 1): Promise<RawProperty[]> {
  const results: RawProperty[] = []
  try {
    const url = `https://www.lamudi.com.bd/buy/?page=${page}`
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      timeout: 15000,
    })
    const $ = cheerio.load(data)

    $('[class*="listing"], [class*="property"]').each((_, el) => {
      const title = $(el).find('h2, h3, [class*="title"]').first().text().trim()
      const priceText = $(el).find('[class*="price"]').first().text().trim()
      const price = parsePrice(priceText)
      const location = $(el).find('[class*="location"]').first().text().trim()
      const sourceUrl = $(el).find('a').first().attr('href') || ''

      if (title && price > 0) {
        results.push({
          title,
          price,
          location,
          area: extractArea(location),
          type: detectType(title),
          sourceUrl: sourceUrl.startsWith('http') ? sourceUrl : `https://www.lamudi.com.bd${sourceUrl}`,
          source: 'Lamudi',
        })
      }
    })
  } catch (err) {
    console.error('Lamudi scrape error:', err)
  }
  return results
}

// ── Deal scorer ────────────────────────────────────────────────
export function calculateDealScore(property: RawProperty, areaAvgPrice: number): number {
  let score = 50
  if (property.price > 0 && areaAvgPrice > 0) {
    const ratio = property.price / areaAvgPrice
    if (ratio < 0.7) score += 40
    else if (ratio < 0.85) score += 25
    else if (ratio < 0.95) score += 10
    else if (ratio > 1.2) score -= 15
  }
  if (property.sqft && property.sqft > 0 && property.price > 0) score += 5
  if (property.bedrooms && property.bedrooms >= 2) score += 5
  if (property.type === 'apartment') score += 5
  const urgentKeywords = ['urgent', 'quick sale', 'আর্জেন্ট', 'emergency', 'motivated']
  if (urgentKeywords.some(k => property.title.toLowerCase().includes(k))) score += 15
  return Math.min(100, Math.max(0, score))
}

export function detectUrgent(title: string, description?: string): boolean {
  const text = `${title} ${description || ''}`.toLowerCase()
  return ['urgent', 'quick sale', 'আর্জেন্ট', 'emergency', 'must sell', 'immediate'].some(k => text.includes(k))
}

// ── Deduplication ──────────────────────────────────────────────
export async function checkDuplicate(sourceUrl: string): Promise<boolean> {
  const existing = await prisma.property.findFirst({ where: { sourceUrl } })
  return !!existing
}

// ── Save to DB ─────────────────────────────────────────────────
export async function saveProperty(raw: RawProperty, jobId: string, areaAvgPrice = 0) {
  const isDupe = await checkDuplicate(raw.sourceUrl)
  if (isDupe) return { saved: false, reason: 'duplicate' }

  const dealScore = calculateDealScore(raw, areaAvgPrice)
  const isUrgent = detectUrgent(raw.title, raw.description)

  const property = await prisma.property.create({
    data: {
      title: raw.title,
      price: raw.price,
      location: raw.location,
      area: raw.area || 'Unknown',
      sqft: raw.sqft,
      bedrooms: raw.bedrooms || 0,
      type: raw.type,
      status: isUrgent ? 'urgent' : 'active',
      source: raw.source,
      sourceUrl: raw.sourceUrl,
      contactPhone: raw.contactPhone,
      imageUrls: raw.imageUrls || [],
      description: raw.description,
      dealScore,
      isUrgent,
      scrapeJobId: jobId,
    },
  })

  await prisma.priceHistory.create({
    data: { propertyId: property.id, price: raw.price }
  })

  return { saved: true, propertyId: property.id }
}

// ── Helpers ────────────────────────────────────────────────────
export function parsePrice(text: string): number {
  if (!text) return 0
  const clean = text.replace(/[,\s]/g, '').replace('৳', '').toLowerCase()
  const crMatch = clean.match(/([\d.]+)\s*cr/)
  if (crMatch) return Math.round(parseFloat(crMatch[1]) * 10000000)
  const lakhMatch = clean.match(/([\d.]+)\s*l/)
  if (lakhMatch) return Math.round(parseFloat(lakhMatch[1]) * 100000)
  const num = parseFloat(clean.replace(/[^\d.]/g, ''))
  return isNaN(num) ? 0 : Math.round(num)
}

export function parseSqft(text: string): number | undefined {
  if (!text) return undefined
  const match = text.replace(/,/g, '').match(/([\d.]+)\s*(sqft|sq\.ft|sf)/i)
  return match ? Math.round(parseFloat(match[1])) : undefined
}

export function extractArea(location: string): string {
  const knownAreas = ['Gulshan', 'Banani', 'Dhanmondi', 'Mirpur', 'Uttara', 'Bashundhara', 'Rampura', 'Mohakhali', 'Tejgaon', 'Motijheel', 'Wari', 'Lalbagh', 'Khilgaon', 'Badda']
  for (const area of knownAreas) {
    if (location.toLowerCase().includes(area.toLowerCase())) return area
  }
  return location.split(',')[0]?.trim() || 'Unknown'
}

export function detectType(title: string): RawProperty['type'] {
  const t = title.toLowerCase()
  if (t.includes('plot') || t.includes('land') || t.includes('katha') || t.includes('bigha')) return 'plot'
  if (t.includes('shop') || t.includes('office') || t.includes('commercial') || t.includes('showroom')) return 'commercial'
  if (t.includes('house') || t.includes('bungalow') || t.includes('villa') || t.includes('duplex')) return 'house'
  return 'apartment'
}
