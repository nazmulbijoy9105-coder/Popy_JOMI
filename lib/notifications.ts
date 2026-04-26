// POPY Notification Engine
// Sends: Email (Nodemailer) + real-time WebSocket alerts

import nodemailer from 'nodemailer'
import { prisma } from './prisma'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendEmailAlert(to: string, subject: string, html: string) {
  if (!process.env.SMTP_USER) {
    console.log('Email not configured — skipping:', subject)
    return
  }
  try {
    await transporter.sendMail({
      from: `POPY Platform <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    })
  } catch (err) {
    console.error('Email send error:', err)
  }
}

export function urgentListingEmail(property: {
  title: string; price: number; location: string; dealScore: number; sourceUrl?: string
}) {
  return `
<!DOCTYPE html>
<html>
<body style="background:#070B14;color:#F0F4FF;font-family:Arial,sans-serif;padding:32px;margin:0">
  <div style="max-width:560px;margin:0 auto">
    <div style="background:linear-gradient(135deg,#00D4FF20,#7C3AED10);border:1px solid #2A3F5C;border-radius:12px;padding:28px">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px">
        <div style="background:linear-gradient(135deg,#00D4FF,#7C3AED);width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:900;color:#000;font-size:18px">P</div>
        <span style="font-size:20px;font-weight:800">POPY</span>
        <span style="background:#FF6B3520;color:#FF6B35;padding:2px 10px;border-radius:99px;font-size:11px;font-weight:700;border:1px solid #FF6B3540">⚡ URGENT ALERT</span>
      </div>
      <h2 style="color:#FF6B35;font-size:22px;margin:0 0 12px">Hot Listing Detected!</h2>
      <h3 style="font-size:16px;margin:0 0 8px;color:#F0F4FF">${property.title}</h3>
      <p style="color:#8BA3C4;margin:0 0 16px">📍 ${property.location}</p>
      <div style="background:#0D1422;border:1px solid #1E2D45;border-radius:8px;padding:16px;margin-bottom:20px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div><div style="font-size:11px;color:#4B6080;text-transform:uppercase;margin-bottom:4px">Price</div>
          <div style="font-size:22px;font-weight:900;color:#F0F4FF">৳${(property.price/10000000).toFixed(1)} Cr</div></div>
          <div><div style="font-size:11px;color:#4B6080;text-transform:uppercase;margin-bottom:4px">Deal Score</div>
          <div style="font-size:22px;font-weight:900;color:${property.dealScore >= 80 ? '#00E5A0' : '#FFB800'}">${property.dealScore}/100</div></div>
        </div>
      </div>
      <a href="${property.sourceUrl || 'https://popy.bd'}" style="background:#00D4FF;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block">View Property →</a>
    </div>
    <p style="text-align:center;color:#4B6080;font-size:11px;margin-top:20px">POPY · Bangladesh Property Intelligence · <a href="#" style="color:#4B6080">Unsubscribe</a></p>
  </div>
</body>
</html>`
}

export async function createDBAlert(userId: string, type: string, title: string, body: string, priority = 'medium') {
  try {
    return await prisma.alert.create({
      data: {
        userId,
        type: type as any,
        title,
        body,
        priority: priority as any,
      }
    })
  } catch (err) {
    console.error('DB alert create error:', err)
  }
}

export async function processAlertRules(propertyId: string) {
  try {
    const property = await prisma.property.findUnique({ where: { id: propertyId } })
    if (!property) return

    const rules = await prisma.alertRule.findMany({
      where: {
        isActive: true,
        OR: [
          { area: null },
          { area: property.area || undefined },
        ],
      },
      include: { user: true },
    })

    for (const rule of rules) {
      let shouldAlert = false
      let alertTitle = ''
      let alertBody = ''

      if (rule.type === 'new_listing') {
        shouldAlert = true
        alertTitle = `New listing in ${property.area}`
        alertBody = `${property.title} — ৳${(Number(property.price) / 10000000).toFixed(1)} Cr`
      } else if (rule.type === 'urgent_sale' && property.isUrgent) {
        shouldAlert = true
        alertTitle = `⚡ Urgent Sale — ${property.area}`
        alertBody = `${property.title} listed as urgent. Deal Score: ${property.dealScore}`
      }

      if (shouldAlert && rule.user) {
        await createDBAlert(rule.userId, rule.type, alertTitle, alertBody, 'high')
        if (rule.user.email) {
          await sendEmailAlert(
            rule.user.email,
            alertTitle,
            urgentListingEmail({ title: property.title, price: Number(property.price), location: property.location, dealScore: property.dealScore, sourceUrl: property.sourceUrl || undefined })
          )
        }
      }
    }
  } catch (err) {
    console.error('Alert rule processing error:', err)
  }
}
