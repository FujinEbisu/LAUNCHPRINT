import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.json();

    // Validate required fields
    if (!formData || Object.keys(formData).length === 0) {
      return NextResponse.json({ error: 'Form data is required' }, { status: 400 });
    }

  // Create comprehensive prompt for 1-month marketing strategy (using HeroMain form data)
const prompt =
`# IDENTITY
You are an expert marketing coach for absolute beginners. Your job:
– Create a step-by-step, hands-on, 1-month marketing program a complete beginner can follow without feeling overwhelmed.

# PERSONALIZATION
Use these business details to build a specific, tailored strategy:
– Product/Service: ${formData.productSimple || 'their product/service'}
– Target Customer: ${formData.idealCustomer || 'their target customers'}
– 6-Month Goal: ${formData.goal6mo || 'their business goals'}
– Monthly Budget: $${formData.marketingBudget || '0'}
– Main Competitors: ${formData.competitors || 'their competitors'}
– Key Differentiator: ${formData.differentiation || 'their unique value'}

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
(2) Week-by-week, day-by-day actionable tasks in checklist form.
(3) Personalized scripts/templates (good & bad versions) directly after each outreach—include fill-in-the-blank tip.
(4) Motivation: At the very top, one-sentence motivation.
(5) Daily/weekly intro or motivation tip before each day's tasks.
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

---
**EXAMPLE 1**
RESEARCH: Where Your Ideal Customers Hang Out
Reddit Communities (Post valuable advice, mention tool naturally)
- [ ] Join r/Entrepreneur (2.1M members) - Share marketing mistakes you learned (how to use: reply to fresh threads)
- [ ] Join r/SaaS (180k) - Answer "how do I market my SaaS" posts (how to use: filter by new)
- [ ] Join r/startups (1.5M) - Help with strategy questions (how to use: search "marketing" past 24h)
- [ ] Join r/solopreneurs (400k) - Share beginner-friendly tips (how to use: post 1 mini-guide/week)
- [ ] Join r/marketing (1.2M) - Answer beginner questions (how to use: offer 3-step advice)

Communities & Forums (Daily conversations; no Discord/Slack)
- [ ] Join IndieHackers.com - Check 'Growth' and 'Getting Started' daily; reply thoughtfully
- [ ] Join Dev.to - Follow 'marketing' and 'startup' tags; comment with tactical advice
- [ ] Participate on Hacker News (Ask HN/Show HN) - Share learnings and ask for feedback

Niche Forums (Weekly valuable contributions)
- [ ] MicroConf Connect Forum - Marketing section (how to use: post 1 actionable insight/week)
- [ ] GrowthHackers.com - Share beginner marketing wins (how to use: include steps)

Launch/Promo Sites (Submit when ready)
- [ ] Product Hunt - Plan launch for Week 4
- [ ] BetaList - Submit for early access buzz
- [ ] StartupStash - Add to marketing tools directory

WEEK 1: Foundation & Direct Feedback
Goal: Build credibility by helping others while learning what founders actually struggle with

Day 1: Research & Setup
- [ ] Create simple Reddit profile mentioning "helping new founders with marketing"
- [ ] Join r/Entrepreneur, r/SaaS, r/startups, r/solopreneurs
- [ ] Find 5 recent posts asking "how do I market my startup"
- [ ] Comment helpfully on each using:
  Hey! Marketing was my biggest fear too. What’s your biggest confusion right now - finding customers or knowing what to say?
- [ ] Reflection: Write what happened today here

Day 2: First Conversations
- [ ] Search "marketing" in r/startups from past 24 hours
- [ ] Reply to 3 posts with specific advice, end with:
  Happy to chat more if helpful. I’m building tools for exactly this problem.
- [ ] Send 2 DMs to people who replied positively (Good/Bad + CTA + Fallback):
  Good: Hey [Name], noticed you’re struggling with [specific thing]. Would a quick 10-15 min chat help? I’m mapping what works for founders like you.
  CTA: If yes, what’s a good time/day?
  Fallback (48-72h): Circling back. If a call isn’t ideal, I can send a 3-step written play you can try today. Want that?
  Bad: Check out my tool: [link]
  Personalization tip: Quote their exact line ("we don’t know where to start").
- [ ] Reflection: Write what happened today here

Day 3: Forum Exploration
- [ ] Sign up for IndieHackers.com
- [ ] Find "Show IH" posts about marketing tools from past week
- [ ] Leave thoughtful comments on 4 posts using:
  Love this approach! What’s been your biggest marketing challenge so far?
- [ ] Message 2 founders directly (Good/Bad + CTA + Fallback):
  Good: Saw your post about [specific challenge]. I’m working on something that might help - want to chat about what you tried?
  CTA: If you prefer async, I can DM a one-pager instead. Want it?
  Fallback (48-72h): Quick ping - I can share a template you can copy in 2 minutes.
  Bad: Please try my app.
- [ ] Reflection: Write what happened today here

Day 4: Indie Hackers Deep Dive
- [ ] Spend 20 minutes reading recent 'Marketing' and 'Growth' threads; note common questions
- [ ] Answer 2 questions using your experience (add CTA + fallback):
  I struggled with the exact same thing. Here’s what worked for me...
  CTA: Want me to send a 3-step checklist tailored to your case?
  Fallback (48-72h): If not now, can I share a one-pager you can save for later?
- [ ] Find 3 people asking marketing questions; send a polite PM (with CTA + fallback):
  Saw your thread about [specific]. Want to brainstorm solutions? I’m researching founder marketing challenges.
  CTA: Happy to swap notes async if easier—should I send a short outline?
  Fallback (48-72h): Quick bump—if now isn’t great, I can DM a template you can copy.
- [ ] Reflection: Write what happened today here

Day 5: Community Value
- [ ] Post in r/Entrepreneur: "5 marketing mistakes I made as a first-time founder (so you don’t have to)"
- [ ] Include real mistakes and lessons learned
- [ ] End with: "What’s your biggest marketing fear right now?"
- [ ] Reply to every comment with helpful advice
- [ ] Message 3 people who shared similar struggles (Good/Bad + CTA + Fallback):
  Good: Loved your comment about [specific struggle]. Want to chat solutions?
  CTA: If yes, I can suggest 3 steps tailored to your case.
  Fallback (48-72h): No worries—can I DM the steps instead?
  Bad: Try my app.
- [ ] Reflection: Write what happened today here

Week 1 Reflection
 Write what worked this week

 Count: How many meaningful conversations did you have?

 Which platforms felt most natural to you?

WEEK 2: Audience Building Through Helping
Goal: Scale conversations while building reputation as the "helpful marketing founder"

Day 8: Content That Helps
- [ ] Write a detailed reply to the top marketing question in r/SaaS from past week (mini-guide: Step 1, Step 2, Step 3)
- [ ] Include: "Building a tool for exactly this problem - happy to chat if you want to test ideas"
- [ ] Share in 2 relevant forum threads (IndieHackers 'Growth', Dev.to 'saas')
- [ ] DM 5 people who engaged (Good/Bad + CTA + Fallback):
  Good: Thanks for reading! What’s your current biggest marketing roadblock?
  CTA: Want me to send a 3-step fix tailored to you?
  Fallback (48-72h): If you prefer, I can post a short summary you can skim later.
  Bad: Please sign up here.
- [ ] Reflection: Write what happened today here

Day 9: Strategic Networking
 Find 5 recent “launched my startup” posts across Reddit

 Congratulate each with:

Congrats on launching! What’s your go-to-market plan? Happy to brainstorm if helpful

 Join MicroConf Connect, introduce yourself in marketing section

 Schedule 3 calls with founders from previous conversations

 Write what happened today here

Day 10: Problem Validation Calls
 Conduct 3 founder interviews (from Day 9 scheduling)

Ask: “Walk me through your current marketing process” and “What part feels most overwhelming?”

Take notes on exact words they use to describe problems

 Follow up each call:

Thanks for chatting! Based on what you said, I think [specific insight]. Does that sound right?

 Write what happened today here

Day 11: Community Leadership
 Post weekly “Marketing Help Thread” in r/startups:

Drop your marketing questions below – spending Friday helping fellow founders

 Answer every question thoroughly

 For best questions, reply:

This deserves a deeper conversation – want to hop on a quick call?

 Cross-post summary of common questions to IndieHackers

 Write what happened today here

Day 12: Relationship Building
 Message everyone you’ve helped:

Quick check-in – how’s the marketing going since we chatted?

 Share relevant resources based on their specific challenges

 Ask: “What would you want in a marketing tool? Like if you could wave a magic wand...”

 Schedule follow-up calls with 3 most engaged people

 Write what happened today here

Week 2 Reflection
 How many founder relationships do you now have?

 What problems do you hear most often?

 Which conversations led to the most interest?

WEEK 3: Trust & Soft Positioning
Goal: Position yourself as the solution while building genuine relationships

Day 15: Thought Leadership
 Write detailed post: “I interviewed 20 founders about marketing. Here’s what I learned”

Include real insights from your conversations

 Post in r/Entrepreneur, r/startups, IndieHackers

 End with: “Working on a solution for the #1 problem I heard. What would make the biggest difference for you?”

 Write what happened today here

Day 16: Tool Teasing
 Message 10 founders you’ve helped:

Remember when you mentioned [specific problem]? I’m building something that might help. Want an early look?

 Send simple description:

It’s a step-by-step marketing strategy builder designed specifically for founders with no marketing background

 Ask: “Does this sound useful? What questions do you have?”

 Set up 5 demo calls for next week

 Write what happened today here

Day 17: Social Proof Building
 Ask 3 favorite founder connections:

Would you be open to giving feedback on something I’m building?

 Show them your SaaS concept/demo, ask:

Would you pay for this? What’s missing? What’s confusing? Can I quote you saying [specific positive thing they said]?

 Write what happened today here

Day 18: Content Amplification
 Create “case study” post: “How [Founder Name] went from marketing confusion to clear strategy in 1 week”

Get permission to share their story (anonymized if needed)

Include specific before/after details

 End with: “This is exactly why I built [tool name]. Who else struggles with marketing clarity?”

 Cross-post to all active communities

 Write what happened today here

Day 19: Pre-Launch Buzz
 Message your most engaged contacts:

Launching my marketing tool next week. Want to be part of the founding user group?

 Offer:

You get lifetime access for early feedback. Fair trade?

 Create simple “early access” Google Form

 Share in forums & Q&A threads (IndieHackers, Dev.to, relevant subreddits): “Built this for founders like us. Anyone want early access?”
CTA: "Drop your email in this form and I’ll send you the setup guide."
Fallback (48–72h): "No pressure—want a 2-minute Loom overview first?"

 Write what happened today here

Week 3 Reflection
 How many people expressed interest in your tool?

 What feedback themes keep coming up?

 Who are your biggest supporters so far?

WEEK 4: Launch & First Sales
Goal: Convert relationships into early users while maintaining helpful approach

Day 22: Soft Launch Preparation
 Create simple launch post:

After helping 50+ founders with marketing, I built the tool I wish I had

Include problem, solution, and “early access” call-to-action

 Message 20 engaged contacts:

Launching [tool name] tomorrow. Would love your support sharing it!

 Prepare ProductHunt launch for Day 24

 Write what happened today here

Day 23: Community Launch
 Post launch announcement in r/SaaS, r/Entrepreneur:

Built marketing strategy tool after talking to 50+ confused founders

Include: “Problem: Marketing felt impossible. Solution: Step-by-step strategy builder. Early access available”

 Answer every comment and question

 Share in forums & Q&A communities with:

Finally launching the thing! Built it based on all your feedback

 Write what happened today here

Day 24: ProductHunt Launch
 Submit to ProductHunt

 Message all contacts:

We’re live on ProductHunt! Would mean the world if you could check it out: [link]

 Post in communities:

We’re on ProductHunt today! Built this for founders who find marketing overwhelming

 Respond to every ProductHunt comment

 Track: How many signups today?

 Write what happened today here

Day 25: Conversion Focus
 Follow up with everyone who signed up:

Welcome! What’s your #1 marketing challenge right now?

 Send personal video walkthrough to first 10 users

 Ask early users:

Would you recommend this to other founder friends? Anyone specific come to mind?

 Create simple referral system:

Get [benefit] for each friend who signs up

 Write what happened today here

Day 26: Momentum Building
 Share early user wins:

User X just said: [testimonial]. This is exactly why I built this!

 Message warm contacts who haven’t signed up:

Quick question – what’s holding you back from trying [tool]?

 Address objections directly

 Create FAQ post based on common questions

 Write what happened today here

Week 4 Reflection
 How many users did you get?

 What conversion rate from conversations to signups?

 Which acquisition channel worked best?

MONTH 1 FINAL REFLECTION
 Total users acquired:

 Best performing channel:

 Strongest relationships built:

 Biggest lesson learned:

 Plan for Month 2:

Scripts for Outreach
Reddit Comment Template:

Hey [name]! Had the exact same struggle. Here’s what helped me: [specific advice]. What’s your biggest confusion – finding customers or knowing what to say? Happy to chat more if helpful!

DM Follow-up:

Saw your comment about [specific challenge]. I’m researching this exact problem for founders. Want to hop on a quick 15-min call to brainstorm? I’d love to hear more about what you’ve tried.

Launch Message:

After 100+ conversations with confused founders, I built the marketing strategy tool I wish I had starting out. Takes you from "I have no idea how to market" to clear step-by-step plan. Want early access?

Follow-up for Signups:

Welcome to [tool name]! Quick question – what’s your biggest marketing challenge right now? Want to make sure you get the most value from this.
---

**EXAMPLE 2**
### **Week 1: Community Building & Research**

**Goal:** Establish presence in key entrepreneur communities and gather insights on SaaS launch challenges.

### **Day 1**

- [ ] Join 3 active entrepreneur communities:
  - **r/Entrepreneur** (how to use: read top posts, reply to 2 threads about SaaS challenges)
  - **r/SaaS** (how to use: search "launch struggles", engage with 1 post)
  - **r/startups** (how to use: find "minimum viable product" threads)
- [ ] DM 1 person in r/SaaS who mentioned struggling with launch delays. Good/Bad + CTA + Fallback:

    > "Hi [Name], saw your post about [specific struggle, e.g., 'delayed MVP launch']. I’m building a tool to help entrepreneurs get to market faster—would love to hear what tripped you up!"
    >
    >
  > CTA: "If helpful, I can share a 3-step checklist. Want it?"
  >
  > Fallback (48-72h): "If now’s not ideal, I can DM a quick summary you can try later."
  >
  > *Bad script:* "Check out my SaaS launcher!"
    >
    > *Personalization tip:* Reference their exact words from the post.
    >

### **Day 2**

- [ ]  Create an account on **Dev.to** (how to use: follow 'saas' and 'startup' tags, introduce yourself on your profile).
- [ ]  Comment on 2 recent posts about launch timelines; DM 1 author on Dev.to.*Good script:*

  > "Hey [Name], noticed your post about [topic]. I’m tackling the same pain point. What’s been the biggest hurdle for you so far?"
  >
  > CTA: "If helpful, I can share a short checklist tailored to your case—want it?"
  >
  > Fallback (48–72h): "If now’s not ideal, I’ll leave you a 3-step summary you can try anytime—sound good?"
    >
    >
  > *Bad script:* "Use my tool!"
    >
  > *Tip:* Use their exact phrasing to build rapport.
    >

### **Day 3**

- [ ]  Create a **"SaaS Launch Checklist"** (list 5 quick wins for entrepreneurs).
- [ ]  Share checklist in r/SaaS with a post like:

    > "Launched a SaaS? Here’s what I wish I knew about speeding up MVP deployment [checklist link]."
    >

### **Checkpoint**

- [ ]  Got replies? Great! If not, try **Indie Hackers** instead:*Script fallback:*

    > "Hi [Name], saw your IH post about [challenge]. I’m solving [specific pain point]—any tips on what you’d prioritize first?"
    >

---

### **Week 2: Outreach & Content**

**Goal:** Leverage content to attract leads and position as an expert.

### **Day 4**

- [ ]  Join **Hacker News** (how to use: comment on "Ask HN" threads about SaaS launches).
- [ ]  Reply to 2 HN comments with actionable advice (e.g., "I’ve seen [specific tactic] work for rapid launches").

### **Day 5**

- [ ]  Write a **"5 Mistakes SaaS Founders Make When Launching"** blog post (keep it short).
- [ ]  Share in r/Entrepreneur and r/startups.

### **Day 6**

- [ ]  DM 3 LinkedIn connections in the SaaS niche.*Good script:*

  > "Hi [Name], I’m helping entrepreneurs launch SaaS faster. What’s the #1 bottleneck you’ve seen in your own launches?"
    >
    >
  > CTA: "If you want, I can share a 2-minute playbook for that bottleneck."
  >
  > Fallback (48–72h): "If DMs are noisy, I can email a one-pager instead—what’s best?"
  >
  > *Bad script:* "Want a demo?"
    >
    > *Tip:* Mention a mutual connection or post.
    >

### **Checkpoint**

- [ ]  No traction? Try **Twitter** (search #SaaS or #Startup).*Script fallback:*

    > "Hey [Name], loved your tweet about [topic]. I’m solving [specific problem]—what’s been your biggest hurdle?"
    >

---

### **Week 3: Engagement & Feedback**

**Goal:** Build relationships and gather feedback to refine messaging.

### **Day 7**

- [ ] Host a **"SaaS Launch AMA"** in r/SaaS (how to use: ask for questions, offer free advice).
- [ ] Share AMA link on IndieHackers ('Help' tag) and a relevant subreddit (e.g., r/Entrepreneur).

### **Day 8**

- [ ]  DM 2 AMA participants with follow-up questions.*Good script:*

  > "Hi [Name], thanks for your AMA question about [topic]. I’d love to hear more about [specific pain point]—what’s your biggest fear?"
  >
  > CTA: "Want me to send a 3-step checklist you can try this week?"
  >
  > Fallback (48–72h): "No worries if busy—can I DM a short template you can copy?"
    >
    >
  > *Tip:* Use their question as a conversation starter.
    >

### **Day 9**

- [ ]  Share a case study on **IndieHackers.com** 'Show IH' or **Dev.to**: "How [Name] Launched in [X Days]."

### **Checkpoint**

- [ ]  Still stuck? Try **Reddit’s r/growthhacking** (how to use: ask for feedback on your checklist).

---

### **Week 4: Scaling & Referrals**

**Goal:** Turn early wins into referrals and systematize outreach.

### **Day 10**

- [ ]  Create a **referral template** for satisfied users:

    > "Hi [Name], [User] helped me launch faster—thought you’d benefit too!"
    >
- [ ]  Ask 1 happy user to share it.

### **Day 11**
- [ ]  Post in **r/EntrepreneurRideAlong** or **r/SmallBusiness** (how to use: share a growth hack with tactical steps).
- [ ]  Post: "How to reduce launch time by [X]% using [your tool]."

### **Day 12**

- [ ]  DM 5 new LinkedIn connections.*Good script:*

    > "Hi [Name], I’m helping SaaS founders avoid [specific problem]. What’s your biggest launch concern?"
    >

### **Checkpoint**

- [ ]  No replies? Try [**quora.com**](http://quora.com/) (search "SaaS launch challenges").

---

### **Week 5: Content Repurposing & Outreach**

**Goal:** Maximize content reach and diversify outreach channels.

### **Day 13**

- [ ]  Repurpose blog post into a **video script** (record a 2-min explainer).
- [ ]  Share on TikTok/Reels (target #SaaS).

### **Day 14**

- [ ]  Create an account on **Lobsters** (if dev audience) or **Makerlog** (how to use: introduce yourself, share your video, ask: "What’s your biggest launch hurdle?")

### **Day 15**

- [ ]  DM 3 forum members (IndieHackers/Dev.to) who asked about pricing.*Good script:*

    > "Hi [Name], saw your question about [pricing strategy]. I’ve helped others reduce costs by [X]—want to share insights?"
    >

---
**EXAMPLE 3**
**Week 1: Validate & Research**

*Focus: Get early feedback, map competitors, identify niche communities*

**Day 1: Competitor Analysis**

[] Join 3 competitor communities (e.g., Appwrite GitHub Discussions, Vercel Community Forum)

[] Observe pain points in discussions – note common complaints

[] Post in r/webdev: "What's your biggest backend pain point?" (track replies)

[] "Write what happened today here"

**Day 2: Early User Outreach**

[] DM 5 developers on LinkedIn with:

"Hi [Name], I'm building BackAnt to eliminate backend boilerplate. Would you test it and share honest feedback? I'll give you lifetime access if you help shape the product."

[] Post on Hacker News: "I'm solving backend dev pain – need beta testers" (link to free trial)

[] "Write what happened today here"

**Day 3: Niche Community Mapping**

[] Research 10 niche communities (see below)

[] Create list of active micro-communities for later outreach

[] "Write what happened today here"

**Day 4: Content Foundation**

[] Draft 5 "problem-solution" social posts (e.g., "Tired of API boilerplate? BackAnt generates & deploys in minutes")

[] Create "Backend in 5 Minutes" demo video (record browser workflow)

[] "Write what happened today here"

**Day 5: Feedback Loop**

[] Send personalized email to 3 tech friends:

"Hey [Name], I need your honest take – BackAnt aims to cut backend dev time. Can we hop on a 10-min call? I'll owe you a coffee!"

[] "Write what happened today here"

**Day 6: Competitor Gap Analysis**

[] Identify 3 gaps in competitors (e.g., deployment speed, mobile access)

[] Draft differentiation statement: "BackAnt vs [Competitor]: [Gap] solved"

[] "Write what happened today here"

**Day 7: Reflection & Plan**

[] Review week: What worked? What gaps exist?

[] "Write what happened today here"

---

**Week 2: Audience Building**

*Focus: Establish presence in niche communities & start conversations*

**Day 8: Community Engagement**

[] Post in r/SaaS: "How do you handle rapid backend iteration? BackAnt helps teams deploy APIs faster." (link to demo)

[] Comment on 3 relevant posts in r/startups with value-add replies

[] "Write what happened today here"

**Day 9: Content Distribution**

[] Share demo video in r/webdev: "Watch: Backend in 5 minutes"

[] Post "Backend Pain Points" poll in [Dev.to](http://dev.to/) with BackAnt solution in comments

[] "Write what happened today here"

**Day 10: Micro-Influencer Outreach**

[] DM 3 micro-influencers (1k-10k followers) with:

"Hi [Name], I love your content on [topic]. Would you test BackAnt and share your thoughts? I'll give you a free lifetime account + feature your review."
CTA: If yes, I can send a 2-minute Loom today.
Fallback (48-72h): If now isn’t great, can I send a short write-up you can skim later?

[] "Write what happened today here"

**Day 11: Collaboration Opportunities**

[] Offer cross-promotion to 2 complementary tools:

"Hi [Tool], I'm building BackAnt to solve [problem]. Would you collaborate on a case study? We'll highlight how our tools work together."

[] "Write what happened today here"

**Day 12: Community Participation**

[] Answer 3 backend-related questions on Stack Overflow with subtle BackAnt mentions

[] Join 2 niche forums or GitHub Discussions groups and participate in 1 discussion

[] "Write what happened today here"

**Day 13: Feedback Review**

[] Analyze responses from early outreach: Common themes? Adjust messaging

[] "Write what happened today here"

**Day 14: Reflection & Adjust**

[] Track: How many meaningful conversations started?

[] "Write what happened today here"

---

**Week 3: Trust & Engagement**

*Focus: Build credibility through social proof & education*

**Day 15: Case Study Creation**

[] Document 1 user's success: "How [Name] Built API in X Minutes"

[] Share in r/SaaS and [Dev.to](http://dev.to/) with: "Real user story: [Link]"

[] "Write what happened today here"

**Day 16: Educational Content**

[] Create "5 Backend Mistakes Devs Make" guide with BackAnt solutions

[] Share in r/programming and LinkedIn groups

[] "Write what happened today here"

**Day 17: Webinar Prep**

[] Schedule "Backend in 5 Minutes" demo webinar (free tool like Zoom)

[] Promote in r/webdev: "Join live demo: Solve backend pain fast"

[] "Write what happened today here"

**Day 18: User Spotlight**

[] Feature a user: "Meet [Name], who saved 20hrs with BackAnt" (share their quote)

[] Tag them on social media for visibility

[] "Write what happened today here"

**Day 19: Community Challenges**

[] Host "Backend Challenge" in r/webdev: "Solve this API problem fastest" (BackAnt as solution)

[] Offer free trial to participants

[] "Write what happened today here"

**Day 20: Trust Signals**

[] Add "Used by [X] Developers" to website (even if small)

[] Create "BackAnt vs Competitors" comparison table

[] "Write what happened today here"

**Day 21: Reflection & Refine**

[] Track: How many case studies shared? Engagement levels?

[] "Write what happened today here"

---

**Week 4: Conversion & Traction**

*Focus: Convert engaged audience to users & leverage referrals*

**Day 22: Free Trial Push**

[] Email list: "Limited free trials available – claim yours"

[] Post in r/SaaS: "First 50 get free access to BackAnt"

[] "Write what happened today here"

**Day 23: Referral Incentives**

[] Launch referral program: "Refer 2 friends → 1 month free"

[] Share in all communities: "Help us grow – get rewarded"

[] "Write what happened today here"

**Day 24: Testimonial Campaign**

[] Ask 3 users: "Would you record a 30-sec video testimonial?"

[] Offer free premium feature in exchange

[] "Write what happened today here"

**Day 25: Final Outreach**

[] DM 10 inactive leads: "Hi [Name], just checking in – need help with backend?"

[] "Write what happened today here"

**Day 26: Launch Prep**

[] Finalize Product Hunt/BetaList launch plan (free tier)

[] Prepare "100 Users" milestone announcement

[] "Write what happened today here"

**Day 27: Conversion Review**

[] Track: Free trials → paid conversions. Identify drop-off points

[] "Write what happened today here"

**Day 28: Reflection & Plan Next Steps**

[] Review month: Wins? Misses?

[] "Write what happened today here"

---

**RESEARCH OUTPUT: Top Communities & Promo Sites**

1. **r/SaaS**: Share problem-solving posts, engage in discussions, link to BackAnt in context.
2. **r/webdev**: Post demos, answer backend questions, use "Watch: [Topic]" format.
3. [**Dev.to**](http://dev.to/): Share case studies, participate in backend discussions.
4. **Hacker News**: Post updates with "I'm building..." intros.
5. **Product Hunt**: Launch with detailed "How It Works" section.
6. **BetaList**: Submit with clear USP: "Deploy APIs in minutes."
7. **r/AI**: Discuss AI-powered backend solutions.
8. **Stack Overflow**: Answer backend questions with subtle BackAnt mentions.
9. **r/startups**: Engage in "tools we use" threads.
10. **r/programming**: Share educational content.

**PROMO SITES**:

- **Product Hunt**: Submit with demo video and testimonials.
- **BetaList**: Highlight "No Code Required" feature.
- **GrowthHackers**: Share referral program strategies.

---

**SCRIPTS & TEMPLATES**

**Competitor Community Post**:

"Hi everyone, I'm [Name] from BackAnt. I noticed discussions about [specific pain point]. We're solving this by [briefly explain BackAnt]. Would anyone like to test it?"

**Micro-Influencer DM**:

"Hi [Name], I love your content on [topic]. Would you test BackAnt and share your thoughts? I'll give you a free lifetime account + feature your review."
CTA: "If yes, I can send a 2-minute Loom today."
Fallback (48–72h): "If now’s not great, can I send a short write-up you can skim later?"

**Referral Program Announcement**:

"Help us grow! Refer 2 friends to BackAnt and get 1 month free. Share your unique link: [URL]."
CTA: "Have 1–2 folks in mind? I can draft the intro for you."

**Skip Generic Tasks:**
- If user has a site/audience, skip “build a site” or “post first tweet”—focus on traction.

**Audience Building:**
- Use proven, action-driven strategies only; set outreach number targets, AND always instruct where/what/how.

---

**Checklist for Output QA:**
– Are all items Markdown checklists?
– Does every outreach have good/bad/examples and a personalization tip?
– Are reflections and platform instructions included?
– Are all actions possible for a total beginner?
– All steps are actionable, concrete, and copy-paste ready.

---

*Be absolutely concrete, zero fluff. Every step actionable today and easy to transfer as Markdown.*
 Be 100% concrete, friendly, zero-fluff. Make sure every step is actionable *today* and easy to copy-paste as Markdown.

---

**EXAMPLE 4: Launch Directory Best Practices & Examples**

Launch Directory Best Practices (Do this first)
- [ ] Validate messaging: One-liner, who it’s for, core benefit, 3 proof points
- [ ] Prep assets: 3 screenshots (desktop/mobile), 1 logo, 1 short video (30–60s)
- [ ] Social proof: 2 quotes from early users (with permission)
- [ ] Clear pricing note: Free/trial details and what’s included
- [ ] Tracking: Create simple UTM set for directories (ph, bl, ih)
- [ ] Support plan: Assign who replies to comments within 5–10 minutes

Submission Templates (Good vs Bad + Personalization Tip)
- [ ] Product Hunt (Good)
  "Built [tool] for [who] who struggle with [pain]. It gives you [core benefit] without [common obstacle]. Today we’re sharing v1 to get your feedback. Because [reason why now]."
  CTA: "If this solves a pain you’ve felt, what would you add or change?"
  Fallback (48–72h): "If you prefer a skim, here’s a 3-step overview: [Title](URL)"
  Bad: "New app, please upvote!"
  Tip: Reference a real conversation or thread that sparked the build.

- [ ] BetaList (Good)
  "Early access for [who]. Get [benefit] in [timeframe] with [feature]. Looking for 10 honest testers who will try a 10-minute setup and tell us what’s confusing."
  Bad: "Join my waitlist!"
  Tip: Mention a tiny incentive tied to feedback, not generic rewards.

- [ ] Indie Hackers Launch (Good)
  "I interviewed [N] founders who said [quote]. I built [tool] to fix that. Here’s the exact workflow and a 2-min demo."
  Bad: "Launching my startup today!"
  Tip: Link to a previous IH comment/post to show you’re a real participant.

Timeline & Day-of Checklist
- [ ] T-3 Days: DM warm contacts: "Launching on [date]; can I ask for eyes on copy?"
- [ ] T-1 Day: Finalize assets, draft 5 answers for FAQs (pricing, roadmap, integrations, privacy)
- [ ] Launch Day Morning: Post early; reply to every comment within 5–10 minutes
- [ ] Midday: Share a comment summarizing top questions + your answers
- [ ] End of Day: Thank-you comment with what you learned and what’s next

Follow-up Tactics
- [ ] DM new signups: "What were you hoping this would do for you?"
- [ ] Send 2-minute personalized Loom to top 10 signups
- [ ] Post a day-2 recap: "What we learned from launch day" with concrete changes
- [ ] Create a simple referral offer: "Invite 2 friends → unlock [benefit]"

Launch FAQ Seeds (Fill-in-the-blank)
- [ ] Pricing: "We’re free while validating [X]; paid will include [Y]."
- [ ] Roadmap: "Next 2 weeks: [feature A/B]. Vote here: [Title](URL)"
- [ ] Privacy: "We store [data types], no [excluded types]. Delete anytime."
- [ ] Integrations: "Works with [tools]; building [next]."

Results Note
- [ ] Always say: "Results will vary; momentum and feedback come from steady action."

`;



    // Call Perplexity API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 600000); // 10 minute timeout

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'sonar-reasoning',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 15000,
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

    clearTimeout(timeoutId);

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

    // Handle specific timeout errors
    if (error instanceof Error) {
      if (error.name === 'AbortError' || error.message.includes('timeout')) {
        return NextResponse.json({
          error: 'Request timed out. The strategy generation is taking longer than expected. Please try again.'
        }, { status: 408 });
      }

      if (error.message.includes('fetch failed') || error.message.includes('Headers Timeout')) {
        return NextResponse.json({
          error: 'Network error occurred. Please check your connection and try again.'
        }, { status: 503 });
      }
    }

    return NextResponse.json({
      error: 'Something went wrong. Please try again.'
    }, { status: 500 });
  }
}
