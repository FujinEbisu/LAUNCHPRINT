import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.json();

    // Validate required fields
    if (!formData || Object.keys(formData).length === 0) {
      return NextResponse.json({ error: 'Form data is required' }, { status: 400 });
    }

    // Create comprehensive prompt for 2-week marketing strategy
    const prompt = `You are an expert marketing strategist. Based on the business information provided, create a detailed 2-week marketing action plan in MDX format.

BUSINESS INFORMATION:
- Problem solved: ${formData.problem || 'Not specified'}
- Product/Service: ${formData.productSimple || 'Not specified'}
- Business type: ${formData.b2bOrB2c || 'Not specified'}
- Launch status: ${formData.launchOrExisting || 'Not specified'}
- Monthly revenue: ${formData.revenueRange || 'Not specified'}
- Customer count: ${formData.customerCount || 'Not specified'}
- Ideal customer: ${formData.idealCustomer || 'Not specified'}
- Customer industry: ${formData.customerIndustry || 'Not specified'}
- Company size: ${formData.companySize || 'Not specified'}
- Customer challenge: ${formData.customerChallenge || 'Not specified'}
- Current solution: ${formData.currentSolution || 'Not specified'}
- 6-month goal: ${formData.goal6mo || 'Not specified'}
- Goal type: ${formData.goalType || 'Not specified'}
- Success criteria: ${formData.successCriteria || 'Not specified'}
- Marketing budget: ${formData.marketingBudget || 'Not specified'}
- Marketing time: ${formData.marketingTime || 'Not specified'}
- Marketing materials: ${formData.marketingMaterials || 'Not specified'}
- Competitors: ${formData.competitors || 'Not specified'}
- Differentiation: ${formData.differentiation || 'Not specified'}
- Customer discovery: ${formData.discovery || 'Not specified'}

Please create a comprehensive 2-week marketing strategy that includes:

1. **Executive Summary** - Brief overview of the strategy
2. **Week 1 Action Plan** - Daily tasks with specific actions
3. **Week 2 Action Plan** - Daily tasks with specific actions
4. **Key Messaging Framework** - Core value propositions and messaging
5. **Recommended Marketing Channels** - Best channels for this business
6. **Content Ideas** - Specific content suggestions
7. **Metrics to Track** - KPIs and success measurements
8. **Quick Wins** - Immediate actions for fastest results

Format the response in clean MDX with proper headings, bullet points, and actionable items. Make it copy-paste ready for Notion. Be specific and actionable rather than generic.`;

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
        max_tokens: 4000,
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
