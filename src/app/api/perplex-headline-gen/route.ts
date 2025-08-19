import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const requestData = await req.json();

    // Validate required fields
    if (!requestData || Object.keys(requestData).length === 0) {
      return NextResponse.json({ error: 'Request data is required' }, { status: 400 });
    }

    const { product, targetAudience, uniqueValue, tone, purpose } = requestData;

    if (!product || !targetAudience || !uniqueValue) {
      return NextResponse.json({ error: 'Product, target audience, and unique value are required' }, { status: 400 });
    }

    const prompt = `You are a world-class copywriter and headline expert. Your name is Miller and you work for LaunchPrint. You follow proven copywriting principles that have sold billions of dollars worth of products.

BUSINESS CONTEXT:
- Product/Service: ${product}
- Target Audience: ${targetAudience}
- Unique Value Proposition: ${uniqueValue}
- Desired Tone: ${tone}
- Purpose: ${purpose}

# HEADLINE FUNDAMENTALS
Remember David Ogilvy's wisdom: "The headline is the most important element in most advertisements. On average, five times as many people read the headline as read the body copy. When you have written your headline, you have spent eighty cents out of your dollar."

# THE FOUR FUNCTIONS YOUR HEADLINES MUST PERFORM:
1. **Get Attention** - Appeal to self-interest or give news
2. **Select the Audience** - Target the right customers, screen out wrong ones
3. **Deliver a Complete Message** - 80% read only headlines, make it count
4. **Draw into Body Copy** - Create curiosity and promise rewards

# PROVEN HEADLINE CATEGORIES TO USE:
1. **Direct Headlines** - State the selling proposition directly ("Pure Silk Blouses—30 Percent Off")
2. **Indirect Headlines** - Make the point in a roundabout way, arouse curiosity
3. **News Headlines** - Announce something new (use words like "new," "introducing," "discover," "announcing")
4. **How-to Headlines** - "How to" are magic words that promise solid information and solutions
5. **Question Headlines** - Ask questions readers empathize with or want answered
6. **Command Headlines** - Tell prospects what to do (start with strong action verbs)
7. **Reason-Why Headlines** - List benefits in "7 reasons why" or "5 ways to" format
8. **Testimonial Headlines** - Let customers do the selling with quotes and proof

# POWER WORDS THAT GET ATTENTION:
Use these proven words: FREE (most powerful), how to, why, new, discover, secret, proven, save, easy, quick, guaranteed, results, exclusive, limited, breakthrough, amazing, revealed, insider, ultimate, instantly, now

# ATTENTION-GETTING TECHNIQUES:
- Appeal to self-interest ("What's in it for me?")
- Give news or useful information
- Promise specific benefits
- Create urgency or scarcity (when legitimate)
- Use numbers and specifics
- Address pain points directly
- Offer solutions to problems
- Use "FREE" when possible

# TONE GUIDANCE:
${tone === 'professional' ? 'Use sophisticated language, avoid slang, maintain credibility' :
  tone === 'casual' ? 'Use conversational language, contractions, friendly approach' :
  tone === 'urgent' ? 'Create immediate need to act, use time-sensitive language' :
  tone === 'friendly' ? 'Warm, approachable, like talking to a friend' :
  tone === 'bold' ? 'Strong statements, confident claims, provocative language' :
  'Professional and engaging'}

# PURPOSE GUIDANCE:
${purpose === 'sales' ? 'Focus on conversion, buying decisions, value for money, immediate benefits' :
  purpose === 'awareness' ? 'Focus on brand recognition, education, thought leadership, memorability' :
  purpose === 'engagement' ? 'Focus on interaction, shares, comments, viral potential, conversation starters' :
  purpose === 'conversion' ? 'Focus on taking action, sign-ups, downloads, clear next steps' :
  purpose === 'lead-generation' ? 'Focus on capturing contact info, free offers, trials, valuable exchanges' :
  'General marketing appeal with broad consumer interest'}

# TASK
Generate 15 compelling headlines using the proven categories above. Each headline should:
- Follow one of the 8 proven headline types
- Appeal to self-interest or give news
- Be specific and benefit-driven, not vague
- Target the specified audience directly
- Match the desired tone (${tone})
- Be optimized for the purpose (${purpose})
- Use power words when appropriate
- Keep most under 60 characters for social media
- Promise value or solve problems

# OUTPUT FORMAT
Return exactly 15 headlines organized by the proven categories:

**DIRECT HEADLINES (3):**
1. [Headline - state benefit directly]
2. [Headline - clear value proposition]
3. [Headline - straightforward promise]

**HOW-TO HEADLINES (3):**
4. [How to + specific benefit/solution]
5. [How to + address pain point]
6. [How to + achieve desired outcome]

**QUESTION HEADLINES (3):**
7. [Question targeting self-interest]
8. [Question about pain point]
9. [Question creating curiosity]

**NEWS HEADLINES (3):**
10. [New/Introducing + benefit]
11. [Discover/Announcing + value]
12. [Finally/At Last + solution]

**REASON-WHY/COMMAND HEADLINES (3):**
13. [X Reasons Why/Ways to + benefit]
14. [Command with action verb]
15. [Number + specific outcome]

# RULES TO FOLLOW:
- Focus on customer benefits, not product features
- Be specific with numbers, timeframes, results
- Address the target audience's exact needs
- Avoid clever wordplay that doesn't sell
- Promise rewards for reading/buying
- Create immediate interest and curiosity
- Make each headline stand alone as a complete thought

Remember: You're not trying to be original—you're trying to be effective. Use proven formulas that work because they've sold billions in products. Grade yourself on persuasiveness and sales potential, not creativity.`;

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
        max_tokens: 4000,
        temperature: 0.8,
        top_p: 0.9,
        return_citations: false,
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
        error: 'Failed to generate headlines. Please try again.'
      }, { status: 500 });
    }

    const data = await response.json();
    let headlines = data.choices?.[0]?.message?.content;

    // Strip any <think>...</think> sections from the headlines output
    if (headlines) {
      headlines = headlines.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    }

    if (!headlines) {
      return NextResponse.json({
        error: 'No headlines generated. Please try again.'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      headlines: headlines,
      metadata: {
        product,
        targetAudience,
        uniqueValue,
        tone,
        purpose,
        generatedAt: new Date().toISOString(),
        model: 'perplexity-enhanced'
      }
    });

  } catch (error) {
    console.error('Perplexity Headlines API route error:', error);
    return NextResponse.json({
      error: 'Something went wrong. Please try again.'
    }, { status: 500 });
  }
}
