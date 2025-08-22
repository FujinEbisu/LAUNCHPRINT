import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/neon';
import { marketingStrategies, strategyFeedback } from '@/lib/schema';
import { and, eq, gte, desc } from 'drizzle-orm';

// Helper: summarize previous strategy (simple truncation for now)
function summarizeStrategy(content: string, maxChars = 700): string {
  if (!content) return 'Not available';
  if (content.length <= maxChars) return content.replace(/\s+/g, ' ').trim();
  return content.slice(0, maxChars).replace(/\s+/g, ' ').trim() + ' ...';
}

// Helper: sanitize output (remove think tags + markdown links + bare URLs)
function sanitizeStrategy(raw: string): string {
  return raw
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/\[([^\]]+)\]\((?:https?:\/\/|www\.)[^)]+\)/gi, '$1')
    .replace(/\bhttps?:\/\/\S+|\bwww\.\S+/gi, '')
    .trim();
}

// Build follow-up prompt from template and payload
interface CoreContext { who?: string; what?: string; budget?: string; when?: string; how?: string }
interface FeedbackContext {
  outcomesSummary?: string; bestChannel?: string; worstChannel?: string; obstacles?: string;
  newGoals?: string; timePerDay?: string; budget?: string; businessMode?: string; hasPhysicalStore?: string;
  geography?: string; notes?: string;
}
interface PromptParams { core: CoreContext; prevSummary: string; feedback: FeedbackContext }

function buildPrompt(params: PromptParams) {
  const { core, prevSummary, feedback } = params;
  return `# IDENTITY\nYou are “Miller” from LaunchPrint, an expert marketing coach for beginners. Never reveal internal tools or providers.\n\n# CONTEXT (DO NOT ECHO RAW DATA; SUMMARIZE TIGHTLY)\nORIGINAL CORE INPUTS\n- Who: ${core.who || 'Not provided'}\n- What (unique problem solved): ${core.what || 'Not provided'}\n- Budget (monthly): ${core.budget || 'Not provided'}\n- When they need it: ${core.when || 'Not provided'}\n- How you convert “maybe” → “yes”: ${core.how || 'Not provided'}\n\nPREVIOUS STRATEGY (BRIEF SUMMARY; NO QUOTES)\n- Summary: ${prevSummary}\n\nFOLLOW-UP FEEDBACK (LAST 30 DAYS)\n- Outcomes summary: ${feedback.outcomesSummary || 'Not provided'}\n- Best channel and why: ${feedback.bestChannel || 'Not provided'}\n- Worst channel and why: ${feedback.worstChannel || 'Not provided'}\n- Obstacles: ${feedback.obstacles || 'Not provided'}\n- New goals (next 30 days): ${feedback.newGoals || 'Not provided'}\n- Time available per day (minutes): ${feedback.timePerDay || 'Not provided'}\n- Updated budget (monthly): ${feedback.budget || 'Not provided'}\n- Business mode: ${feedback.businessMode || 'product|service|mixed not provided'}\n- Physical store: ${feedback.hasPhysicalStore || 'yes/no not provided'}\n- Geography: ${feedback.geography || 'local/regional/national/global not provided'}\n- Notes: ${feedback.notes || 'None'}\n\n# OBJECTIVE\nCreate a 30-day follow-up marketing plan that doubles down on what worked, cuts or reframes what didn’t after 2–3 honest tries, and adds 1–2 high-likelihood experiments aligned to the business mode, geography, budget, and time available.\n\n# STRICT NO-URLs POLICY\n- Do NOT include any URLs or clickable links.\n- Do NOT use Markdown links like [Title](URL). Write titles as plain text only.\n- When referencing platforms or resources, write the platform name + a one-line “how to search/use” instruction.\n- If any earlier instruction suggests adding links, override it with this NO-URLs policy.\n\n# BUSINESS MODE SWITCHBOARD\nDetect and branch using provided context (mode, physical store, geography, time, budget).\n\n# CHANNEL MENU (CHOOSE FIT; NO LINKS)\n(Do NOT list everything—select only those that fit. Available buckets: Local/Offline B2C, Local/Offline B2B, Local Media, Online Local, Online Communities, Social/Content, Partnerships/Affiliates, Direct Outreach, Paid Tests.)\n\n# EXECUTION RULES\n- Double-down monthly: scale best channel; refine scripts; add adjacent tactic.\n- Replace underperformers (2–3 weak attempts) with higher-likelihood options.\n- Physical store: >=2 foot-traffic tasks weekly if store = yes.\n- Services/B2B: >=1 live conversation channel weekly.\n- Respect time available (${feedback.timePerDay || 'n/a'} min/day).\n\n# FORMATTING RULES\n- ONLY Markdown checklists: '- [ ] Task'.\n- Scripts/templates immediately follow tasks.\n- No MDX, no paragraphs outside tasks/scripts.\n- Allowed: plain titles, '---' dividers.\n- No Discord or Slack suggestions.\n\n# PROGRAM STRUCTURE\n- Motivation (one sentence).\n- Channel Focus This Month: double-down, cut/replace, new experiments (why).\n- Days 1–30: 5–6 tasks/day, reflections, checkpoints every 2–3 days.\n- Daily micro-metric logging task.\n- End: Month 2 Prep mini-checklist.\n- Always include: “results will vary; momentum and feedback come from steady action.”\n\n# MEASUREMENT & OFFLINE TRACKING (NO LINKS)\nInclude instructions for offline (QR naming convention, verbal codes, tally sheet) and online (plain UTM name patterns).\n\n# BUDGET ADAPTATION\nAdapt tasks to budget tier (0–50, 50–300, 300+).\n\n# SCRIPTS & OUTREACH\nFor every outreach: Good, Bad, Personalization tip, Fallback (48–72h), CTA.\n\n# OUTPUT CHECKLIST (DO NOT OUTPUT THIS SECTION)\n- Tailored to mode, geography, store.\n- Explicit double-down + reason.\n- Cut/replace rationale.\n- 1–2 new experiments only.\n- Time/budget respected.\n- No links.\n\n# WRITE THE PLAN NOW`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, feedback, previousStrategyId } = body || {};

    if (!userId || !feedback) {
      return NextResponse.json({ error: 'userId and feedback are required' }, { status: 400 });
    }

    // Enforce monthly cap (25 strategies per user per month)
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthStrategies = await db
      .select({ id: marketingStrategies.id })
      .from(marketingStrategies)
      .where(and(eq(marketingStrategies.userId, userId), gte(marketingStrategies.createdAt, monthStart)));

    if (monthStrategies.length >= 25) {
      return NextResponse.json({ error: 'Monthly strategy limit reached (25).' }, { status: 429 });
    }

    // Resolve previous strategy
    let chosenStrategyId = previousStrategyId as number | undefined;
    let previousStrategyContent: string | null = null;

    if (chosenStrategyId) {
      const rows = await db
        .select({ id: marketingStrategies.id, strategy: marketingStrategies.strategy })
        .from(marketingStrategies)
        .where(and(eq(marketingStrategies.userId, userId), eq(marketingStrategies.id, chosenStrategyId)));
      if (rows.length === 0) {
        return NextResponse.json({ error: 'Invalid previousStrategyId for this user' }, { status: 400 });
      }
      previousStrategyContent = rows[0].strategy;
    } else {
      const latest = await db
        .select({ id: marketingStrategies.id, strategy: marketingStrategies.strategy })
        .from(marketingStrategies)
        .where(eq(marketingStrategies.userId, userId))
        .orderBy(desc(marketingStrategies.createdAt))
        .limit(1);
      if (latest.length === 0) {
        return NextResponse.json({ error: 'No existing strategy found. Create an initial strategy first.' }, { status: 400 });
      }
      chosenStrategyId = latest[0].id;
      previousStrategyContent = latest[0].strategy;
    }

    const prevSummary = summarizeStrategy(previousStrategyContent || '');

    // Extract a minimal core from previous strategy (simple heuristic placeholders)
    const core = {
      who: '',
      what: '',
      budget: feedback?.budget || '',
      when: '',
      how: '',
    };

    const prompt = buildPrompt({ core, prevSummary, feedback });

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
      const errorText = await response.text();
      console.error('Perplexity API error (follow-up):', errorText);
      return NextResponse.json({ error: 'Failed to generate follow-up strategy.' }, { status: 500 });
    }

    const data = await response.json();
    let strategy = data.choices?.[0]?.message?.content || '';
    strategy = sanitizeStrategy(strategy);

    if (!strategy) {
      return NextResponse.json({ error: 'Empty follow-up strategy output.' }, { status: 500 });
    }

    // Persist new strategy row (reuse problem label) and feedback
    await db.insert(marketingStrategies).values({
      userId,
      problem: 'Follow-up strategy',
      strategy,
      createdAt: new Date(),
    });

    await db.insert(strategyFeedback).values({
      userId,
      previousStrategyId: chosenStrategyId!,
      reflections: feedback.outcomesSummary || null,
      blockers: feedback.obstacles || null,
      goals: feedback.newGoals ? { newGoals: feedback.newGoals } : null,
      preferences: feedback.timePerDay || feedback.budget ? { timePerDay: feedback.timePerDay, budget: feedback.budget } : null,
      meta: { businessMode: feedback.businessMode, hasPhysicalStore: feedback.hasPhysicalStore, geography: feedback.geography },
      priorStrategySummary: prevSummary,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true, strategy });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json({ error: 'Follow-up generation timed out.' }, { status: 408 });
    }
    console.error('Follow-up route error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
