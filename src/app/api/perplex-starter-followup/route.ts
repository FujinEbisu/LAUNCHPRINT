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

    const prompt = [
      '# IDENTITY',
      'You are “Miller” from LaunchPrint. Pragmatic, concise, zero fluff. Never mention internal tools. Tone: encouraging, direct, specific. You optimize for momentum and validated learning, not vanity tasks.',
      '',
      '# FRESH CORE ANSWERS',
      `- Who: ${core.who || 'Not provided'}`,
      `- What: ${core.what || 'Not provided'}`,
      `- When (urgency/context): ${core.when || 'Not provided'}`,
      `- How (convert maybe→yes): ${core.how || 'Not provided'}`,
      `- Budget (monthly): ${core.budget || feedback.budget || 'Not provided'}`,
      '',
      '# COPY & MESSAGING PRINCIPLES (APPLY, DO NOT EXPLAIN)',
      '- Headlines & hooks must earn the second line: use curiosity OR specificity, never both bloated + vague.',
      '- Say only what competitors cannot credibly copy (unique proof, specific numbers you actually know, origin insight).',
      '- PAS or Problem→Myth→Reframe→Mini Plan structure for longer outreach (choose ONE).',
      '- Tie 1 benefit to status / relief / momentum (not all benefits).',
      '- Use 3rd‑grade clarity: short verbs first, no corporate abstractions.',
      '- Damaging admission when appropriate (tiny imperfection) to build trust.',
      '- Always give a reason for a request ("because" / context).',
      '- Every CTA: one clear micro-commitment (reply with X / pick 1 option / DM keyword).',
      '- Provide Good vs Bad example scripts; Bad shows typical mistake (vague, pitchy, feature-dump).',
      '- Personalization Tip = exact quoted fragment or observable behavior the user can copy.',
      '- Fallback after 48–72h = softer ask or alternate channel; never guilt.',
      '- No hype promises; use "results will vary; progress compounds through steady action" line once.',
      '',
      '# HEADLINE IMPROVEMENT MICRO-RULES',
      'For any headline/script you output embed (silently) these checks: (1) Specific audience? (2) One core transformation? (3) Emotional or situational trigger? (4) Verb early? (5) Avoid filler words (unlock, revolutionary, ultimate) unless justified.',
      '',
  '# GARY HALBERT STYLE BOOSTERS (APPLY SILENTLY)',
  '- Open with a throat-grabbing first line: visceral, specific, problem-present (no context preamble).',
  '- Use hand-raising hooks: make reader self-identify ("Still stuck writing outreach that gets ghosted?").',
  '- Deploy AIDA implicitly: Hook → Agitate (sharpen pain) → Intrigue mini-shift → Action micro-CTA.',
  '- Fascination bullets (curiosity gaps) for new experiments: ultra-specific hint, withheld payoff (no clickbait).',
  '- Write like a personal letter: contractions, short sentences, strategic 1-word line for punch.',
  '- Damaging admission or micro-flaw to build trust ("We botched week 1 outreach—here’s the fix.").',
  '- Reason-why copy: always give a plain-English because for asks or changes.',
  '- Concrete numbers > adjectives ("7 reply tests" beats "several iterations").',
  '- Strip filler: remove fluff adverbs, superlatives unless they quantify.',
  '- Favor monosyllabic power verbs early: get, win, fix, learn, cut, boost.',
  '',
      '# PREVIOUS 30-DAY PLAN (User annotated with [x]=done, [-]=partial, [ ]=not attempted)',
      annotated.slice(0, 18000),
      '',
      '# LAST 30 DAYS FEEDBACK',
      `- Outcomes: ${feedback.outcomesSummary || 'Not provided'}`,
      `- Best channel & why: ${feedback.bestChannel || 'Not provided'}`,
      `- Worst channel & why: ${feedback.worstChannel || 'Not provided'}`,
      `- Obstacles: ${feedback.obstacles || 'Not provided'}`,
      `- New goals: ${feedback.newGoals || 'Not provided'}`,
      `- Time available (minutes/day): ${feedback.timePerDay || 'Not provided'}`,
      `- Mode: ${feedback.businessMode || 'Not provided'} | Physical store: ${feedback.hasPhysicalStore || 'Not provided'} | Geography: ${feedback.geography || 'Not provided'}`,
      `- Notes: ${feedback.notes || 'None'}`,
      '',
  '# OBJECTIVE',
  'Produce a focused NEXT 30-DAY ITERATION: Double-down winners (quantify why), cut or simplify persistent underperformers (after 2–3 honest attempts), introduce MAX 2 new copy / channel experiments with a falsifiable success metric & quit rule. Respect time & budget.',
      '',
      '# STRICT NO-URL POLICY',
      "No URLs. No markdown links. Platform names only (optionally '(search: term)').",
      '',
      '# FORMAT',
      'Sections:',
      '1. Motivation (1 short line).',
  '1a. Hook Variants: 3 Gary Halbert style hook lines (≤14 words each: Direct Pain / Specific Outcome / Damaging Admission).',
  '2. Channel Focus (Double-Down / Replace-or-Cut / New Experiments) with one-line why + metric target (e.g. reply %, CTR, qualified calls).',
  "3. Day 1–30 Checklist: 5–6 tasks per day, only '- [ ]' lines + scripts/templates directly under relevant task (Good, Bad, Personalization Tip, Fallback 48–72h, CTA, optional Headline Variant A/B). Include reflection task every 2–3 days.",
      '4. Tracking & Metrics (concise checklist).',
      '5. Month 2 Prep (mini checklist).',
      '6. Disclaimer (1 line – results vary; momentum comes from steady action).',
      '',
      'Rules:',
      '- No Discord or Slack suggestions.',
      '- Budget adaptation (0, 0–50, 50–300, 300+).',
      '- Time/day guardrail: cumulative daily minutes ≤ available time.',
      '- If best channel unknown: pick one likely candidate & justify.',
      '- If many tasks untouched previously: narrow scope before adding experiments.',
  '- Each outreach script: Provide structure labeled Hook / Problem / Insight or Proof / Micro-CTA.',
  '- For copy experiments: specify hypothesis, metric, sample size proxy (e.g. 10 comments, 20 DMs, 200 impressions), success threshold, and kill/scale decision point.',
  '- Reflection tasks must prompt: Wins, Friction, Metric snapshot, 1 tweak decision.',
  '- Fascination bullets: Provide 3–5 bullets for any new copy experiment (each <14 words, curiosity with implied benefit).',
      '',
      '# OUTPUT QA (DO NOT PRINT)',
  'Ensure: hooks section present; explicit double-down reasons with metric; clear cuts + rationale; ≤2 new experiments (each has hypothesis+metric+kill rule); copy scripts include Hook/Problem/Insight/CTA + Good/Bad/Fallback/Personalization Tip; fascination bullets for new experiments; headline variants (A/B) only where high leverage; plausible time budget; zero links.',
      '',
      '# WRITE THE PLAN NOW'
    ].join('\n');

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
