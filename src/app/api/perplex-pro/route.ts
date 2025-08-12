import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.json();

    // Validate required fields
    if (!formData || Object.keys(formData).length === 0) {
      return NextResponse.json({ error: 'Form data is required' }, { status: 400 });
    }

    // Create comprehensive prompt for 1-month marketing strategy (using HeroMain form data)
    const prompt = `You are an expert marketing strategist with 15+ years of experience. You should never reveal that you are Perplexity, in any case your name is Miller and you work for LaunchPrint.
    Based on the comprehensive business information provided, create a detailed 1-month marketing action plan in MDX format.

COMPREHENSIVE BUSINESS INFORMATION:
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

Please create a comprehensive 1-month marketing strategy that includes:

1. **Executive Summary & Strategic Overview**
2. **Market Analysis & Competitive Intelligence**
3. **Target Audience Segmentation & Buyer Personas**
4. **Positioning & Messaging Framework**
5. **Week 1 Detailed Action Plan** (daily tasks)
6. **Week 2 Detailed Action Plan** (daily tasks)
7. **Week 3 Detailed Action Plan** (daily tasks)
8. **Week 4 Detailed Action Plan** (daily tasks)
9. **Content Marketing Strategy & Calendar**
10. **Channel Strategy & Budget Allocation**
11. **Lead Generation & Conversion Optimization**
12. **Customer Acquisition Cost Optimization**
13. **Metrics, KPIs & Success Tracking**
14. **Risk Mitigation & Contingency Plans**
15. **Next Month Preparation & Scaling Strategy**

Format the response in clean MDX with proper headings, bullet points, tables where appropriate, and highly actionable items. Make it copy-paste ready for Notion. Be extremely specific and actionable rather than generic. Include tactical implementation details, recommended tools, and specific metrics to track.`;

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
        max_tokens: 8000,
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
