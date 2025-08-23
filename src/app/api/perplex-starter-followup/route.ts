import { NextRequest, NextResponse } from 'next/server';

// Reuse sanitization approach from starter route
function sanitize(raw: string) {
  return raw
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/\[([^\]]+)\]\((?:https?:\/\/|www\.)[^)]+\)/gi, '$1')
    .replace(/\bhttps?:\/\/\S+|\bwww\.\S+/gi, '')
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: 'Request body required' }, { status: 400 });
    }

    const annotated = (body.annotatedStrategy || body.feedback?.annotatedStrategy || '').trim();
    if (annotated.length < 50) {
      return NextResponse.json({ error: 'Annotated previous strategy (≥50 chars) required.' }, { status: 400 });
    }

    const core = body.core || {};
    const feedback = body.feedback || {};

    const prompt = `# IDENTITY\nYou are “Miller” from LaunchPrint. Pragmatic, concise, zero fluff. Never mention internal tools.\n\n# FRESH CORE ANSWERS\n- Who: ${core.who || 'Not provided'}\n- What: ${core.what || 'Not provided'}\n- When (urgency/context): ${core.when || 'Not provided'}\n- How (convert maybe→yes): ${core.how || 'Not provided'}\n- Budget (monthly): ${core.budget || feedback.budget || 'Not provided'}\n\n# PREVIOUS 30-DAY PLAN (User annotated with [x]=done, [-]=partial, [ ]=not attempted)\n${annotated.slice(0, 18000)}\n\n# LAST 30 DAYS FEEDBACK\n- Outcomes: ${feedback.outcomesSummary || 'Not provided'}\n- Best channel & why: ${feedback.bestChannel || 'Not provided'}\n- Worst channel & why: ${feedback.worstChannel || 'Not provided'}\n- Obstacles: ${feedback.obstacles || 'Not provided'}\n- New goals: ${feedback.newGoals || 'Not provided'}\n- Time available (minutes/day): ${feedback.timePerDay || 'Not provided'}\n- Mode: ${feedback.businessMode || 'Not provided'} | Physical store: ${feedback.hasPhysicalStore || 'Not provided'} | Geography: ${feedback.geography || 'Not provided'}\n- Notes: ${feedback.notes || 'None'}\n\n# OBJECTIVE\nProduce a focused NEXT 30-DAY ITERATION: Double-down winners, cut or simplify persistent underperformers (after 2–3 tries), introduce MAX 2 new experiments with clear why. Respect time & budget.\n\n# STRICT NO-URL POLICY\nNo URLs. No markdown links. Platform names only (optionally '(search: term)').\n\n# FORMAT\nSections:\n1. Motivation (1 short line).\n2. Channel Focus (Double-Down / Replace-or-Cut / New Experiments) with one-line why each.\n3. Day 1–30 Checklist: 5–6 tasks per day, only '- [ ]' lines + scripts/templates directly under relevant task (Good, Bad, Personalization Tip, Fallback 48–72h, CTA). Include reflection task every 2–3 days.\n4. Tracking & Metrics (concise checklist).\n5. Month 2 Prep (mini checklist).\n6. Disclaimer (1 line – results vary; momentum comes from steady action).\n\nRules:\n- No Discord or Slack suggestions.\n- Budget adaptation (0, 0–50, 50–300, 300+).\n- Time/day guardrail: cumulative daily minutes ≤ available time.\n- If best channel unknown: pick one likely candidate & justify.\n- If many tasks untouched previously: narrow scope before adding experiments.\n\n# OUTPUT QA (DO NOT PRINT)\nEnsure: explicit double-down reasons, clear cuts, ≤2 experiments, plausible time, no links.\n\n# WRITE THE PLAN NOW`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 600000);

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'sonar-reasoning',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 12000,
        temperature: 0.7,
        top_p: 0.9,
        return_citations: false,
        search_domain_filter: ['perplexity.ai'],
        return_images: false,
        return_related_questions: false,
        search_recency_filter: 'month',
        top_k: 0,
        stream: false,
        presence_penalty: 0,
        frequency_penalty: 1,
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const txt = await response.text();
      console.error('Perplexity API error (follow-up):', txt);
      return NextResponse.json({ error: 'Failed to generate follow-up strategy.' }, { status: 500 });
    }

    const data = await response.json();
    let strategy: string = data.choices?.[0]?.message?.content || '';
    strategy = sanitize(strategy);
    if (!strategy) {
      return NextResponse.json({ error: 'Empty follow-up output.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, strategy });
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return NextResponse.json({ error: 'Follow-up generation timed out.' }, { status: 408 });
      }
      if (error.message.includes('fetch failed') || error.message.includes('Headers Timeout')) {
        return NextResponse.json({ error: 'Network error during follow-up generation.' }, { status: 503 });
      }
    }
    console.error('Follow-up route error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
