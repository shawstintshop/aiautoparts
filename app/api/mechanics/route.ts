import { NextRequest, NextResponse } from 'next/server';

const MOCK_MECHANICS = [
  {
    id: '1',
    businessName: 'AutoGenius Certified Center - Downtown',
    address: '123 Main St, Your City, ST 12345',
    coordinates: { latitude: 37.7749, longitude: -122.4194 },
    phone: '(555) 123-4567',
    website: 'https://autogenius.com',
    rating: 4.9,
    reviewCount: 342,
    verifiedPartner: true,
    specialties: ['Engine', 'Transmission', 'Brakes', 'Electrical', 'Hybrid'],
    priceRange: '$$' as const,
    yearsInBusiness: 15,
    nextAvailableSlot: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    hasToolRental: true,
    toolInventory: ['Torque wrench', 'Floor jack', 'Jack stands', 'Spring compressor', 'Ball joint press'],
    certifications: ['ASE', 'AAA Approved', 'NAPA AutoCare'],
    responseTimeAvg: 5,
    distance: 0.8,
  },
  {
    id: '2',
    businessName: 'ProTech Auto Repair',
    address: '456 Oak Ave, Your City, ST 12345',
    coordinates: { latitude: 37.7740, longitude: -122.4180 },
    phone: '(555) 234-5678',
    website: '',
    rating: 4.7,
    reviewCount: 198,
    verifiedPartner: false,
    specialties: ['Brakes', 'Engine', 'AC/Heat'],
    priceRange: '$' as const,
    yearsInBusiness: 8,
    nextAvailableSlot: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    hasToolRental: false,
    toolInventory: [],
    certifications: ['ASE'],
    responseTimeAvg: 12,
    distance: 1.4,
  },
  {
    id: '3',
    businessName: 'Elite Motors Service',
    address: '789 Pine Blvd, Your City, ST 12345',
    coordinates: { latitude: 37.7760, longitude: -122.4210 },
    phone: '(555) 345-6789',
    website: 'https://elitemotors.com',
    rating: 4.8,
    reviewCount: 276,
    verifiedPartner: true,
    specialties: ['Transmission', 'Engine', 'Hybrid', 'Electric'],
    priceRange: '$$$' as const,
    yearsInBusiness: 22,
    nextAvailableSlot: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    hasToolRental: true,
    toolInventory: ['Torque wrench', 'Floor jack', 'Jack stands', 'OBD scanner', 'Brake caliper tool'],
    certifications: ['ASE', 'Factory Certified', 'AAA Approved'],
    responseTimeAvg: 8,
    distance: 2.1,
  },
];

export async function GET(request: NextRequest) {
  const specialty = request.nextUrl.searchParams.get('specialty');
  let mechanics = MOCK_MECHANICS;

  if (specialty) {
    mechanics = mechanics.filter(m =>
      m.specialties.some(s => s.toLowerCase().includes(specialty.toLowerCase()))
    );
  }

  return NextResponse.json(mechanics);
}
