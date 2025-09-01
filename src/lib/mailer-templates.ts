
export type Plan = 'free' | 'starter' | 'pro'

export interface TemplateResult { subject: string; html: string; text: string }

const BRAND = {
  name: 'LaunchPrint',
  primary: '#000000',
  accent: '#FF4306'
}

function layout(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html><html><head><meta charSet="utf-8"/><title>${title}</title></head><body style="margin:0;padding:0;background:#ffffff;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#000;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;">
    <tr><td align="center">
      <table width="600" style="max-width:600px;border:4px solid #000;padding:32px;background:#fff;font-size:15px;line-height:1.5;">
        <tr><td style="font-size:28px;font-weight:700;letter-spacing:-1px;padding-bottom:16px;">${BRAND.name}</td></tr>
        ${bodyHtml}
        <tr><td style="padding-top:40px;font-size:12px;color:#111;border-top:2px solid #000;margin-top:32px">© ${new Date().getFullYear()} ${BRAND.name}. All rights reserved.</td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

function upsell(plan: Plan, priceMap: { starterMonthly?: string; proMonthly?: string }): string {
  if (plan === 'pro') return ''
  const blocks: string[] = []
  if (plan === 'free') {
    blocks.push(`<div style='border:2px solid #000;padding:16px;margin-top:24px'>
      <div style='font-weight:700;font-size:18px;margin-bottom:8px'>Upgrade & Unlock More</div>
      <div style='margin-bottom:12px'>Starter: 25 strategies/mo. Pro: 75 strategies/mo + data retention.</div>
      <div>
  <a href="${priceMap.starterMonthly ? upgradeLink('starter', priceMap.starterMonthly) : '#'}" target="_blank" rel="noopener noreferrer" style='display:inline-block;margin-right:12px;background:#000;color:#fff;padding:10px 16px;text-decoration:none;font-weight:600;border:2px solid #000'>Starter →</a>
  <a href="${priceMap.proMonthly ? upgradeLink('pro', priceMap.proMonthly) : '#'}" target="_blank" rel="noopener noreferrer" style='display:inline-block;background:#fff;color:#000;padding:10px 16px;text-decoration:none;font-weight:600;border:2px solid #000'>Pro →</a>
      </div>
    </div>`)
  } else if (plan === 'starter') {
    blocks.push(`<div style='border:2px solid #000;padding:16px;margin-top:24px'>
      <div style='font-weight:700;font-size:18px;margin-bottom:8px'>Go Pro</div>
      <div style='margin-bottom:12px'>Pro: 75 strategies/mo + advanced retention.</div>
      <div>
  <a href="${priceMap.proMonthly ? upgradeLink('pro', priceMap.proMonthly) : '#'}" target="_blank" rel="noopener noreferrer" style='display:inline-block;background:#000;color:#fff;padding:10px 16px;text-decoration:none;font-weight:600;border:2px solid #000'>Upgrade to Pro →</a>
      </div>
    </div>`)
  }
  return blocks.join('')
}

function upgradeLink(tier: string, priceId: string) {
  return `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/mailing/upgrade-link?tier=${tier}&priceId=${priceId}`
}

// Individual template builders
export const templates = {
  indoctrination1: (ctx: { name?: string }): TemplateResult => {
    const subject = 'Welcome to LaunchPrint!'
  const htmlBody = `<tr><td style='font-size:16px'>Hey ${ctx.name || 'there'},<br/><br/>Welcome to LaunchPrint! We're excited to have you join our community.<br/><br/>Our story began with a simple idea: help creators launch faster and smarter. We believe momentum beats perfection, and every strategy shipped is a step forward.<br/><br/>In the coming days, you'll get tips, stories, and proven tactics to help you build and grow.<br/><br/><strong>What to expect:</strong><ul><li>Actionable strategies</li><li>Customer success stories</li><li>Exclusive offers</li></ul><br/>Ready to get started? <a href='https://launch-print.com' style='color: var(--accent);font-weight:600'>Create your first strategy →</a><br/><br/>Join our Discord: <a href='https://discord.gg/hKerXV7E' style='color: var(--accent);font-weight:600'>Join NOW !</a></td></tr>`
    return { subject, html: layout(subject, htmlBody), text: 'Welcome to LaunchPrint! Our story, what to expect, and your first step.' }
  },
  welcome: (ctx: { name?: string; plan: Plan; priceMap: Record<string,string|undefined> }): TemplateResult => {
    const subject = `Welcome to ${BRAND.name}—Let\'s Make Your First Lead Real`
    const htmlBody = `<tr><td><h2 style='font-size:22px;font-weight:700'>Welcome to ${BRAND.name}—Let${'&apos;'}s Make Your First Lead Real</h2>
    <p style='font-size:16px'>
      Hey ${ctx.name || 'there'},<br /><br />
      You did it. You took the one step most people never will: you started.<br /><br />
      Don${'&apos;'}t worry, you${'&apos;'}re not alone. If you feel lost, overwhelmed, or just sick of fake gurus promising magic tricks, you${'&apos;'}re exactly who I built ${BRAND.name} for.<br /><br />
      I know what it${'&apos;'}s like to sit on the other side of the screen—questioning every move, wasting time on marketing &ldquo;hacks,&rdquo; and stalling because you don${'&apos;'}t know who to ask. That${'&apos;'}s over now.<br /><br />
      <strong>Here${'&apos;'}s what happens next:</strong><br /><br />
      Head over to your profile and fire up the Strategy Generator.<br />
      Just answer a few real-world questions about your business (don${'&apos;'}t overthink it—I${'&apos;'}ve made it super simple). Out comes your personalized plan: daily tasks that build momentum and get you in front of real customers. You${'&apos;'}ll have your first lead—and a whole lot more confidence—before you know it.<br /><br />
      <strong>Why does it work?</strong><br />
      Because I turned real failure into a framework that doesn${'&apos;'}t need marketing talent, just action. If I could do it from zero, you can too.<br /><br />
      If anything trips you up, reply to this email (I read every message) or join the comunity on Discord.<br /><br />
  <a href='https://launch-print.com' style='color:${BRAND.accent};font-weight:600;text-decoration:underline'>Go to Launch-Print →</a><br /><br />
      Let${'&apos;'}s do this—together.<br /><br />
      <strong>PS:</strong><br />
      Check your profile now. Your first plan is waiting, and your future customers aren${'&apos;'}t going to wait forever.
    </p>
    ${upsell(ctx.plan, ctx.priceMap)}</td></tr>`
    return { subject, html: layout(subject, htmlBody), text: subject }
  },
  subscriptionActive: (ctx: { plan: Plan; previous?: Plan; price?: string; priceMap: Record<string,string|undefined> }): TemplateResult => {
    const subject = ctx.previous && ctx.previous !== ctx.plan ? `Plan updated: ${ctx.previous} → ${ctx.plan}` : `Your ${ctx.plan} plan is active`
    const htmlBody = `<tr><td style='font-size:16px'>Your ${ctx.plan.toUpperCase()} plan is now active.${ctx.previous && ctx.previous!==ctx.plan ? ` (Previously ${ctx.previous})` : ''}<br/>Go build strategies now.<br/>${upsell(ctx.plan, ctx.priceMap)}</td></tr>`
    return { subject, html: layout(subject, htmlBody), text: subject }
  },
  paymentFailed: (ctx: { plan: Plan; reason?: string; priceMap: Record<string,string|undefined> }): TemplateResult => {
    const subject = 'Payment failed – action required'
    const htmlBody = `<tr><td style='font-size:16px'>Your recent payment attempt failed${ctx.reason ? `: ${ctx.reason}` : ''}.<br/>Please update your payment method to keep access.<br/>${upsell(ctx.plan, ctx.priceMap)}</td></tr>`
    return { subject, html: layout(subject, htmlBody), text: 'Payment failed.' }
  },
  subscriptionCanceled: (ctx: { plan: Plan; priceMap: Record<string,string|undefined> }): TemplateResult => {
    const subject = 'Subscription canceled'
    const htmlBody = `<tr><td style='font-size:16px'>Your subscription has been canceled. You retain access until period end. We hope to see you again.<br/>${upsell(ctx.plan, ctx.priceMap)}</td></tr>`
    return { subject, html: layout(subject, htmlBody), text: subject }
  },
  planChanged: (ctx: { oldPlan: Plan; newPlan: Plan; priceMap: Record<string,string|undefined> }): TemplateResult => {
    const subject = `Plan changed: ${ctx.oldPlan} → ${ctx.newPlan}`
    const htmlBody = `<tr><td style='font-size:16px'>You moved from ${ctx.oldPlan.toUpperCase()} to ${ctx.newPlan.toUpperCase()}. ${ctx.newPlan === 'pro' ? 'Enjoy the full power.' : ''}${upsell(ctx.newPlan, ctx.priceMap)}</td></tr>`
    return { subject, html: layout(subject, htmlBody), text: subject }
  },
  genericTest: (): TemplateResult => {
    const subject = 'Test email'
    const htmlBody = `<tr><td style='font-size:16px'>This is a test email.</td></tr>`
    return { subject, html: layout(subject, htmlBody), text: 'Test email.' }
  },
  internalSaleNotice: (ctx: { email: string; plan: Plan; amount?: string }): TemplateResult => {
    const subject = `NEW SALE: ${ctx.plan.toUpperCase()} ${ctx.amount ? `(${ctx.amount})` : ''}`
    const htmlBody = `<tr><td style='font-size:16px'>You have a new subscriber!<br/>Email: ${ctx.email}<br/>Plan: ${ctx.plan}${ctx.amount ? `<br/>Amount: ${ctx.amount}` : ''}</td></tr>`
    return { subject, html: layout(subject, htmlBody), text: subject }
  },
  internalPaymentFailed: (ctx: { email: string; plan: Plan; reason?: string }): TemplateResult => {
    const subject = `PAYMENT FAILED: ${ctx.plan.toUpperCase()} ${ctx.email}`
    const htmlBody = `<tr><td style='font-size:16px'>Payment failed for ${ctx.email}<br/>Plan: ${ctx.plan}${ctx.reason ? `<br/>Reason: ${ctx.reason}` : ''}</td></tr>`
    return { subject, html: layout(subject, htmlBody), text: subject }
  },
  internalCancellation: (ctx: { email: string; plan: Plan }): TemplateResult => {
    const subject = `CANCELLATION: ${ctx.plan.toUpperCase()} ${ctx.email}`
    const htmlBody = `<tr><td style='font-size:16px'>Cancellation received for ${ctx.email}, plan ${ctx.plan}.</td></tr>`
    return { subject, html: layout(subject, htmlBody), text: subject }
  }
  ,
  internalPlanChange: (ctx: { email: string; oldPlan: Plan; newPlan: Plan }): TemplateResult => {
    const subject = `PLAN CHANGE: ${ctx.oldPlan.toUpperCase()} → ${ctx.newPlan.toUpperCase()} ${ctx.email}`
    const htmlBody = `<tr><td style='font-size:16px'>Plan change for ${ctx.email}<br/>From: ${ctx.oldPlan} → ${ctx.newPlan}</td></tr>`
    return { subject, html: layout(subject, htmlBody), text: subject }
  }
    ,
    first50Lifetime: (ctx: { name?: string }): TemplateResult => {
      const subject = 'You’re #50! Claim Your Lifetime 50% Off Starter Plan'
      const htmlBody = `<tr><td style='font-size:16px'>
        Hi ${ctx.name || 'Launcher !'},<br/><br/>
        Thank you—fifty times over!<br/><br/>
        Seriously, you’re the 50th pioneer on Launch-Print. That means a lot to me, because every single person who signs up proves there are more people like us -willing to try, to build, and to win.<br/><br/>
        To say thanks, I want to give you something just for being here:<br/><br/>
        <strong>Your personal code: <span style='background:#FF4306;color:#fff;padding:2px 8px;border-radius:4px;font-weight:700'>FIRST50</span> -good for 50% off the Starter plan, for life.</strong><br/><br/>
        Just head to the Starter plan checkout, enter your code, and enjoy lifetime access for half the price.<br/><br/>
        <strong>And here’s some good news:</strong><br/>
        Because you’re one of the first 50, you get to share this code with a friend or fellow builder. That’s right -100 people, each with a shot at turning action into real results.<br/><br/>
        <a href='https://launch-print.com/pricing' style='color:${BRAND.accent};font-weight:600;text-decoration:underline'>Ready to level up? Upgrade to Starter →</a><br/><br/>
        Want to share the code? Just forward this email, and tell them to use <strong>FIRST50</strong> while it lasts.<br/><br/>
        You made Launch-Print what it is. Thank you for being part of Day One. Let’s build something great.<br/><br/>
        If you have questions, just hit reply -I’m here.<br/><br/>
        <strong>PS:</strong><br/>
        This lifetime code is only good for the first 50 users and their plus-ones. When it’s gone, it’s gone. Don’t wait.
      </td></tr>`
      const text = `You’re #50! Claim Your Lifetime 50% Off Starter Plan\n\nHi ${ctx.name || '[username]'},\n\nThank you—fifty times over!\n\nSeriously, you’re the 50th pioneer on Launch-Print. That means a lot to me, because every single person who signs up proves there are more people like us—willing to try, to build, and to win.\n\nTo say thanks, I want to give you something just for being here:\n\nYour personal code: FIRST50—good for 50% off the Starter plan, for life.\n\nJust head to the Starter plan checkout, enter your code, and enjoy lifetime access for half the price.\n\nAnd here’s some good news:\nBecause you’re one of the first 50, you get to share this code with a friend or fellow builder. That’s right—100 people, each with a shot at turning action into real results.\n\nReady to level up? Upgrade to Starter\n\nWant to share the code? Just forward this email, and tell them to use FIRST50 while it lasts.\n\nYou made Launch-Print what it is. Thank you for being part of Day One. Let’s build something great.\n\nIf you have questions, just hit reply—I’m here.\n\nPS:\nThis lifetime code is only good for the first 50 users and their plus-ones. When it’s gone, it’s gone. Don’t wait.`
      return { subject, html: layout(subject, htmlBody), text }
    }
}

// Drip templates day0..13 (simplified placeholders)
export function dripTemplate(dayIndex: number, ctx: { plan: Plan; priceMap: Record<string,string|undefined> }): TemplateResult {
  const subjects: Record<number,string> = {
  0: 'You’re 5 minutes from your first live strategy',
  1: 'Momentum hack: 20 minutes that beats “planning”',
  2: 'Steal this early traction loop',
  3: 'The 5‑minute frame that keeps you shipping',
  4: 'Pick one channel, unlock 10x signal',
  5: 'How to scale without losing focus',
  6: 'Will your niche actually buy? Run this test',
  7: 'Your momentum score (and what it predicts)',
  9: 'Unpublished drafts: the hidden leak',
  11: 'Follow-up loop: multiply your wins',
  13: 'Drift or build: your 30-day fork',
  }
  const subject = subjects[dayIndex] || `Day ${dayIndex}`
  const appUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  let core: string
  let text: string
  if (dayIndex === 0) {
    core = `
      <p style='margin:0 0 16px 0;font-size:16px'><strong>Hey, quick win:</strong> Open the builder and draft a <em>rough</em> first strategy in under 5 minutes. Imperfect + shipped today beats "perfect" next week.</p>
  <p style='margin:0 0 16px 0'><strong>Rule:</strong> one action → one result. Your action: name the audience, write a 1‑sentence outcome, pick a single channel. That gives you a living asset to iterate, instead of an idea swirling in your head.</p>
      <ol style='padding-left:20px;margin:0 0 16px 0'>
        <li>Name (who exactly?)</li>
        <li>Outcome (what changes for them?)</li>
        <li>Channel (where they already hang out?)</li>
      </ol>
      <p style='margin:0 0 16px 0'>That’s the minimum viable strategy. Refine after you see first signal.</p>
  <p style='margin:0 0 16px 0'><a href='${appUrl}' target="_blank" rel="noopener noreferrer" style='background:#000;color:#fff;text-decoration:none;padding:10px 18px;border:2px solid #000;font-weight:600;display:inline-block'>Create it now →</a></p>
      <p style='margin:24px 0 0 0;font-size:14px'>PS: Tomorrow I’ll show you how “paralysis” silently taxes growth and how to dodge it.</p>
    `
    text = 'Draft first strategy: audience, outcome, channel. Ship a rough version today. CTA: create it now.'
  } else if (dayIndex === 1) {
    core = `
      <p style='margin:0 0 16px 0;font-size:16px'><strong>Paralysis Tax:</strong> Every day you hesitate you lose compounding signal. No data = no refinement. That’s the hidden tax.</p>
      <p style='margin:0 0 16px 0'>Beat it with the <strong>15/5 loop</strong>: 15 minutes drafting / shipping, 5 minutes reviewing metrics. That rhythm outperforms "deep planning" because the market edits you faster than you can edit yourself.</p>
      <p style='margin:0 0 16px 0'><strong>Do this now:</strong> Reopen yesterday’s strategy, add ONE distribution bullet, hit publish.</p>
  <p style='margin:0 0 16px 0'><a href='${appUrl}' target="_blank" rel="noopener noreferrer" style='background:#000;color:#fff;text-decoration:none;padding:10px 18px;border:2px solid #000;font-weight:600;display:inline-block'>Add distribution →</a></p>
      <p style='margin:24px 0 0 0;font-size:14px'>PS: Next email: a real user’s "starter to first traction" pattern you can copy.</p>
    `
    text = 'Beat paralysis with 15/5 loop. Reopen yesterday’s strategy and add one distribution bullet. CTA: Add distribution.'
  } else if (dayIndex === 2) {
    core = `
      <p style='margin:0 0 16px 0;font-size:16px'><strong>Starter Win Pattern:</strong> Narrow micro‑niche → repeated micro‑asset → simple follow‑up.</p>
      <p style='margin:0 0 16px 0'><strong>Example:</strong> Indie AI tutors → daily 120‑word “lesson gap” post → DM script offering a free fix call. 11 posts → 3 calls → 1 paying user → proof to expand.</p>
      <p style='margin:0 0 16px 0'><strong>Your turn:</strong> Define your micro‑niche in 8 words. Outline the repeatable asset (format + frequency). Draft the first one now.</p>
  <p style='margin:0 0 16px 0'><a href='${appUrl}' target="_blank" rel="noopener noreferrer" style='background:#000;color:#fff;text-decoration:none;padding:10px 18px;border:2px solid #000;font-weight:600;display:inline-block'>Draft first micro‑asset →</a></p>
      <p style='margin:24px 0 0 0;font-size:14px'>PS: Tomorrow: the 5‑minute time box that keeps you publishing when you’re slammed.</p>
    `
    text = 'Pattern: micro-niche → repeatable asset → simple follow-up. Define niche + asset, draft first piece now.'
  } else if (dayIndex === 3) {
    core = `
      <p style='margin:0 0 16px 0;font-size:16px'><strong>No Time? Use the 5‑Minute Frame.</strong></p>
      <p style='margin:0 0 16px 0'>Set a 5‑minute timer. Write ONLY the problem line + one actionable step. Ship it. That’s a publishable micro‑asset. Depth comes from repetition, not one marathon session.</p>
      <p style='margin:0 0 16px 0'><strong>Template:</strong><br/>Problem: “{Specific pain sentence}”<br/>Action: “Do {single step} to unlock {micro result}.”</p>
      <p style='margin:0 0 16px 0'><strong>Now:</strong> Produce one using the template and push it live.</p>
  <p style='margin:0 0 16px 0'><a href='${appUrl}' target="_blank" rel="noopener noreferrer" style='background:#000;color:#fff;text-decoration:none;padding:10px 18px;border:2px solid #000;font-weight:600;display:inline-block'>Ship 5‑min asset →</a></p>
      <p style='margin:24px 0 0 0;font-size:14px'>PS: Coming up: picking the right channel in 5 minutes.</p>
    `
    text = 'Use 5-minute frame: problem line + one action. Ship one micro-asset now.'
  } else if (dayIndex === 4) {
    core = `
      <p style='margin:0 0 16px 0;font-size:16px'><strong>Channel Picking In 5 Minutes.</strong></p>
      <p style='margin:0 0 16px 0'>Most waste comes from splitting tiny effort across too many places. Pick ONE primary channel for 30 days. Decision heuristic:</p>
      <ol style='padding-left:20px;margin:0 0 16px 0'>
        <li><strong>Audience density:</strong> Are your prospects already clustered there?</li>
        <li><strong>Feedback speed:</strong> Can you see signal inside 24h?</li>
        <li><strong>Asset reusability:</strong> Can outputs be repurposed elsewhere later?</li>
      </ol>
      <p style='margin:0 0 16px 0'>Score your top 2–3 options 1–5 on each. Highest total wins. Commit. Eliminate the rest for now.</p>
      <p style='margin:0 0 16px 0'><strong>Action:</strong> Run the 3-metric score, lock a channel, update your strategy doc to reflect it.</p>
  <p style='margin:0 0 16px 0'><a href='${appUrl}' target="_blank" rel="noopener noreferrer" style='background:#000;color:#fff;text-decoration:none;padding:10px 18px;border:2px solid #000;font-weight:600;display:inline-block'>Lock channel →</a></p>
      <p style='margin:24px 0 0 0;font-size:14px'>PS: Tomorrow: an expansion example once first traction hits.</p>
    `
    text = 'Score channels (density, feedback speed, reusability), pick one, update strategy.'
  } else if (dayIndex === 5) {
    core = `
      <p style='margin:0 0 16px 0;font-size:16px'><strong>Beyond First Customers (Scale Pattern).</strong></p>
      <p style='margin:0 0 16px 0'>Early traction usually = one repeatable micro‑asset. Scaling = adding a <em>second layer</em> that compounds the first without derailing focus.</p>
      <p style='margin:0 0 16px 0'><strong>Layer Types:</strong></p>
      <ul style='margin:0 0 16px 0;padding-left:20px'>
        <li>Repurpose: Turn daily short posts into a weekly digest.</li>
        <li>Depth: Expand top performer into a mini guide / thread.</li>
        <li>Follow-up: DM or email sequence to engaged engagers.</li>
      </ul>
      <p style='margin:0 0 16px 0'><strong>Action:</strong> Identify your top performing micro‑asset last 7 days. Choose ONE layer to attach. Schedule its first instance now.</p>
  <p style='margin:0 0 16px 0'><a href='${appUrl}' target="_blank" rel="noopener noreferrer" style='background:#000;color:#fff;text-decoration:none;padding:10px 18px;border:2px solid #000;font-weight:600;display:inline-block'>Add scale layer →</a></p>
      <p style='margin:24px 0 0 0;font-size:14px'>PS: Next: Will this even work in your niche? Quick validation check.</p>
    `
    text = 'Pick one scale layer (repurpose, depth, follow-up) for top asset and schedule it.'
  } else if (dayIndex === 6) {
    core = `
      <p style='margin:0 0 16px 0;font-size:16px'><strong>Will This Work In Your Niche?</strong></p>
      <p style='margin:0 0 16px 0'>Run the <strong>Signal Triad</strong> this week:</p>
      <ol style='padding-left:20px;margin:0 0 16px 0'>
        <li><strong>Micro engagement:</strong> At least 5 meaningful comments / replies?</li>
        <li><strong>Depth response:</strong> Any DMs / emails asking follow‑up questions?</li>
        <li><strong>Conversion motion:</strong> One person taking a next step (signup, call, etc.).</li>
      </ol>
      <p style='margin:0 0 16px 0'>2 of 3 = promising; 3 of 3 = double down; 0–1 = adjust niche specificity or problem wording before adding volume.</p>
      <p style='margin:0 0 16px 0'><strong>Action:</strong> Instrument a simple tally (even a note) for this week’s outputs.</p>
  <p style='margin:0 0 16px 0'><a href='${appUrl}' target="_blank" rel="noopener noreferrer" style='background:#000;color:#fff;text-decoration:none;padding:10px 18px;border:2px solid #000;font-weight:600;display:inline-block'>Track triad →</a></p>
      <p style='margin:24px 0 0 0;font-size:14px'>PS: Tomorrow: measuring momentum itself.</p>
    `
    text = 'Use Signal Triad (engagement, depth response, conversion) to validate niche; track today.'
  } else if (dayIndex === 7) {
    core = `
      <p style='margin:0 0 16px 0;font-size:16px'><strong>Your Momentum Score.</strong></p>
      <p style='margin:0 0 16px 0'>Score each day (0–3) on three inputs: <strong>Shipping</strong> (did something publish), <strong>Learning</strong> (did you review data), <strong>Adjustment</strong> (did you change one element). Max daily = 9.</p>
      <p style='margin:0 0 16px 0'><strong>Interpretation:</strong><br/>45–63/wk (avg 6–9): You’re compounding.<br/>27–44: Inconsistent – tighten your daily ritual.<br/>&lt;27: You’re ideating more than operating.</p>
      <p style='margin:0 0 16px 0'><strong>Action:</strong> Backfill last 3 days from memory. Start today’s log.</p>
  <p style='margin:0 0 16px 0'><a href='${appUrl}' target="_blank" rel="noopener noreferrer" style='background:#000;color:#fff;text-decoration:none;padding:10px 18px;border:2px solid #000;font-weight:600;display:inline-block'>Log momentum →</a></p>
      <p style='margin:24px 0 0 0;font-size:14px'>PS: Upcoming: the silent cost of waiting (and how to neutralize it).</p>
    `
    text = 'Score shipping/learning/adjustment daily; backfill 3 days and start log.'
  } else if (dayIndex === 9) {
    core = `
      <p style='margin:0 0 16px 0;font-size:16px'><strong>The Silent Cost Of Waiting.</strong></p>
      <p style='margin:0 0 16px 0'>Delay = losing calibration cycles. Each unpublished day pushes back the date you reach a working repeatable loop. Treat each micro‑asset as a calibration ticket.</p>
      <p style='margin:0 0 16px 0'><strong>Mini Audit:</strong> Count unpublished drafts sitting idle. Either delete (not core) or ship (core). Reduce queue to &lt;=2.</p>
      <p style='margin:0 0 16px 0'><strong>Action:</strong> Clear the queue right now – ship or scrap.</p>
  <p style='margin:0 0 16px 0'><a href='${appUrl}' target="_blank" rel="noopener noreferrer" style='background:#000;color:#fff;text-decoration:none;padding:10px 18px;border:2px solid #000;font-weight:600;display:inline-block'>Clear backlog →</a></p>
      <p style='margin:24px 0 0 0;font-size:14px'>PS: Soon: feature spotlight that multiplies follow‑ups.</p>
    `
    text = 'Audit idle drafts; ship or delete to keep queue <=2 and regain calibration speed.'
  } else if (dayIndex === 11) {
    core = `
      <p style='margin:0 0 16px 0;font-size:16px'><strong>Feature Spotlight: Follow‑Up Loop.</strong></p>
      <p style='margin:0 0 16px 0'>Most traction leaks in the gap between first interaction and next useful touch. The follow‑up loop auto‑surfaces who engaged so you can deliver a relevant micro‑win.</p>
      <p style='margin:0 0 16px 0'><strong>Setup Checklist:</strong></p>
      <ul style='margin:0 0 16px 0;padding-left:20px'>
        <li>Identify last 7 days engaged users.</li>
        <li>Tag each with stage (new / warmed / active).</li>
        <li>Queue one next action asset per stage.</li>
      </ul>
      <p style='margin:0 0 16px 0'><strong>Action:</strong> Implement the loop for at least 3 engaged users right now.</p>
  <p style='margin:0 0 16px 0'><a href='${appUrl}' target="_blank" rel="noopener noreferrer" style='background:#000;color:#fff;text-decoration:none;padding:10px 18px;border:2px solid #000;font-weight:600;display:inline-block'>Activate follow‑ups →</a></p>
      <p style='margin:24px 0 0 0;font-size:14px'>PS: Final decision email coming: commit or drift.</p>
    `
    text = 'Implement follow-up loop: tag engaged users, queue one next asset each.'
  } else if (dayIndex === 13) {
    core = `
      <p style='margin:0 0 16px 0;font-size:16px'><strong>Decision Point: Drift Or Build?</strong></p>
      <p style='margin:0 0 16px 0'>You now have: a drafted strategy, a chosen channel, early signal framework, momentum log, and follow‑up concept. The fork: keep compounding or slide back to sporadic publishing.</p>
      <p style='margin:0 0 16px 0'><strong>If compounding:</strong> Lock a 30‑day commitment (daily micro‑asset or 3x/week depth). Calendar it.</p>
      <p style='margin:0 0 16px 0'><strong>If drifting:</strong> Pick the smallest sustainable cadence (even 2x/week) and protect it ruthlessly.</p>
      <p style='margin:0 0 16px 0'><strong>Action:</strong> Set the next 30 days schedule block now inside your system.</p>
  <p style='margin:0 0 16px 0'><a href='${appUrl}' target="_blank" rel="noopener noreferrer" style='background:#000;color:#fff;text-decoration:none;padding:10px 18px;border:2px solid #000;font-weight:600;display:inline-block'>Lock 30‑day calendar →</a></p>
      <p style='margin:24px 0 0 0;font-size:14px'>PS: Need more headroom? Upgrade unlocks higher strategy quota & retention.</p>
    `
    text = 'Set 30-day publishing cadence now (daily or minimal sustainable) to avoid drift.'
  } else {
    // Fallback original minimal content
    core = `<p style='margin:0 0 16px 0;font-size:16px'>${subject}.</p>`
    text = subject
  }

  const htmlBody = `<tr><td style='font-size:16px'>${core}${upsell(ctx.plan, ctx.priceMap)}</td></tr>`
  return { subject, html: layout(subject, htmlBody), text }
}
