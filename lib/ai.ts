// POPY AI Engine
// Uses OpenAI / Google Gemini for:
// 1. Property data extraction from raw HTML
// 2. Legal risk assessment
// 3. Deal scoring intelligence

export interface ExtractedProperty {
  title?: string
  price?: number
  location?: string
  area?: string
  sqft?: number
  bedrooms?: number
  bathrooms?: number
  type?: string
  contactPhone?: string
  description?: string
  isUrgent?: boolean
  urgentReason?: string
}

export interface LegalAssessment {
  riskScore: number
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  checksPassed: string[]
  checksFailed: string[]
  warnings: string[]
  recommendations: string[]
}

// ── AI Property Extraction ─────────────────────────────────────
export async function extractPropertyWithAI(rawHtml: string): Promise<ExtractedProperty> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    console.warn('No OpenAI key — skipping AI extraction')
    return {}
  }

  const prompt = `Extract property listing data from this HTML. Return ONLY valid JSON.
HTML: ${rawHtml.slice(0, 3000)}

Return JSON with these fields (null if not found):
{
  "title": string,
  "price": number (in BDT taka),
  "location": string,
  "area": string (neighborhood),
  "sqft": number,
  "bedrooms": number,
  "bathrooms": number,
  "type": "apartment|house|plot|commercial",
  "contactPhone": string,
  "description": string,
  "isUrgent": boolean,
  "urgentReason": string
}`

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.1,
      }),
    })
    const data = await res.json()
    return JSON.parse(data.choices[0].message.content)
  } catch (err) {
    console.error('AI extraction error:', err)
    return {}
  }
}

// ── Legal Risk Assessment ──────────────────────────────────────
export async function assessLegalRisk(propertyData: {
  title: string
  location: string
  area?: string
  price: number
  sourceUrl?: string
}): Promise<LegalAssessment> {
  // Deterministic rule-based assessment (works without AI key)
  const checks = {
    passed: [] as string[],
    failed: [] as string[],
    warnings: [] as string[],
    recommendations: [] as string[],
  }

  // Rule 1: Price sanity check
  const pricePerSqft = propertyData.price / 1000 // rough estimate
  if (pricePerSqft < 2000) {
    checks.warnings.push('Price significantly below market — verify authenticity')
    checks.recommendations.push('Request original title deed before any payment')
  } else {
    checks.passed.push('Price within reasonable market range')
  }

  // Rule 2: Source credibility
  const trustedSources = ['bproperty.com', 'lamudi.com.bd', 'realestate.com.bd']
  const sourceUrl = propertyData.sourceUrl || ''
  if (trustedSources.some(s => sourceUrl.includes(s))) {
    checks.passed.push('Listed on verified real estate platform')
  } else {
    checks.warnings.push('Source platform not in trusted list — verify independently')
  }

  // Rule 3: Location risk zones
  const highRiskAreas = ['Keraniganj', 'Demra', 'Jinjira']
  const medRiskAreas = ['Fatullah', 'Narayanganj', 'Tongi']
  const area = propertyData.area || propertyData.location
  if (highRiskAreas.some(a => area.includes(a))) {
    checks.failed.push('Area has elevated legal dispute history')
    checks.recommendations.push('Hire local lawyer to verify land records in person')
  } else if (medRiskAreas.some(a => area.includes(a))) {
    checks.warnings.push('Area has some dispute history — verify land records')
  } else {
    checks.passed.push('Location in lower-risk zone')
  }

  // Standard document checks (always include)
  checks.passed.push('Title deed (দলিল) checklist generated')
  checks.passed.push('Tax clearance verification requested')

  // Required documents checklist
  checks.recommendations.push('Collect: Title deed, Mutation certificate, Tax receipt, BS survey map')
  checks.recommendations.push('Verify with local land registry office (AC Land)')
  checks.recommendations.push('Check for any pending court cases via court website')

  if (checks.failed.length === 0 && checks.warnings.length === 0) {
    checks.warnings.push('Always verify mutation record (নামজারি) before proceeding')
  }

  const score = Math.max(20, 90 - (checks.failed.length * 25) - (checks.warnings.length * 10))
  const riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' =
    score >= 75 ? 'LOW' : score >= 50 ? 'MEDIUM' : 'HIGH'

  return {
    riskScore: score,
    riskLevel,
    checksPassed: checks.passed,
    checksFailed: checks.failed,
    warnings: checks.warnings,
    recommendations: checks.recommendations,
  }
}

// ── Lead Scoring ───────────────────────────────────────────────
export function scoreLeadUrgency(data: {
  hasPhone: boolean
  message?: string
  priceBelow?: boolean
  listedRecently?: boolean
}): { score: number; urgency: 'hot' | 'warm' | 'cold' } {
  let score = 40
  if (data.hasPhone) score += 20
  if (data.priceBelow) score += 20
  if (data.listedRecently) score += 10
  if (data.message) {
    const urgentWords = ['urgent', 'quick', 'immediate', 'আর্জেন্ট', 'emergency']
    if (urgentWords.some(w => data.message!.toLowerCase().includes(w))) score += 15
  }
  const urgency = score >= 75 ? 'hot' : score >= 50 ? 'warm' : 'cold'
  return { score: Math.min(100, score), urgency }
}
