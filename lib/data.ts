export type UserRole = 'agent' | 'investor' | 'developer' | 'buyer' | 'admin';

export interface Property {
  id: string;
  title: string;
  price: number;
  pricePerSqft?: number;
  location: string;
  area: string;
  district: string;
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  type: 'apartment' | 'house' | 'plot' | 'commercial';
  status: 'active' | 'urgent' | 'sold' | 'pending';
  source: string;
  listedAt: string;
  imageColor: string;
  dealScore: number;
  riskScore: 'low' | 'medium' | 'high';
  priceChange?: number;
  isNew?: boolean;
  isVerified?: boolean;
  legalStatus?: 'clean' | 'pending' | 'disputed';
}

export interface Lead {
  id: string;
  propertyId: string;
  name: string;
  phone: string;
  type: 'seller' | 'buyer';
  urgency: 'hot' | 'warm' | 'cold';
  score: number;
  assignedTo?: string;
  area: string;
  budget: number;
  createdAt: string;
}

export interface Alert {
  id: string;
  type: 'new_listing' | 'price_drop' | 'urgent_sale' | 'lead' | 'legal';
  title: string;
  body: string;
  time: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
}

export const PROPERTIES: Property[] = [
  { id: 'p1', title: 'Modern 3BHK Apartment, Gulshan 2', price: 12500000, pricePerSqft: 8928, location: 'Gulshan 2, Dhaka', area: 'Gulshan', district: 'Dhaka', sqft: 1400, bedrooms: 3, bathrooms: 2, type: 'apartment', status: 'urgent', source: 'Bproperty', listedAt: '2 hours ago', imageColor: '#00D4FF', dealScore: 92, riskScore: 'low', priceChange: -8, isNew: true, isVerified: true, legalStatus: 'clean' },
  { id: 'p2', title: 'Corner Plot 5 Katha, Bashundhara RA', price: 22000000, pricePerSqft: 0, location: 'Block-F, Bashundhara R/A', area: 'Bashundhara', district: 'Dhaka', sqft: 3600, bedrooms: 0, bathrooms: 0, type: 'plot', status: 'active', source: 'Lamudi', listedAt: '5 hours ago', imageColor: '#7C3AED', dealScore: 78, riskScore: 'medium', priceChange: 0, isVerified: false, legalStatus: 'pending' },
  { id: 'p3', title: 'Duplex House 4BHK, Dhanmondi 27', price: 35000000, pricePerSqft: 11666, location: 'Road 27, Dhanmondi', area: 'Dhanmondi', district: 'Dhaka', sqft: 3000, bedrooms: 4, bathrooms: 3, type: 'house', status: 'active', source: 'Facebook', listedAt: '1 day ago', imageColor: '#FF6B35', dealScore: 65, riskScore: 'low', priceChange: 0, isVerified: true, legalStatus: 'clean' },
  { id: 'p4', title: '2BHK Ready Flat, Mirpur DOHS', price: 7800000, pricePerSqft: 7090, location: 'Mirpur DOHS, Dhaka', area: 'Mirpur', district: 'Dhaka', sqft: 1100, bedrooms: 2, bathrooms: 2, type: 'apartment', status: 'urgent', source: 'Bproperty', listedAt: '3 hours ago', imageColor: '#00E5A0', dealScore: 88, riskScore: 'low', priceChange: -12, isNew: true, isVerified: true, legalStatus: 'clean' },
  { id: 'p5', title: 'Commercial Space G/F, Uttara Sector 4', price: 18000000, pricePerSqft: 12000, location: 'Sector 4, Uttara', area: 'Uttara', district: 'Dhaka', sqft: 1500, bedrooms: 0, bathrooms: 2, type: 'commercial', status: 'active', source: 'Lamudi', listedAt: '2 days ago', imageColor: '#F5C842', dealScore: 71, riskScore: 'medium', priceChange: 3, isVerified: false, legalStatus: 'pending' },
  { id: 'p6', title: '3 Katha Plot, Narayanganj', price: 4500000, pricePerSqft: 0, location: 'Fatullah, Narayanganj', area: 'Fatullah', district: 'Narayanganj', sqft: 2160, bedrooms: 0, bathrooms: 0, type: 'plot', status: 'active', source: 'Facebook', listedAt: '4 days ago', imageColor: '#7C3AED', dealScore: 55, riskScore: 'high', priceChange: 0, isVerified: false, legalStatus: 'disputed' },
  { id: 'p7', title: '4BHK Penthouse, Banani 11', price: 48000000, pricePerSqft: 16000, location: 'Road 11, Banani', area: 'Banani', district: 'Dhaka', sqft: 3000, bedrooms: 4, bathrooms: 4, type: 'apartment', status: 'active', source: 'Bproperty', listedAt: '6 days ago', imageColor: '#FF6B35', dealScore: 82, riskScore: 'low', priceChange: 5, isVerified: true, legalStatus: 'clean' },
  { id: 'p8', title: 'Ready Flat 2BHK, Rampura', price: 5200000, pricePerSqft: 6500, location: 'East Rampura, Dhaka', area: 'Rampura', district: 'Dhaka', sqft: 800, bedrooms: 2, bathrooms: 1, type: 'apartment', status: 'urgent', source: 'Facebook', listedAt: '30 min ago', imageColor: '#00D4FF', dealScore: 90, riskScore: 'low', priceChange: -15, isNew: true, isVerified: false, legalStatus: 'pending' },
];

export const LEADS: Lead[] = [
  { id: 'l1', propertyId: 'p1', name: 'Rafiqul Islam', phone: '+880 1711-XXXXXX', type: 'seller', urgency: 'hot', score: 94, assignedTo: 'You', area: 'Gulshan', budget: 12500000, createdAt: '10 min ago' },
  { id: 'l2', propertyId: 'p4', name: 'Nasreen Akter', phone: '+880 1812-XXXXXX', type: 'seller', urgency: 'hot', score: 88, assignedTo: 'You', area: 'Mirpur', budget: 7800000, createdAt: '2 hours ago' },
  { id: 'l3', propertyId: 'p3', name: 'Ahmed Karim', phone: '+880 1915-XXXXXX', type: 'buyer', urgency: 'warm', score: 72, area: 'Dhanmondi', budget: 40000000, createdAt: '1 day ago' },
  { id: 'l4', propertyId: 'p8', name: 'Sumaiya Hossain', phone: '+880 1618-XXXXXX', type: 'seller', urgency: 'hot', score: 91, area: 'Rampura', budget: 5200000, createdAt: '1 hour ago' },
  { id: 'l5', propertyId: 'p2', name: 'Motiur Rahman', phone: '+880 1711-XXXXXX', type: 'buyer', urgency: 'cold', score: 45, area: 'Bashundhara', budget: 25000000, createdAt: '3 days ago' },
];

export const ALERTS: Alert[] = [
  { id: 'a1', type: 'urgent_sale', title: 'Hot Urgent Sale — Rampura', body: '2BHK flat listed 15% below market. Act fast!', time: '30 min ago', read: false, priority: 'high' },
  { id: 'a2', type: 'price_drop', title: 'Price Drop — Gulshan 2', body: 'Apartment price dropped ৳1.2M. Now ৳12.5M', time: '2 hours ago', read: false, priority: 'high' },
  { id: 'a3', type: 'new_listing', title: '7 New Listings in Bashundhara', body: 'New properties match your saved filter', time: '4 hours ago', read: false, priority: 'medium' },
  { id: 'a4', type: 'lead', title: 'New Hot Lead Assigned', body: 'Seller: Rafiqul Islam, Gulshan 2 flat', time: '10 min ago', read: false, priority: 'high' },
  { id: 'a5', type: 'legal', title: 'Legal Check Complete', body: 'Property #P-1024 — Risk: LOW ✓', time: '1 day ago', read: true, priority: 'low' },
];

export const PRICE_TRENDS = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  gulshan: [9200, 9450, 9300, 9800, 10200, 10500, 10800],
  dhanmondi: [7800, 7900, 7850, 8100, 8300, 8500, 8700],
  mirpur: [5200, 5300, 5250, 5400, 5600, 5800, 6000],
  bashundhara: [6500, 6600, 6700, 6900, 7100, 7300, 7500],
};

export const AREA_STATS = [
  { area: 'Gulshan', avgPrice: 10800, growth: 8.2, listings: 342, demand: 92 },
  { area: 'Dhanmondi', avgPrice: 8700, growth: 6.1, listings: 287, demand: 85 },
  { area: 'Banani', avgPrice: 12400, growth: 5.8, listings: 198, demand: 78 },
  { area: 'Uttara', avgPrice: 7200, growth: 9.4, listings: 456, demand: 88 },
  { area: 'Bashundhara', avgPrice: 7500, growth: 11.2, listings: 523, demand: 91 },
  { area: 'Mirpur', avgPrice: 6000, growth: 7.3, listings: 612, demand: 82 },
];

export const formatPrice = (price: number) => {
  if (price >= 10000000) return `৳${(price / 10000000).toFixed(1)} Cr`;
  if (price >= 100000) return `৳${(price / 100000).toFixed(1)} L`;
  return `৳${price.toLocaleString()}`;
};

export const PLAN_FEATURES = {
  agent: ['Daily fresh listings', 'Lead alerts', 'Area filters', 'Google Sheet export', 'Contact details'],
  investor: ['Deal scoring system', 'Price trend analysis', 'ROI estimation', 'Urgent sale alerts', 'Price history'],
  developer: ['Market heatmaps', 'Competitor tracking', 'Area demand analytics', 'Project pricing insights', 'Custom reports'],
};
