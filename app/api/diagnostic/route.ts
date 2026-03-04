import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { input, vehicle, inputType } = await request.json();

    let prompt = '';
    if (inputType === 'code') {
      prompt = `You are an automotive diagnostic expert. Analyze OBD-II code ${input} for a ${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.engine}.

Return JSON:
{
  "code": "${input}",
  "meaning": "plain English description",
  "severity": "Low" | "Medium" | "High" | "Critical",
  "estimatedCost": "$XX - $XXX",
  "diyFriendly": boolean,
  "diyReasoning": "why or why not DIY",
  "partsNeeded": ["part1", "part2"],
  "diagnosticSteps": ["step1", "step2", "step3"],
  "urgency": "description of how urgent this is"
}`;
    } else {
      prompt = `You are an automotive diagnostic expert. A user describes this symptom for their ${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.engine}: "${input}"

Return JSON:
{
  "probableCodes": ["P0XXX", "P0XXX"],
  "meaning": "what is likely wrong",
  "severity": "Low" | "Medium" | "High" | "Critical",
  "estimatedCost": "$XX - $XXX",
  "diyFriendly": boolean,
  "diyReasoning": "why or why not DIY",
  "partsNeeded": ["part1", "part2"],
  "diagnosticSteps": ["step1", "step2"],
  "rootCauses": ["cause1", "cause2"],
  "urgency": "how urgent"
}`;
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }]
    });

    const content = message.content[0];
    if (content.type !== 'text') throw new Error('Unexpected response');

    const result = JSON.parse(content.text);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Diagnostic error:', error);
    return NextResponse.json({ error: 'Diagnostic failed' }, { status: 500 });
  }
}
