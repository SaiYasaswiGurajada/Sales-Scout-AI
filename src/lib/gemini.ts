import { GoogleGenAI, Type } from "@google/genai";

// Helper to initialize GenAI client with user-provided API key
function getGenAI(apiKey: string) {
  if (!apiKey) {
    throw new Error("Gemini API key is required. Please set it in Account Settings.");
  }
  return new GoogleGenAI({
    apiKey,
  });
}

// Schema for Briefing Generation
const briefingSchema = {
  type: Type.OBJECT,
  properties: {
    companySnapshot: {
      type: Type.OBJECT,
      properties: {
        industry: { type: Type.STRING },
        companySize: { type: Type.STRING },
        hqLocation: { type: Type.STRING },
        fundingOrRevenue: { type: Type.STRING },
        recentNews: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        whyItMattersNow: { type: Type.STRING },
      },
      required: [
        "industry",
        "companySize",
        "hqLocation",
        "fundingOrRevenue",
        "recentNews",
        "whyItMattersNow",
      ],
    },
    financialOverview: {
      type: Type.OBJECT,
      properties: {
        summary: { type: Type.STRING },
        threeYearTrend: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              year: { type: Type.STRING },
              revenue: { type: Type.STRING },
              growthOrMargin: { type: Type.STRING },
              keyHighlight: { type: Type.STRING },
            },
            required: ["year", "revenue"],
          },
        },
        keyFinancialHighlights: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
      required: ["summary", "threeYearTrend", "keyFinancialHighlights"],
    },
    currentAffairs: {
      type: Type.OBJECT,
      properties: {
        topHeadlines: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        strategicImpact: { type: Type.STRING },
      },
      required: ["topHeadlines", "strategicImpact"],
    },
    stakeholderProfile: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        title: { type: Type.STRING },
        roleOverview: { type: Type.STRING },
        topKPIs: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        communicationStyle: { type: Type.STRING },
        perceivedPainPoints: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        recentPublicActivity: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
      required: [
        "name",
        "title",
        "roleOverview",
        "topKPIs",
        "communicationStyle",
        "perceivedPainPoints",
        "recentPublicActivity",
      ],
    },
    talkingPoints: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          opener: { type: Type.STRING },
          strategicContext: { type: Type.STRING },
        },
        required: ["topic", "opener", "strategicContext"],
      },
    },
    objectionRadar: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          objection: { type: Type.STRING },
          riskLevel: { type: Type.STRING },
          responseAngle: { type: Type.STRING },
        },
        required: ["objection", "riskLevel", "responseAngle"],
      },
    },
    competitiveContext: {
      type: Type.OBJECT,
      properties: {
        keyCompetitors: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        incumbentAdvantage: { type: Type.STRING },
        ourDifferentiators: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        trapQuestionsToAsk: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
      required: [
        "keyCompetitors",
        "incumbentAdvantage",
        "ourDifferentiators",
        "trapQuestionsToAsk",
      ],
    },
    discoveryQuestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: [
    "companySnapshot",
    "financialOverview",
    "currentAffairs",
    "stakeholderProfile",
    "talkingPoints",
    "objectionRadar",
    "competitiveContext",
    "discoveryQuestions",
  ],
};

export async function generateBriefing(apiKey: string, input: any) {
  const {
    companyName,
    stakeholderName,
    stakeholderTitle,
    industry,
    dealSize,
    naturalLanguagePrompt,
    timeframe,
    customScheduledDate,
    dataTimeframe,
  } = input;

  if (!companyName || typeof companyName !== "string" || !companyName.trim()) {
    throw new Error("Company name is required.");
  }

  const ai = getGenAI(apiKey);

  const targetCompany = companyName.trim();
  const targetPerson = stakeholderName?.trim() || "Key Decision Maker";
  const targetRole = stakeholderTitle?.trim() || "Executive Leader";
  const dealContext = dealSize ? `Estimated Deal Size: ${dealSize}` : "";
  const indContext = industry ? `Industry Focus: ${industry}` : "";
  const userPromptContext = naturalLanguagePrompt
    ? `Specific User Prompt & Instructions: "${naturalLanguagePrompt.trim()}"`
    : "";

  let timeframeContext =
    "Historical AI Research Window: Focus on the last 3 months (90 days) of company data and news.";
  if (dataTimeframe) {
    if (dataTimeframe.option === "6m") {
      timeframeContext =
        "Historical AI Research Window: Focus on the last 6 months of company data, news, filings, and financial metrics.";
    } else if (dataTimeframe.option === "1y") {
      timeframeContext =
        "Historical AI Research Window: Focus on the full last 1 year of historical company performance, market news, and strategic filings.";
    } else if (dataTimeframe.option === "custom") {
      const rangeStr =
        dataTimeframe.startDate && dataTimeframe.endDate
          ? `from ${dataTimeframe.startDate} to ${dataTimeframe.endDate}`
          : dataTimeframe.customLabel || "custom historical window";
      timeframeContext = `Historical AI Research Window: Focus deep analysis on historical data, market news, and records covering ${rangeStr}.`;
    }
  }

  const prompt = `
Generate a comprehensive, highly strategic B2B Sales Briefing for a sales representative preparing for an upcoming meeting.

Target Details:
- Company Name: "${targetCompany}"
- Stakeholder Name: "${targetPerson}"
- Stakeholder Title: "${targetRole}"
${indContext}
${dealContext}
${userPromptContext}
- ${timeframeContext}

Instructions:
1. Provide realistic, highly accurate or plausible enterprise profile details for "${targetCompany}".
2. Respect the Historical AI Research Window (${timeframeContext}) when selecting news, current affairs, financial trends, and milestones.
3. Parse any specific requests in the User Prompt (such as financial records, multi-year data, current affairs, news) and ensure the generated briefing explicitly covers those demands.
4. Include a detailed "financialOverview" summarizing revenue trends, growth/margin metrics, and key financial highlights matching the lookback depth.
5. Include "currentAffairs" with top recent headlines and strategic market impact for "${targetCompany}".
6. Outline specific role KPIs, communication preferences, and acute pain points for "${targetPerson}" (${targetRole}).
7. Craft 3-4 natural conversation openers ("talkingPoints") that reference current market trends, news, or pain points.
8. Predict 2-3 tough objections ("objectionRadar") with risk level (High, Medium, or Low) and tactical response angles.
9. Provide competitive landscape positioning ("competitiveContext") including incumbent advantages, differentiators, and silver-bullet trap questions.
10. Provide 3-4 powerful discovery questions.

Return strictly structured JSON matching the requested schema.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
    config: {
      systemInstruction:
        "You are SalesScout AI, an elite B2B sales intelligence engine. Provide sharp, executive-ready sales pre-meeting briefings that give account reps an unfair advantage in sales conversations.",
      temperature: 0.7,
      responseMimeType: "application/json",
      responseSchema: briefingSchema,
    },
  });

  const responseText = response.text;
  if (!responseText) {
    throw new Error("No response content generated by Gemini.");
  }

  const briefingData = JSON.parse(responseText);

  const result = {
    id: `briefing-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    companyName: targetCompany,
    stakeholderName: targetPerson !== "Key Decision Maker" ? targetPerson : undefined,
    stakeholderTitle: targetRole !== "Executive Leader" ? targetRole : undefined,
    scheduledDeliveryTime: customScheduledDate || undefined,
    deliveryTimeframe: timeframe || undefined,
    ...briefingData,
  };

  return result;
}

export async function refineBriefing(apiKey: string, existingBriefing: any, customInstruction: string) {
  if (!existingBriefing || !customInstruction) {
    throw new Error("Existing briefing and custom instruction are required.");
  }

  const ai = getGenAI(apiKey);

  const prompt = `
You are SalesScout AI. Refine and adapt the following existing B2B Sales Briefing according to the user's specific request.

User Refinement Request: "${customInstruction}"

Existing Briefing Data:
${JSON.stringify(existingBriefing, null, 2)}

Instructions:
Update and customize the briefing content (talking points, objections, stakeholder focus, or competitive angles) to specifically address the user's refinement instructions, while preserving the high-quality executive structure. Return strictly JSON matching the briefing schema.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
    config: {
      systemInstruction:
        "You are SalesScout AI. Refine and specialize sales pre-meeting briefings based on rep guidance.",
      temperature: 0.7,
      responseMimeType: "application/json",
      responseSchema: briefingSchema,
    },
  });

  const responseText = response.text;
  if (!responseText) {
    throw new Error("No response generated.");
  }

  const briefingData = JSON.parse(responseText);

  const result = {
    ...existingBriefing,
    ...briefingData,
    id: `refinement-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  return result;
}

export async function chatWithAssistant(
  apiKey: string,
  message: string,
  briefingContext: any,
  recentBriefings: any[],
  chatHistory: any[]
) {
  if (!message || typeof message !== "string" || !message.trim()) {
    throw new Error("Message is required.");
  }

  const ai = getGenAI(apiKey);

  let contextSummary = "";
  if (briefingContext && briefingContext.companyName) {
    contextSummary += `\nTarget Company: "${briefingContext.companyName}"`;
    if (briefingContext.stakeholderName) {
      contextSummary += `\nStakeholder: "${briefingContext.stakeholderName}" (${
        briefingContext.stakeholderTitle || "Lead"
      })`;
    }
    if (briefingContext.companySnapshot?.whyItMattersNow) {
      contextSummary += `\nCompany Context: ${briefingContext.companySnapshot.whyItMattersNow}`;
    }
  } else if (recentBriefings && Array.isArray(recentBriefings) && recentBriefings.length > 0) {
    contextSummary += `\nRecent Briefing Companies in User Session: ${recentBriefings
      .map((b: any) => b.companyName)
      .join(", ")}`;
  }

  let historyText = "";
  if (chatHistory && Array.isArray(chatHistory)) {
    historyText = chatHistory
      .map((m: any) => `${m.sender === "user" ? "User" : "Assistant"}: ${m.text}`)
      .join("\n");
  }

  const prompt = `
You are SalesScout AI, an expert B2B sales intelligence chat assistant.
Provide a direct, insightful, and highly tailored answer to the user's question.

${contextSummary ? `Active Briefing Context:${contextSummary}\n` : ""}
${historyText ? `Conversation History:\n${historyText}\n` : ""}
User Query: "${message.trim()}"

Instructions:
1. Answer the specific query directly and uniquely.
2. If the user asks for discovery questions, pricing strategies, summaries, or objection angles, provide structured, clear bullet points or exact conversational scripts.
3. Tailor the answer to the active company context if available, or give sharp general B2B sales advice if no company is selected.
4. Keep the tone professional, strategic, and ready for immediate use in a sales call.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
    config: {
      systemInstruction:
        "You are SalesScout AI. Provide specific, non-generic sales intelligence answers based on user inputs.",
      temperature: 0.7,
    },
  });

  const replyText =
    response.text || "I apologize, I could not generate a response. Please try rephrasing your question.";

  return replyText;
}
