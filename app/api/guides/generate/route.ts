import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { jobDescription, vehicle } = await request.json();

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      system: 'You are a master ASE-certified mechanic with 30 years of experience. Generate detailed, safe, accurate DIY repair guides. Be specific to the exact vehicle provided.',
      messages: [{
        role: 'user',
        content: `Generate a complete how-to guide for: ${jobDescription}
Vehicle: ${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim} ${vehicle.engine} ${vehicle.drive}

Return JSON:
{
  "difficulty": "Beginner" | "Intermediate" | "Advanced" | "Pro Only",
  "estimatedTime": "X-Y hours",
  "overview": "what and why",
  "steps": [{"stepNumber": 1, "title": "string", "description": "string", "warning": "string or null", "tip": "string or null"}],
  "tools": ["tool1", "tool2"],
  "parts": ["part1", "part2"],
  "torqueSpecs": {"bolt name": "XX ft-lbs"},
  "warnings": ["warning1"],
  "commonMistakes": ["mistake1"],
  "relatedJobs": ["related job 1"]
}`
      }]
    });

    const content = message.content[0];
    if (content.type !== 'text') throw new Error('Unexpected response');

    const guide = JSON.parse(content.text);
    return NextResponse.json(guide);
  } catch (error) {
    console.error('Guide generation error:', error);
    return NextResponse.json({ error: 'Guide generation failed' }, { status: 500 });
  }
}
