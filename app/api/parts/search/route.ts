import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { query, vehicle } = await request.json();

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `You are an automotive parts expert. Given this vehicle and search query, return a JSON array of 6 realistic auto parts results.

Vehicle: ${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim} ${vehicle.engine} ${vehicle.drive}
Query: "${query}"

Return JSON array with this exact structure for each part:
[{
  "partName": "string",
  "brand": "string",
  "partNumber": "string",
  "price": number,
  "msrpPrice": number,
  "savingsAmount": number,
  "source": "AutoZone" | "RockAuto" | "NAPA" | "OReilly" | "Amazon",
  "fitConfidence": number (94-99),
  "aiVerified": true,
  "inStock": boolean,
  "rating": number (3.5-5.0),
  "reviewCount": number,
  "affiliateUrl": "#",
  "description": "string",
  "shippingOptions": [
    {"tier": 1, "name": "1-Hour Local", "description": "Delivered to your driveway", "price": 12.99, "eta": "Within 1 hour", "badge": "FASTEST"},
    {"tier": 2, "name": "Overnight Priority", "description": "FedEx overnight", "price": 19.99, "eta": "By 10:30 AM tomorrow", "badge": "MOST POPULAR"},
    {"tier": 3, "name": "Free 2-Day", "description": "Standard shipping", "price": 0, "eta": "2 business days"},
    {"tier": 4, "name": "Same-Day Pickup", "description": "Pick up at local store", "price": 0, "eta": "Ready in ~2 hours", "badge": "NO WAIT"}
  ]
}]

Only return valid JSON, no other text.`
      }]
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    const companionMessage = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: `For a ${vehicle.year} ${vehicle.make} ${vehicle.model} doing a "${query}" job, what are 4 companion parts commonly replaced at the same time? Return JSON array of strings only. Example: ["Drain plug gasket", "Engine oil 5W-30", "Oil filter wrench"]`
      }]
    });

    const companionContent = companionMessage.content[0];
    let companionParts: string[] = [];
    if (companionContent.type === 'text') {
      try {
        companionParts = JSON.parse(companionContent.text);
      } catch { companionParts = []; }
    }

    const parts = JSON.parse(content.text);
    return NextResponse.json({ parts, companionParts });
  } catch (error) {
    console.error('Parts search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
