import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const requestData = await req.json();

    // Validate required fields
    if (!requestData || Object.keys(requestData).length === 0) {
      return NextResponse.json({ error: 'Request data is required' }, { status: 400 });
    }

    let prompt: string;

    // Check if this is a follow-up question
    if (requestData.followUpQuestion && requestData.chatHistory) {
      // This is a follow-up question with chat history
      const chatHistoryText = requestData.chatHistory
        .map((msg: { role: string; content: string }) => `${msg.role}: ${msg.content}`)
        .join('\n');

      prompt = `You are helping someone who knows ZERO about marketing. Explain everything like they're 12 years old.

THEIR BUSINESS:
- Problem solved: ${requestData.problem || 'Not specified'}

CONVERSATION SO FAR:
${chatHistoryText}

Answer their question in the simplest way possible:

**Here's exactly what to do:**
1. **[Simple action]** - Do this because [simple reason]
2. **[Next simple step]** - This helps you [simple benefit]
3. **[Third simple step]** - Now you can [simple next thing]

**You'll know it's working when:** [Simple thing they can count or see]

**How long this takes:** [Realistic time like "2 hours" or "3 days"]

**What this lets you do next:** [Simple next capability they unlock]

Use simple words. No marketing terms. Explain like you're talking to someone who has never done marketing before.`;
    } else {
      // This is initial strategy generation
      prompt = `You are explaining marketing to someone who knows NOTHING about marketing. They need step-by-step instructions like a recipe.

THEIR BUSINESS:
- Problem solved: ${requestData.problem || 'Not specified'}

Write a simple marketing plan that a complete beginner can follow. Use simple words and explain WHY each step matters.

## Week 1: First Steps (Start Here)
**What you're trying to get:** [Simple goal like "10 people interested in your product"]

**Do these 3 things (in this order):**
1. **Make a simple website page**
   - Why: So people can find you online
   - How: Use Carrd.co or similar (takes 2 hours)
   - You'll know it worked when: You have a live website link

2. **Write 1 social media post about your problem**
   - Why: To find people who have this problem
   - How: "I noticed [problem]. Anyone else struggle with this?"
   - You'll know it worked when: People comment or like

3. **Ask 5 friends to share your post**
   - Why: More people will see it
   - How: Send them the link and ask nicely
   - You'll know it worked when: Your post gets more views

## Week 2: Get Your First Customers
**What you're trying to get:** [Simple goal]
**Do these 3 things:** [Same simple format]

## Week 3-4: Grow Bigger
**What you're trying to get:** [Simple goal]
**Do these 3 things:** [Same simple format]

## How to Know If It's Working
- Count these numbers every week:
  1. [Simple metric like "website visitors"]
  2. [Simple metric like "email signups"]
  3. [Simple metric like "people who tried your product"]

## What This Gets You Ready For
After 4 weeks, you'll have [specific result] which means you can then [next simple step].

Write everything like you're explaining to your grandmother. No marketing jargon. Simple words only.`;
    }

    // Call Perplexity API
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 3500,
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
