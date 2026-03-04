export interface VehicleData {
  year: number;
  make: string;
  model: string;
  engines: string[];
  trims: string[];
  driveTypes: ('FWD' | 'RWD' | 'AWD' | '4WD')[];
}

export const TOP_MAKES = [
  'Acura', 'Audi', 'BMW', 'Buick', 'Cadillac', 'Chevrolet', 'Chrysler',
  'Dodge', 'Ford', 'GMC', 'Honda', 'Hyundai', 'Infiniti', 'Jeep',
  'Kia', 'Lexus', 'Lincoln', 'Mazda', 'Mercedes-Benz', 'Mitsubishi',
  'Nissan', 'Ram', 'Subaru', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo'
];

export const TOP_500_VEHICLES = [
  // Pickup Trucks
  { make: 'Ford', model: 'F-150', category: 'Pickup Truck' },
  { make: 'Chevrolet', model: 'Silverado 1500', category: 'Pickup Truck' },
  { make: 'Ram', model: '1500', category: 'Pickup Truck' },
  { make: 'GMC', model: 'Sierra 1500', category: 'Pickup Truck' },
  { make: 'Toyota', model: 'Tacoma', category: 'Pickup Truck' },
  { make: 'Chevrolet', model: 'Colorado', category: 'Pickup Truck' },
  { make: 'Ford', model: 'Ranger', category: 'Pickup Truck' },
  { make: 'GMC', model: 'Canyon', category: 'Pickup Truck' },
  { make: 'Nissan', model: 'Frontier', category: 'Pickup Truck' },
  { make: 'Honda', model: 'Ridgeline', category: 'Pickup Truck' },
  // SUVs/Crossovers
  { make: 'Toyota', model: 'RAV4', category: 'SUV' },
  { make: 'Honda', model: 'CR-V', category: 'SUV' },
  { make: 'Chevrolet', model: 'Equinox', category: 'SUV' },
  { make: 'Ford', model: 'Explorer', category: 'SUV' },
  { make: 'Toyota', model: 'Highlander', category: 'SUV' },
  { make: 'Jeep', model: 'Grand Cherokee', category: 'SUV' },
  { make: 'Ford', model: 'Escape', category: 'SUV' },
  { make: 'Jeep', model: 'Wrangler', category: 'SUV' },
  { make: 'Subaru', model: 'Outback', category: 'SUV' },
  { make: 'Toyota', model: '4Runner', category: 'SUV' },
  // Sedans
  { make: 'Toyota', model: 'Camry', category: 'Sedan' },
  { make: 'Honda', model: 'Civic', category: 'Sedan' },
  { make: 'Honda', model: 'Accord', category: 'Sedan' },
  { make: 'Toyota', model: 'Corolla', category: 'Sedan' },
  { make: 'Nissan', model: 'Altima', category: 'Sedan' },
  { make: 'Hyundai', model: 'Elantra', category: 'Sedan' },
  { make: 'Chevrolet', model: 'Malibu', category: 'Sedan' },
  { make: 'Kia', model: 'Forte', category: 'Sedan' },
  { make: 'Subaru', model: 'Legacy', category: 'Sedan' },
  { make: 'Mazda', model: 'Mazda3', category: 'Sedan' },
  // Full-size SUVs
  { make: 'Chevrolet', model: 'Tahoe', category: 'Full-Size SUV' },
  { make: 'Ford', model: 'Expedition', category: 'Full-Size SUV' },
  { make: 'Chevrolet', model: 'Suburban', category: 'Full-Size SUV' },
  { make: 'GMC', model: 'Yukon', category: 'Full-Size SUV' },
  { make: 'Dodge', model: 'Durango', category: 'Full-Size SUV' },
  { make: 'Nissan', model: 'Armada', category: 'Full-Size SUV' },
  { make: 'Toyota', model: 'Sequoia', category: 'Full-Size SUV' },
  { make: 'Jeep', model: 'Grand Wagoneer', category: 'Full-Size SUV' },
  // Vans
  { make: 'Toyota', model: 'Sienna', category: 'Van' },
  { make: 'Honda', model: 'Odyssey', category: 'Van' },
  { make: 'Chrysler', model: 'Pacifica', category: 'Van' },
  { make: 'Ram', model: 'ProMaster', category: 'Van' },
  { make: 'Ford', model: 'Transit', category: 'Van' },
];
