export interface HealthReport {
  batteryVoltage?: number;
  engineTemp?: number;
  fuelLevel?: number;
  oilLife?: number;
  tirePressure?: Record<string, number>;
  [key: string]: unknown;
}

export interface Vehicle {
  id?: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  engine: string;
  drive: 'FWD' | 'RWD' | 'AWD' | '4WD';
  vin: string | null;
  mileage: number | null;
  healthReport: HealthReport | null;
  activeDTCs: string[];
  identifiedVia: 'obd' | 'vin' | 'manual';
  createdAt?: Date | string | number;
  lastScanned?: Date | string | number;
}

export interface CommonProblem {
  issue: string;
  frequency: 'Very Common' | 'Common' | 'Occasional';
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedYears: string;
  symptoms: string[];
  fix: string;
  partsNeeded: string[];
  estimatedCost: string;
  diyFriendly: boolean;
  avgRepairTime: string;
}

export interface PopularUpgrade {
  name: string;
  category: 'Performance' | 'Aesthetic' | 'Comfort' | 'Safety';
  performanceGain: string;
  costRange: string;
  difficulty: 'Easy' | 'Intermediate' | 'Hard' | 'Pro Only';
  diyTime: string;
  topBrands: string[];
  compatibleTrims: string[];
}

export interface VehicleKnowledge {
  makeModel: string;
  commonProblems: CommonProblem[];
  popularUpgrades: PopularUpgrade[];
  serviceIntervals: ServiceInterval[];
}

export interface ServiceInterval {
  service: string;
  interval: string;
  cost: string;
}

export interface PartResult {
  partName: string;
  brand: string;
  partNumber: string;
  price: number;
  msrpPrice: number;
  savingsAmount: number;
  source: 'Amazon' | 'RockAuto' | 'AutoZone' | 'NAPA' | 'OReilly';
  fitConfidence: number;
  aiVerified: boolean;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  shippingOptions: DeliveryOption[];
  affiliateUrl: string;
  imageUrl?: string;
  description?: string;
}

export interface DeliveryOption {
  tier: 1 | 2 | 3 | 4;
  name: string;
  description: string;
  price: number;
  eta: string;
  badge?: string;
}

export interface Mechanic {
  id: string;
  businessName: string;
  address: string;
  coordinates: { latitude: number; longitude: number };
  phone: string;
  website: string;
  rating: number;
  reviewCount: number;
  verifiedPartner: boolean;
  specialties: string[];
  priceRange: '$' | '$$' | '$$$';
  yearsInBusiness: number;
  nextAvailableSlot: Date | string;
  hasToolRental: boolean;
  toolInventory: string[];
  certifications: string[];
  responseTimeAvg: number;
  distance?: number;
}

export interface DiagnosticResult {
  code: string;
  meaning: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  estimatedCost: string;
  diyFriendly: boolean;
  diyReasoning: string;
  partsNeeded: string[];
  diagnosticSteps: string[];
  repairGuideLink?: string;
}

export interface RepairGuide {
  id?: string;
  jobDescription: string;
  vehicle: Partial<Vehicle>;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro Only';
  estimatedTime: string;
  steps: RepairStep[];
  tools: string[];
  parts: string[];
  torqueSpecs: Record<string, string>;
  warnings: string[];
  commonMistakes: string[];
}

export interface RepairStep {
  stepNumber: number;
  title: string;
  description: string;
  warning?: string;
  tip?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  isPro: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  vehicles: Vehicle[];
  activeVehicleId?: string;
  obdDeviceShipped: boolean;
  createdAt: Date | string | number;
}

export interface CartItem {
  part: PartResult;
  quantity: number;
  selectedDelivery: DeliveryOption;
}
