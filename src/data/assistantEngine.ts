import type { QuestionnaireAnswers } from "./locationData";

export interface AssistantProfileContext {
  fullName?: string | null;
  state?: string | null;
  city?: string | null;
  interest?: string | null;
}

export interface AssistantMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AssistantReply {
  content: string;
  followUps: string[];
}

const defaultFollowUps = [
  "Do you want a step-by-step action plan?",
  "Should I suggest 3 options by your budget?",
  "Would you like local opportunities from your state?",
];

function getUserName(profile?: AssistantProfileContext): string {
  return profile?.fullName?.trim().split(" ")[0] || "there";
}

function detectLanguage(input: string): "en" | "hi" {
  const hindiHints = /[\u0900-\u097F]|namaste|hindi|yojana|madad|sahayata/i;
  return hindiHints.test(input) ? "hi" : "en";
}

function renderStructuredReply(
  title: string,
  profileSummary: string[],
  suggestions: string[],
  steps: string[],
  guidance: string[],
  followUps: string[]
): string {
  return [
    `## ${title}`,
    "",
    "### Profile Context",
    ...profileSummary.map((item) => `- ${item}`),
    "",
    "### Smart Recommendations",
    ...suggestions.map((item, i) => `${i + 1}. ${item}`),
    "",
    "### Next Steps",
    ...steps.map((step, i) => `${i + 1}. ${step}`),
    "",
    "### Guidance",
    ...guidance.map((item) => `- ${item}`),
    "",
    "### Suggested Follow-up Questions",
    ...followUps.map((q) => `- ${q}`),
  ].join("\n");
}

function makeProfileSummary(profile?: AssistantProfileContext, questionnaire?: QuestionnaireAnswers): string[] {
  const location = profile?.state
    ? `${profile.city ? `${profile.city}, ` : ""}${profile.state}`
    : "Location not set";
  const interests = questionnaire?.interests?.length
    ? questionnaire.interests.join(", ")
    : profile?.interest || "Not set";

  return [
    `User: ${getUserName(profile)}`,
    `Skill level: ${questionnaire?.skillLevel || "Beginner/Not set"}`,
    `Interests: ${interests}`,
    `Location: ${location}`,
    `Goal: ${questionnaire?.primaryGoal || "Career growth / entrepreneurship"}`,
    `Past activity: ${questionnaire ? "Questionnaire completed" : "Limited profile activity"}`,
  ];
}

function buildCourseSuggestions(questionnaire?: QuestionnaireAnswers): string[] {
  const interests = questionnaire?.interests || [];
  const suggestions: string[] = [];

  if (interests.some((i) => i.toLowerCase().includes("technology"))) {
    suggestions.push("Google Digital Marketing certificate (job + freelance friendly).");
  }
  if (interests.some((i) => i.toLowerCase().includes("beauty"))) {
    suggestions.push("PMKVY Beautician track with local center placement support.");
  }
  if (interests.some((i) => i.toLowerCase().includes("food"))) {
    suggestions.push("Food processing + hygiene certification for small food ventures.");
  }
  if (interests.some((i) => i.toLowerCase().includes("tailor") || i.toLowerCase().includes("fashion"))) {
    suggestions.push("Tailoring and fashion stitching with product-selling roadmap.");
  }

  if (suggestions.length === 0) {
    suggestions.push("Start with PMKVY foundational course in your strongest interest area.");
    suggestions.push("Take a 4-week digital skills course to improve earnings opportunities.");
  }

  suggestions.push("Find a mentor aligned to your target business category.");
  return suggestions.slice(0, 4);
}

function buildSchemeSuggestions(questionnaire?: QuestionnaireAnswers): string[] {
  const budget = questionnaire?.budget?.toLowerCase() || "";
  const result: string[] = [
    "PMKVY for free training and certification.",
  ];

  if (budget.includes("low")) {
    result.push("MUDRA Shishu loan for micro-startup setup.");
  } else if (budget.includes("medium")) {
    result.push("MUDRA Kishore + PMEGP subsidy planning.");
  } else {
    result.push("Stand-Up India for higher capital expansion.");
  }

  result.push("Mahila E-Haat onboarding for product discovery and selling.");
  return result;
}

function pickFollowUps(question: string, history: AssistantMessage[]): string[] {
  const q = question.toLowerCase();
  const latestUserTopics = history
    .filter((m) => m.role === "user")
    .slice(-3)
    .map((m) => m.content.toLowerCase())
    .join(" ");

  if (q.includes("loan") || q.includes("scheme") || latestUserTopics.includes("mudra")) {
    return [
      "Do you want a loan eligibility checklist?",
      "Should I draft a simple business plan outline for your application?",
      "Want state-specific scheme links and office contacts?",
    ];
  }

  if (q.includes("course") || q.includes("skill") || q.includes("job")) {
    return [
      "Do you want beginner vs advanced learning paths?",
      "Should I suggest a 30-day study and practice plan?",
      "Would you like jobs/freelance options after this training?",
    ];
  }

  return defaultFollowUps;
}

export function generateAssistantReply(
  userInput: string,
  history: AssistantMessage[],
  profile?: AssistantProfileContext,
  questionnaire?: QuestionnaireAnswers
): AssistantReply {
  if (!userInput.trim()) {
    return {
      content: "I did not receive a question. Please share what you want help with.",
      followUps: defaultFollowUps,
    };
  }

  const language = detectLanguage(userInput);
  const input = userInput.toLowerCase();
  const profileSummary = makeProfileSummary(profile, questionnaire);
  const followUps = pickFollowUps(userInput, history);

  const isCareer = /course|training|job|career|skill/.test(input);
  const isFunding = /loan|scheme|mudra|finance|fund/.test(input);
  const isBusiness = /business|startup|start|idea|sell/.test(input);

  if (isCareer) {
    const content = renderStructuredReply(
      language === "hi" ? "Aapke liye Career Guidance" : `Career Guidance for ${getUserName(profile)}`,
      profileSummary,
      buildCourseSuggestions(questionnaire),
      [
        "Choose one focus skill and complete a short foundational course.",
        "Create 2-3 sample projects/portfolio outputs.",
        "Apply through local placement cells and online job boards weekly.",
      ],
      [
        "Track learning hours weekly to maintain progress consistency.",
        "Pair training with mentor feedback for faster practical growth.",
      ],
      followUps
    );
    return { content, followUps };
  }

  if (isFunding || isBusiness) {
    const content = renderStructuredReply(
      language === "hi" ? "Vyapar aur Finance Guidance" : `Business & Funding Guidance for ${getUserName(profile)}`,
      profileSummary,
      [
        ...buildSchemeSuggestions(questionnaire),
        "Join a relevant skill community to validate idea and pricing.",
      ],
      [
        "Select one business model and estimate setup + monthly operating cost.",
        "Prepare eligibility documents and profile proof for scheme application.",
        "Launch a low-risk pilot with early feedback from your community.",
      ],
      [
        "Keep records of expenses/sales to improve loan approval confidence.",
        "Use local demand trends before finalizing product/service niche.",
      ],
      followUps
    );
    return { content, followUps };
  }

  return {
    content: renderStructuredReply(
      `Actionable Guidance for ${getUserName(profile)}`,
      profileSummary,
      [
        "Use your profile interests to choose one growth track this month.",
        "Explore mentor, course, and scheme recommendations together.",
        "Participate in your skill community for practical support.",
      ],
      [
        "Tell me your exact goal (job, business, funding, or upskilling).",
        "Share your available budget and time.",
        "I will produce a tailored 7-day and 30-day action plan.",
      ],
      [
        "I avoid generic answers by using your profile and activity context.",
        "If details are missing, I ask follow-up questions before suggesting.",
      ],
      followUps
    ),
    followUps,
  };
}
