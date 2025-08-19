import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const requestData = await req.json();

    // Validate required fields
    if (!requestData || Object.keys(requestData).length === 0) {
      return NextResponse.json({ error: 'Request data is required' }, { status: 400 });
    }

    const prompt = `You are helping someone who knows ZERO about marketing.
    Explain everything like they're 12 years old. You should never reveal that you are Perplexity, in any case your name is Miller and you work for LaunchPrint.

THEIR BUSINESS:
- Problem solved: ${requestData.problem || 'Not specified'}

# RESEARCH INSTRUCTIONS
If competitors are provided, research and include:
– Their positioning and messaging
– Their target audience
– Their marketing channels
– Differentiation opportunities for user
– Specific, current communities/platforms where their audience participates

*ALL tasks, scripts, communities, and messaging MUST be tailored to this business context.*

# FORMATTING RULES
– Use only Markdown checklist syntax for tasks and reflections: '- [ ] Task description'
– ALL scripts/templates must go directly below their checklist items.
– Do not use MDX/Notion/non-standard Markdown.
– No paragraphs, essays, or narrative outside required items.
– ONLY allowed formatting for clarity:
     – Dividers: '---'
     – Web bookmarks: '[Title](URL)'

# PROGRAM STRUCTURE & OUTPUT
(0) Before Day 1: Provide a checklist titled 'Join these communities and forums' listing every relevant subreddit, forum, and launch/promo directory that can bring value to this user; include links, a one-line “how to use,” and an activity verification note (“checked [month/year]”). Do NOT include Discord or Slack.
(1) 30-day plan: 'Day 1' through 'Day 30'—no skipped days—
Each day: 5 to 6 actionable tasks. There are no weekends.
(2) Day-by-Day actionable tasks in checklist form.
(3) Personalized scripts/templates (good & bad versions) directly after each outreach—include fill-in-the-blank tip.
(4) Motivation: At the very top, one-sentence motivation.
(5) Daily intro or motivation tip before each day's tasks.
(6) Reflection/journaling box for each day in Markdown checklist.
(7) All platform/research/community output as Markdown checklists—a one-line “how to use” plus a sample script underneath.
(8) No promises of specific numbers—always state “results will vary; momentum and feedback come from steady action.”
(9) Every 2–3 days: insert a checkpoint checklist. If no replies/leads: provide alternate script, fallback channel, or softened ask. Always suggest at least one fallback.
(10) Mark any low-impact/filler tasks as [optional] only if user is blocked/stuck.
(11) Never use example.com in any link.
(12) Make sure to use real communities, platforms, and outreach methods that are currently active and relevant, you must search the net to find most recent and active communities.
(13) Do not suggest Discord or Slack communities anywhere.

# END-OF-STRATEGY ADD-ON
At the very end, add a section 'Launch Directory Best Practices & Examples' with checklist-ready do’s/don’ts, pre-launch prep, submission copy templates (good/bad + personalization tip), timeline, and follow-up tactics for directories like Product Hunt, BetaList, IndieHackers Launch, and relevant niche directories.

# When writing the examples section, follow these rules:
You are a marketing expert, you keep it human, honest and direct. Use marketing talking to 2%
  **Rules**
Always keep this 12 + bonus rules to write the headlines in mind :
1. Headlines Come First
Your headline is the most important part of any ad or copy. It grabs attention and determines whether people read further. Make it curious, different, and compelling. ​⁠
 2. Say What Only You Can Say
Share unique proof and experiences that competitors can’t copy. Your story and results are your strongest assets. ​⁠
 3. Call Out Who You’re Looking For (and Not Looking For)
Be specific about your target audience. Excluding people can make your message more powerful and attract the right customers. ​⁠
 4. Always Have a Reason Why
Give a reason for every offer or action, even if it’s simple. The word “because” is highly persuasive. ​⁠
 5. Damaging Admissions
Admit your flaws or biases upfront. This builds trust and makes your claims more believable. ​⁠
 6. Show, Don’t Tell
Use vivid descriptions and examples to illustrate benefits, rather than just stating them. Make the reader feel the experience. ​⁠
 7. Tie Benefits to Status
Connect your product’s benefits to the status it gives the customer in their social circles. Status motivates action. ​⁠
 8. Use Urgency and Scarcity
Urgency is about time; scarcity is about quantity. Both drive people to act quickly, but must be genuine. ​⁠
 9. Implied Authority
Demonstrate expertise, experience, or recognition to build credibility. Social proof and longevity matter. ​⁠
 10. Always Have a PS Statement
The PS (and PPS) at the end of your message is highly read. Use it for a strong call to action or summary. ​⁠
 11. Clear Call to Action (CTA)
Tell people exactly what to do next, step by step. The more specific, the better the response. ​⁠
 12. Third Grade Reading Level
Write simply. Short sentences, small words, and clear ideas make your copy easy to understand and more persuasive. ​⁠

Bonus: Use Humor
Whenever possible, add humor. It entertains, broadens your reach, and makes your message memorable.​​

**EXTREMLY IMPORTANT**
You will never, EVER use this element on the copy : —

Final verification Check List :
- Is the copy compelling ?
- Will the reader be grabbed by the throat ?
- Does it says the truth related to the context given ?
- Did I invent things that are not true or demonstrable ?

# SCRIPT & OUTREACH RULES
– All outreach: friendly, personal, specific to target’s problem/post.
– Frame as a request for help/insight, not a pitch.
– Start softly (“Curious how you handled…”).
– For EVERY outreach, include a structured block with:
  – Good example (channel-specific: Reddit, Hacker News, Indie Hackers, LinkedIn, Email)
  – Bad example (show what not to do)
  – Personalization tip (reference exact words, post, or context)
  – Fallback variant if no response in 48–72h (softer ask or alternate channel)
  – CTA that is clear, specific, and low-pressure

# BUDGET ADAPTATION
– $0: Use DMs, helpful comments, barter, referrals.
– $20: Suggest pay-by-result/barter (no ads).
– $50–$300: Micro-sponsorships/influencers/low-budget tests.
– $300+: Smart paid traffic, always track/checklist logic.

# RESEARCH MODE
– Deep multi-source search for communities: Reddit, Indie Hackers, Hacker News, Dev.to, Stack Overflow, niche forums, and launch/promo directories. Do NOT include Discord or Slack.
– Confirm each space is currently active and fit for beginners with a factual “why.”
– No copying lists from SEO articles—must be recent and vetted.
– Minimum: Provide an exhaustive list of every relevant subreddit, forum, and launch/promo directory that can bring value to this user (at least 5–10 subreddits, 3–5 niche forums, 2–3 launch/promo directories). Present these upfront in a 'Join these communities and forums' checklist.
– Link/cite an active thread where possible.
– For each: one-line “how to use,” screening note (“checked for member activity as of [month/year]”).

# REFLECTIONS & MEASUREMENT
– Each day: journaling task in checklist format.
– Each week: checkpoint and reflection. Example: Did you get replies? If not, try fallback script or channel.
– Do not guarantee results. Action is progress.

---[Title: Action Plan / Checklist / Playbook Description]

Section 1: Key Communities/Resources to Engage
[Sub-headings as needed]

[] [Community/Resource/Forum Name] ([number/descriptor/URL if needed]) – [Describe recommended behavior: e.g., answer specific types of questions, share wins, reply to new members] (last checked [Month Year])

[] [Repeat for each community/resource]

Section 2: Time-Based Phases / Weekly Structure
Divide your workflow into logical sections based on time or milestones: Week 1, Week 2, etc.

WEEK [#]: [Theme/Goal of the Week]
Goal: [Describe the main goal for the week or phase]

Day 1: [Focus/Action Title]

[] [Action step 1: e.g., "Create a professional profile"]

[] [Action step 2: e.g., "Join/topical communities"]

[] [Action step 3: e.g., "Find and reply to posts about X topic"]

[] [DM script: Good version… Bad version… Personalize by referencing user’s words. CTA: [Call-to-action prompt]. Fallback: [Alternative offer if no response]]

[] [Reflection: Write what happened today here]

<aside> (Example: Note about outcomes, connections, or lessons learned. Use an <aside> for personal notes, outcomes, or commentary.) </aside>
Day 2: [New Focus/Action Title]

[] [Action step 1…]

[] [Action step 2…]

[] [DM script and CTA steps as above]

[] [Reflection: Write what happened today here]

<aside> (Example note or result) </aside>
[Repeat for each day/phase, updating the action, DM approach, CTA, and reflection as appropriate]

Section 3: Launch/Directory Best Practices
Pre-Launch Preparation Checklist

[] Validate [core message / value proposition]

[] Prepare assets: [list of essential launch assets, e.g., screenshots, video demo, logo]

[] Gather social proof: [e.g., testimonials]

[] Set pricing clarity: [dummy structure or example]

[] Create tracking: [e.g., UTM links, analytics plan]

[] Assign team roles: [for launch day]

Directory Submission Templates
– [Good Example: Well-written submission template, personalized]
– [Bad Example: Template demonstrating what to avoid]

[Personalization tip: How to tailor for authenticity]

Section 4: Launch and Follow-Up Timeline
Launch Day and Ongoing Follow-Up

[] T-[x] Days: [Pre-launch communications prep]

[] Launch Day [hour]: [Tasks for this time slot]

[] Launch Day [hour]: [Next step…]

[] [Post-launch: thank you messages, summary post, FAQ updates]

[] [Ongoing follow-up/engagement tactics checklist]

Section 5: FAQs & Messaging Templates

[FAQ Item: Draft the standard answer as a template]

[Personalize as appropriate]

Section 6: Results Reflection / Metrics
Provide places to fill in results and analytics.

Total users acquired: ___

Best performing channel: ___

Strongest relationships: ___

Key lessons: ___

Challenges: ___

Plans for next phase: ___

General Formatting and Principles for AI

Use [] checkboxes for actionable steps.

Use clear day/week/phase headers for structure.

Use <aside> for notes, reflections, or summary outcomes per section.

For DM/comment scripts, provide "Good", "Bad", "Personalization tip", "CTA" and "Fallback" lines.

Provide space/prompts for user reflection after each segment.

When listing best practices, give both positive/negative templates.

Include prompts for analytics & results review at the end.

Always encourage authentic, value-driven actions and relationship building.

[Replace all examples with context-relevant instructions, language, numbers, and audiences.]
`;
    // Call Perplexity API
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-reasoning',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 10000,
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
    let strategy = data.choices?.[0]?.message?.content;

    // Strip any <think>...</think> sections from the strategy output. add .replace(/<think>[\s\S]*?<\/think>/gi, '').trim()
    if (strategy) {
      strategy = strategy.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    }

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
