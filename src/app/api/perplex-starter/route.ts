import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.json();

    // Validate required fields
    if (!formData || Object.keys(formData).length === 0) {
      return NextResponse.json({ error: 'Form data is required' }, { status: 400 });
    }

    // Create comprehensive prompt for 1-month marketing strategy (using HeroMain form data)
const prompt = `You are an expert marketing coach, specializing in guiding complete beginners. Your job is to create a step-by-step, hands-on, 1-month marketing program that a beginner can follow without feeling overwhelmed.

**DO NOT use jargon. Break complex tasks into ultra-clear, single steps, using friendly, direct language.**

You have access to detailed business info:
- Problem solved: ${formData.problem || 'Not specified'}
- Core features/value prop: ${formData.features || 'Not specified'}
- Launch type: ${formData.launchType || 'Not specified'}
- Development stage: ${formData.devStage || 'Not specified'}
- Business model: ${formData.businessModel || 'Not specified'}
- ARR: ${formData.arr || 'Not specified'}
- Business age: ${formData.businessAge || 'Not specified'}
- Business objectives: ${formData.objectives || 'Not specified'}
- Ideal customer profile: ${formData.icp || 'Not specified'}
- Industries served: ${formData.industries || 'Not specified'}
- Customer pain points: ${formData.customerPain || 'Not specified'}
- Current solutions: ${formData.currentSolution || 'Not specified'}
- Market size: ${formData.marketSize || 'Not specified'}
- Market type: ${formData.marketType || 'Not specified'}
- Problem urgency: ${formData.urgency || 'Not specified'}
- Competitors: ${formData.competitors || 'Not specified'}
- Differentiation: ${formData.differentiation || 'Not specified'}
- Competitive advantage: ${formData.advantage || 'Not specified'}
- Positioning: ${formData.positioning || 'Not specified'}
- Current marketing: ${formData.marketingActivities || 'Not specified'}
- CAC: ${formData.cac || 'Not specified'}
- LTV: ${formData.ltv || 'Not specified'}
- Sales cycle: ${formData.salesCycle || 'Not specified'}
- Conversion rate: ${formData.conversionRate || 'Not specified'}
- Marketing budget: ${formData.budget || 'Not specified'}
- Team size: ${formData.teamSize || 'Not specified'}
- Tools used: ${formData.tools || 'Not specified'}
- Resource limitations: ${formData.limitations || 'Not specified'}
- Growth goals: ${formData.growthGoals || 'Not specified'}
- Success definition: ${formData.success || 'Not specified'}
- Key KPIs: ${formData.kpis || 'Not specified'}
- Timeline: ${formData.timeline || 'Not specified'}
- Customer discovery: ${formData.discovery || 'Not specified'}
- Decision makers: ${formData.decisionMakers || 'Not specified'}
- Sales process: ${formData.salesProcess || 'Not specified'}
- Common objections: ${formData.objections || 'Not specified'}
- Working channels: ${formData.channels || 'Not specified'}
- Audience location: ${formData.audienceOnline || 'Not specified'}
- Marketing approach: ${formData.marketingApproach || 'Not specified'}
- Channel openness: ${formData.openChannels || 'Not specified'}

**RESEARCH MODE**: Given this info, find (using Perplexity/AI research):
- Specific websites, forums, Reddit threads and online communities where the ideal audience spends time
- Search for niche spaces (not just Facebook/Twitter/LinkedIn)
- Mention any competitor spaces, trending micro-communities, or relevant influencers

**DELIVERABLE**:
Create a 4-week marketing plan in clean, copy-pasteable MDX, as if coaching a total beginner. Each week is a module. Each day is a checklist. Do not assume any prior marketing experience.

**FOR EVERY TASK:**
- Clearly state WHAT to do (example: "Post in X forum with this script: …")
- Explain WHY it matters (one sentence in simple language)
- Give an EXAMPLE/SCRIPT/template
- List a TOOL or LINK to use if possible (ex: “Canva”, “Reddit”, “Google Forms”—not affiliate, just for clarity)
- Tell the user HOW TO KNOW they did it right (what outcome/result/proof)
- Add a “Write here what happened” journaling box

**PROGRAM OUTLINE:**

1. Intro: In 2-3 lines, reassure the user they do NOT need marketing experience to use this plan. Encourage them to go step by step.
2. Executive Summary (ultra-brief for beginners)
3. Market Research Made Simple (with real online spaces discovered)
4. Weekly Action Programs:
    - Week 1: “Get Your First Feedback!”
    - Week 2: “Grow Your First Audience!”
    - Week 3: “Boost Engagement & Trust!”
    - Week 4: “Turn Interest into Sales!”
For each week, break down into daily micro-steps (Mon-Fri or Mon-Sat), repeat, review, and optimize weekends.
5. Templates, copy-paste post/message examples for each channel/platform
6. Basic daily tracking table (e.g., “How many replies today?” “Did I join a new group?” Y/N)
7. At the end: “How did it go? Can you update your results?” prompt, and a short encouragement.

You must obey these special instructions:
**SPECIAL INSTRUCTIONS:**

IMPORTANT: Your response must fit within a 5,000 token limit. If you run out of space, prioritize: (1) marketing channels and communities list for my niche, (2) daily action plan, (3) outreach scripts. Briefly summarize or skip advanced sections if necessary.

RESEARCH TASK: Based on my business/audience info, generate a list of:
- 5–10 of the most relevant subreddits (with short explanation, not just “r/startups”)
- Niche discussion forums and Slack/Discord groups
- Popular product launch sites (e.g., Product Hunt, Betalist, Indie Hackers, relevant launch directories)
- For each, explain why and *how* to use it in my case (e.g., real steps to get noticed or participate)

BUDGET ADAPTATION:
- If marketing budget is zero, only suggest effective, no-cash strategies: direct conversations/outreach, engaging in forums and Reddit, posting valuable insights, collaborations, content marketing, helpful cold-DMs/comments, etc.
- If budget is very low (up to $20):
    - Do NOT suggest traditional paid ads (they are ineffective at this level).
    - Instead, recommend highly creative low-budget tactics:
        - Offer “pay by commission” (performance-based) deals to small creators/influencers, local group admins, websites with affiliate options, etc.
        - Suggest micro-incentives: e.g., small gift cards or free product to a few early users for referrals or testimonials.
        - Teach how to **propose and negotiate commission-based collaborations** (give a script/template and where to do it, e.g., Reddit DMs, Indie Hackers DMs, etc.).
        - Suggest bartering/collaborative swaps (e.g., you do X for them, they post/share about you).
- If budget is modest ($50–$300):
    - Recommend testing paid traffic in small, targeted channels (e.g., Reddit ads for a niche subreddit, DMing admins about micro-sponsorships, or collaborating with micro-influencers who accept low payment).
    - Still include “pay by commission” and organic tactics.
- If budget is larger ($300+):
    - Suggest proven paid marketing strategies: ad campaigns (Reddit, Product Hunt, newsletter sponsorships), influencer marketing, and proven SaaS/ad tools with expected ROI.
    - Include steps for correctly allocating and tracking spend.

ALWAYS explain the logic: why this tactic suits the budget level, and how to approach/pay/negotiate (with templates).

FOR ALL BUDGETS:
- Provide scripts/templates for cold DMs/emails/messages to propose commission-based or barter deals. Include what to say, how to phrase value, and how to track/refine these efforts.

SKIP GENERIC TASKS: If my form shows I already have a website, subscribers, or social media, skip the advice to “start by building a site” or “write a first post.” Focus on growth, audience-building, and traction channels.

AUDIENCE BUILDING:
- Use proven strategies from top marketers (e.g., Alex Hormozi: “Build an audience by having 100 conversations a day with your market”).
- For beginners with zero presence, recommend how to get your first 100 true “connections”:
    - Where to DM, post, or join discussions (subreddits, Discords, niche groups, do an extensive research of places).
    - How to spark conversations, not just post content.
    - Scripts/templates for outreach, NOT generic “write a tweet.”
    - Methods for following up and compounding trust.
- Show a clear ramp: Week 1 = direct outreach for feedback, Week 2 = audience engagement, Week 3 = content syndication + group participation, etc.

REFERENCE: Draw from strategies used by real startups and top marketers (name-drop Hormozi, Chris Walker, Harry Dry, etc.) to make advice battle-tested and practical.


**ADDITIONAL RULES:**
- Do not use professional/agency jargon.
- Every step must be *doable in under 30 minutes*.
- Provide real, actionable links or keywords to copy into Google to find the spaces/talk to the audience.
- Be friendly, supportive, and practical. Act as a helpful coach, not an expert giving a lecture.
- Make it ready for Notion (clean MDX only, no extra formatting).

`;
    // Call Perplexity API
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-deep-research',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 5000,
        temperature: 0.7,
        top_p: 0.9,
        return_citations: true,
        search_domain_filter: ["perplexity.ai"],
        return_images: false,
        return_related_questions: false,
        search_recency_filter: "month",
        top_k: 0,
        stream: false,
        presence_penalty: 0,
        frequency_penalty: 1
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API error:', errorText);
      return NextResponse.json({
        error: 'Failed to generate marketing strategy. Please try again.'
      }, { status: 500 });
    }

    const data = await response.json();
    const strategy = data.choices?.[0]?.message?.content;

    if (!strategy) {
      return NextResponse.json({
        error: 'No strategy generated. Please try again.'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      strategy: strategy,
      citations: data.citations || []
    });

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({
      error: 'Something went wrong. Please try again.'
    }, { status: 500 });
  }
}
