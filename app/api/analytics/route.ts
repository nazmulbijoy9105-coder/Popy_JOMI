import { NextResponse } from 'next/server';
import { AREA_STATS, PRICE_TRENDS } from '@/lib/data';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      areaStats: AREA_STATS,
      priceTrends: PRICE_TRENDS,
      marketIndex: 847.2,
      avgDhakaPrice: 8240,
      monthlyListings: 12847,
      priceGrowthYoY: 22.4,
    }
  });
}
