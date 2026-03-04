/**
 * Seed script: Generates vehicle knowledge data via Claude API
 * and stores it in Firestore.
 *
 * Usage: npx ts-node scripts/seed-vehicles.ts
 */
import Anthropic from '@anthropic-ai/sdk';
import { TOP_500_VEHICLES } from '../data/vehicles';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function generateKnowledge(make: string, model: string) {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [{
      role: 'user',
      content: `Generate vehicle knowledge data for ${make} ${model} (all recent years).

Return JSON:
{
  "commonProblems": [
    {
      "issue": "string",
      "frequency": "Very Common" | "Common" | "Occasional",
      "severity": "low" | "medium" | "high" | "critical",
      "affectedYears": "XXXX-XXXX",
      "symptoms": ["symptom1"],
      "fix": "plain English fix",
      "partsNeeded": ["part1"],
      "estimatedCost": "$XX - $XXX",
      "diyFriendly": true,
      "avgRepairTime": "X-Y hours"
    }
  ],
  "popularUpgrades": [
    {
      "name": "string",
      "category": "Performance" | "Aesthetic" | "Comfort" | "Safety",
      "performanceGain": "string",
      "costRange": "$XX - $XXX",
      "difficulty": "Easy" | "Intermediate" | "Hard" | "Pro Only",
      "diyTime": "X-Y hours",
      "topBrands": ["brand1"],
      "compatibleTrims": ["All Trims"]
    }
  ],
  "serviceIntervals": [
    {"service": "Oil Change", "interval": "5,000-7,500 miles", "cost": "$50-$80"}
  ]
}

Return 5 common problems and 4 popular upgrades. Only return valid JSON.`
    }]
  });

  const content = message.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response type');
  return JSON.parse(content.text);
}

async function seedVehicles() {
  console.log(`Starting seed for ${TOP_500_VEHICLES.length} vehicles...`);

  // Process in batches of 10
  const batchSize = 10;
  const vehicles = TOP_500_VEHICLES;

  for (let i = 0; i < vehicles.length; i += batchSize) {
    const batch = vehicles.slice(i, i + batchSize);
    console.log(`\nProcessing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(vehicles.length / batchSize)}`);

    await Promise.all(
      batch.map(async (vehicle) => {
        try {
          const key = `${vehicle.make}_${vehicle.model}`.replace(/\s+/g, '_');
          console.log(`  Generating: ${vehicle.make} ${vehicle.model}...`);
          const knowledge = await generateKnowledge(vehicle.make, vehicle.model);
          console.log(`  ✓ ${vehicle.make} ${vehicle.model} — ${knowledge.commonProblems?.length || 0} problems, ${knowledge.popularUpgrades?.length || 0} upgrades`);
          // In production: await adminDb.collection('vehicleKnowledge').doc(key).set(knowledge);
        } catch (err) {
          console.error(`  ✗ Failed: ${vehicle.make} ${vehicle.model}`, err);
        }
      })
    );

    // Rate limiting: wait between batches
    if (i + batchSize < vehicles.length) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  console.log('\n✅ Seed complete!');
}

seedVehicles().catch(console.error);
