import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const vin = request.nextUrl.searchParams.get('vin');
  if (!vin || vin.length !== 17) {
    return NextResponse.json({ error: 'Invalid VIN' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${vin}?format=json`
    );
    const data = await response.json();
    const result = data.Results[0];

    return NextResponse.json({
      year: parseInt(result.ModelYear),
      make: result.Make,
      model: result.Model,
      trim: result.Trim,
      engine: `${result.DisplacementL}L ${result.EngineCylinders}-Cyl`,
      drive: result.DriveType,
      bodyType: result.BodyClass,
      plant: result.PlantCity,
      vin: vin,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to decode VIN' }, { status: 500 });
  }
}
