// ─── AI Intelligence Layer ───
// Suggestion engine for courses, business ideas, mentor-mentee matching, and query answering

import { MOCK_COURSES, MOCK_MENTORS, MOCK_PRODUCTS, type MockMentor, type MockUser } from "./mockDatabase";
import { getDemandByLocation, getTrendingSkills, getBusinessPredictions } from "./demandEngine";

export interface AISuggestion {
  title: string;
  description: string;
  confidence: number; // 0-100
  category: string;
  icon?: string;
}

// ─── Course Suggestions for Users ───
export function suggestCoursesForUser(
  interests: string[],
  state: string,
  skillLevel?: string
): AISuggestion[] {
  const suggestions: AISuggestion[] = [];
  const stateDemand = getDemandByLocation(state)[0];

  // Category mapping
  const interestToCourseCategory: Record<string, string[]> = {
    "Tailoring": ["Arts & Crafts", "Fashion & Textiles"],
    "Handicrafts": ["Arts & Crafts"],
    "Beauty & Wellness": ["Beauty & Wellness"],
    "Food & Catering": ["Food & Catering"],
    "Technology": ["Technology & Digital"],
    "Digital Marketing": ["Technology & Digital"],
    "Agriculture": ["Agriculture"],
    "Teaching": ["Education & Teaching"],
    "Healthcare": ["Healthcare"],
    "Business Strategy": ["Business & Entrepreneurship"],
    "Embroidery": ["Arts & Crafts"],
    "Textiles": ["Arts & Crafts", "Fashion & Textiles"],
  };

  // Match courses based on interests
  interests.forEach(interest => {
    const categories = interestToCourseCategory[interest] || [];
    const matchedCourses = MOCK_COURSES.filter(c =>
      categories.some(cat => c.category.includes(cat)) &&
      (c.state === "All India" || c.state === state) &&
      (!skillLevel || c.level === skillLevel || c.level === "Beginner")
    );

    matchedCourses.forEach(course => {
      const confidence = Math.min(95, 60 + (course.enrolled > 300 ? 20 : 10) + (course.isFree ? 10 : 0));
      suggestions.push({
        title: course.title,
        description: `${course.provider} · ${course.duration} · ${course.level}${course.isFree ? " · Free" : ""}`,
        confidence,
        category: "Course",
      });
    });
  });

  // Add trending courses from demand engine
  if (stateDemand) {
    stateDemand.trendingCourses.forEach(courseName => {
      if (!suggestions.some(s => s.title === courseName)) {
        suggestions.push({
          title: courseName,
          description: `Trending in ${state} — High demand`,
          confidence: 72,
          category: "Trending Course",
        });
      }
    });
  }

  return suggestions.slice(0, 6);
}

// ─── Business Ideas for Sellers ───
export function suggestBusinessIdeas(
  currentBusinessType: string,
  state: string,
  city: string
): AISuggestion[] {
  const suggestions: AISuggestion[] = [];
  const stateDemand = getDemandByLocation(state)[0];
  const predictions = getBusinessPredictions();

  // Suggest based on location demand
  if (stateDemand) {
    stateDemand.topBusinessTypes.forEach((bizType, i) => {
      if (bizType !== currentBusinessType) {
        suggestions.push({
          title: `Start ${bizType} Business`,
          description: `High demand in ${state}. Top trending category with ${85 - i * 10}% demand score.`,
          confidence: 85 - i * 10,
          category: "Business Idea",
        });
      }
    });
  }

  // Suggest from trending predictions
  predictions.forEach(pred => {
    if (pred.topStates.includes(state) && !suggestions.some(s => s.title.includes(pred.businessType))) {
      suggestions.push({
        title: `Expand into ${pred.businessType}`,
        description: `Growing ${pred.growth}% in your area. Score: ${pred.score}/100`,
        confidence: pred.score,
        category: "Growth Opportunity",
      });
    }
  });

  // Product diversification suggestions
  const existingProducts = MOCK_PRODUCTS.filter(p => p.state === state);
  const categories = new Set(existingProducts.map(p => p.category));

  if (!categories.has("Digital Products")) {
    suggestions.push({
      title: "Go Digital — Sell Online Courses",
      description: `Create digital content about ${currentBusinessType}. Low investment, high margins.`,
      confidence: 68,
      category: "Digital Expansion",
    });
  }

  if (!categories.has("Accessories")) {
    suggestions.push({
      title: "Add Accessories Line",
      description: `Complementary products to your ${currentBusinessType} business.`,
      confidence: 62,
      category: "Product Expansion",
    });
  }

  return suggestions.slice(0, 5);
}

// ─── Mentee Suggestions for Mentors ───
export function suggestMenteesForMentor(
  mentor: MockMentor,
  users: MockUser[]
): AISuggestion[] {
  const suggestions: AISuggestion[] = [];

  // Match users by interest alignment with mentor expertise
  const expertiseMap: Record<string, string[]> = {
    "Business Strategy": ["Handicrafts", "Food & Catering", "Tailoring", "Beauty & Wellness"],
    "Career Guidance": ["Technology", "Digital Marketing", "Teaching", "Healthcare"],
    "Financial Planning": ["Food & Catering", "Handicrafts", "Tailoring"],
    "Digital Marketing": ["Technology", "Digital Marketing"],
    "Technical Skills": ["Technology", "Digital Marketing"],
    "Fashion & Career": ["Tailoring", "Textiles", "Beauty & Wellness"],
    "Healthcare Training": ["Healthcare", "Beauty & Wellness"],
    "Arts & Crafts": ["Handicrafts", "Tailoring", "Embroidery"],
    "Business Finance": ["Food & Catering", "Handicrafts"],
  };

  const relevantInterests = expertiseMap[mentor.expertise] || [];

  users
    .filter(u => u.role === "user" && u.status === "active")
    .forEach(user => {
      const interestMatch = relevantInterests.includes(user.interest);
      const stateMatch = user.state === mentor.state;
      const languageMatch = mentor.languages.some(l =>
        l === "English" || l === "Hindi" // Default match for common languages
      );

      if (interestMatch || stateMatch) {
        const confidence = (interestMatch ? 40 : 0) + (stateMatch ? 30 : 0) + (languageMatch ? 20 : 0) + 10;
        suggestions.push({
          title: user.name,
          description: `${user.interest} · ${user.city}, ${user.state}`,
          confidence: Math.min(95, confidence),
          category: stateMatch ? "Local Mentee" : "Interest Match",
        });
      }
    });

  return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 6);
}

// ─── Query Answering ───
export function answerQuery(query: string, userState?: string): string {
  const q = query.toLowerCase();

  if (q.includes("trending") && (q.includes("area") || q.includes("location") || q.includes("region"))) {
    const state = userState || "Tamil Nadu";
    const demand = getDemandByLocation(state)[0];
    if (demand) {
      return `📍 In ${state}, the trending skills are: ${demand.topSkills.join(", ")}. Top business types: ${demand.topBusinessTypes.join(", ")}. Course demand score: ${demand.courseDemand}/100.`;
    }
    return "I couldn't find specific trends for your area. Try selecting your state in the demand analytics page.";
  }

  if (q.includes("profitable") || q.includes("business") && q.includes("best")) {
    const predictions = getBusinessPredictions();
    const top3 = predictions.slice(0, 3);
    return `💼 The most profitable business types right now are:\n${top3.map((p, i) => `${i + 1}. ${p.businessType} (Score: ${p.score}/100, Growing ${p.growth}%)`).join("\n")}\n\nTop states for these: ${top3.flatMap(p => p.topStates).filter((v, i, a) => a.indexOf(v) === i).slice(0, 5).join(", ")}`;
  }

  if (q.includes("course") || q.includes("learn") || q.includes("skill")) {
    const skills = getTrendingSkills().slice(0, 5);
    return `📚 Trending skills to learn:\n${skills.map((s, i) => `${i + 1}. ${s.skill} (Score: ${s.score}/100, Trend: ${s.trend})`).join("\n")}\n\nCheck the Courses page for available training programs.`;
  }

  if (q.includes("mentor") || q.includes("guidance")) {
    const mentors = MOCK_MENTORS.filter(m => m.status === "active").slice(0, 3);
    return `🧑‍🏫 Available mentors:\n${mentors.map(m => `• ${m.name} — ${m.expertise} (${m.experience} years, ⭐${m.rating})`).join("\n")}\n\nVisit the Mentorship page to send a request.`;
  }

  if (q.includes("demand") || q.includes("popular")) {
    const state = userState || "All India";
    const demand = getDemandByLocation(state);
    const top = demand.slice(0, 3);
    return `📊 Highest demand locations:\n${top.map(d => `• ${d.state}: Course ${d.courseDemand}/100, Product ${d.productDemand}/100`).join("\n")}\n\nVisit Demand Analytics for detailed insights.`;
  }

  if (q.includes("scheme") || q.includes("loan") || q.includes("government")) {
    return `🏛️ Popular government schemes:\n• PMMY Mudra Loan — Business loans up to ₹10 lakh\n• Stand-Up India — ₹10 lakh to ₹1 crore\n• PMKVY — Free skill training + ₹8,000 reward\n• Mahila E-Haat — Online marketplace for women\n\nVisit the Schemes page for state-specific options.`;
  }

  return `I can help with:\n• "What is trending in my area?"\n• "Which business is profitable here?"\n• "What courses should I learn?"\n• "Find me a mentor"\n• "What's in demand?"\n• "Government schemes available"\n\nTry asking one of these questions!`;
}
