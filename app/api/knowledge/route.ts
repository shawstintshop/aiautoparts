import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { year, make, model } = await request.json();

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      messages: [{
        role: 'user',
        content: `Generate vehicle knowledge data for ${year} ${make} ${model}.

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
      "diyFriendly": boolean,
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
    if (content.type !== 'text') throw new Error('Unexpected response');

    const knowledge = JSON.parse(content.text);
    return NextResponse.json(knowledge);
  } catch (error) {
    console.error('Knowledge error:', error);
    return NextResponse.json({ error: 'Failed to get knowledge' }, { status: 500 });
  }
}
