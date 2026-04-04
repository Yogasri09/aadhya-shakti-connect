// ─── Demand Prediction Engine ───
// Rule-based heuristic system for location-based demand analytics

import { MOCK_USERS, MOCK_PRODUCTS, MOCK_COURSES, MOCK_MENTORS, MOCK_SELLERS } from "./mockDatabase";

// ─── Location Demand Scores ───
// Weighted scores derived from user interests, products, and course enrollment per state
export interface LocationDemand {
  state: string;
  courseDemand: number;
  productDemand: number;
  mentorshipDemand: number;
  topSkills: string[];
  topBusinessTypes: string[];
  trendingCourses: string[];
}

export interface SkillDemand {
  skill: string;
  score: number;
  states: string[];
  trend: "rising" | "stable" | "declining";
}

export interface BusinessPrediction {
  businessType: string;
  score: number;
  topStates: string[];
  growth: number;
}

// State-level demand weight mappings (realistic data)
const STATE_DEMAND_WEIGHTS: Record<string, { skills: Record<string, number>; businesses: Record<string, number> }> = {
  "Tamil Nadu": {
    skills: { "Tailoring": 92, "Handicrafts": 78, "Digital Marketing": 65, "Beauty & Wellness": 58, "Food & Catering": 70, "Technology": 55 },
    businesses: { "Handmade / Handicraft": 85, "Fashion & Textiles": 88, "Food & Catering": 72, "Digital Products / Services": 48 },
  },
  "Maharashtra": {
    skills: { "Digital Marketing": 85, "Beauty & Wellness": 72, "Handicrafts": 65, "Tailoring": 60, "Food & Catering": 55, "Technology": 78 },
    businesses: { "Digital Products / Services": 75, "Fashion & Textiles": 70, "Handmade / Handicraft": 68, "Food & Catering": 62 },
  },
  "Rajasthan": {
    skills: { "Handicrafts": 95, "Tailoring": 75, "Beauty & Wellness": 55, "Food & Catering": 50, "Digital Marketing": 40, "Agriculture": 60 },
    businesses: { "Handmade / Handicraft": 92, "Fashion & Textiles": 78, "Food & Catering": 45, "Other Services": 38 },
  },
  "Gujarat": {
    skills: { "Tailoring": 82, "Handicrafts": 80, "Food & Catering": 65, "Digital Marketing": 55, "Beauty & Wellness": 48 },
    businesses: { "Fashion & Textiles": 88, "Handmade / Handicraft": 82, "Food & Catering": 60, "Digital Products / Services": 42 },
  },
  "Kerala": {
    skills: { "Food & Catering": 88, "Beauty & Wellness": 75, "Digital Marketing": 70, "Healthcare": 65, "Handicrafts": 50 },
    businesses: { "Food & Catering": 85, "Beauty Products": 72, "Digital Products / Services": 65, "Other Services": 55 },
  },
  "Karnataka": {
    skills: { "Technology": 90, "Digital Marketing": 82, "Beauty & Wellness": 60, "Food & Catering": 55, "Handicrafts": 45 },
    businesses: { "Digital Products / Services": 85, "Fashion & Textiles": 55, "Food & Catering": 52, "Other Services": 48 },
  },
  "Uttar Pradesh": {
    skills: { "Handicrafts": 78, "Tailoring": 85, "Beauty & Wellness": 62, "Food & Catering": 72, "Agriculture": 68 },
    businesses: { "Handmade / Handicraft": 80, "Fashion & Textiles": 82, "Food & Catering": 70, "Other Services": 45 },
  },
  "West Bengal": {
    skills: { "Handicrafts": 88, "Tailoring": 65, "Food & Catering": 72, "Beauty & Wellness": 50, "Digital Marketing": 45 },
    businesses: { "Handmade / Handicraft": 90, "Fashion & Textiles": 68, "Food & Catering": 65, "Other Services": 40 },
  },
  "Telangana": {
    skills: { "Technology": 82, "Digital Marketing": 75, "Handicrafts": 60, "Beauty & Wellness": 55, "Tailoring": 50 },
    businesses: { "Digital Products / Services": 78, "Fashion & Textiles": 62, "Handmade / Handicraft": 58, "Food & Catering": 48 },
  },
  "Andhra Pradesh": {
    skills: { "Handicrafts": 72, "Agriculture": 68, "Tailoring": 65, "Beauty & Wellness": 62, "Food & Catering": 58 },
    businesses: { "Handmade / Handicraft": 75, "Fashion & Textiles": 65, "Food & Catering": 60, "Other Services": 42 },
  },
  "Delhi": {
    skills: { "Digital Marketing": 88, "Beauty & Wellness": 80, "Technology": 75, "Tailoring": 55, "Food & Catering": 65 },
    businesses: { "Digital Products / Services": 82, "Beauty Products": 78, "Fashion & Textiles": 72, "Food & Catering": 65 },
  },
  "Bihar": {
    skills: { "Handicrafts": 70, "Tailoring": 75, "Agriculture": 72, "Food & Catering": 60, "Beauty & Wellness": 45 },
    businesses: { "Handmade / Handicraft": 72, "Fashion & Textiles": 68, "Food & Catering": 55, "Other Services": 38 },
  },
  "Madhya Pradesh": {
    skills: { "Food & Catering": 78, "Handicrafts": 72, "Tailoring": 68, "Agriculture": 65, "Beauty & Wellness": 50 },
    businesses: { "Food & Catering": 80, "Handmade / Handicraft": 72, "Fashion & Textiles": 60, "Other Services": 42 },
  },
  "Punjab": {
    skills: { "Tailoring": 80, "Food & Catering": 75, "Beauty & Wellness": 68, "Handicrafts": 65, "Agriculture": 60 },
    businesses: { "Fashion & Textiles": 78, "Food & Catering": 75, "Handmade / Handicraft": 62, "Beauty Products": 58 },
  },
  "Haryana": {
    skills: { "Technology": 72, "Tailoring": 68, "Beauty & Wellness": 65, "Food & Catering": 60, "Digital Marketing": 70 },
    businesses: { "Digital Products / Services": 70, "Fashion & Textiles": 65, "Food & Catering": 58, "Other Services": 50 },
  },
  "Odisha": {
    skills: { "Handicrafts": 85, "Tailoring": 60, "Agriculture": 65, "Food & Catering": 55, "Beauty & Wellness": 42 },
    businesses: { "Handmade / Handicraft": 88, "Fashion & Textiles": 55, "Food & Catering": 50, "Other Services": 35 },
  },
};

// ─── Core Demand Functions ───

export function getDemandByLocation(state?: string): LocationDemand[] {
  const states = state ? [state] : Object.keys(STATE_DEMAND_WEIGHTS);

  return states.map(s => {
    const weights = STATE_DEMAND_WEIGHTS[s] || { skills: {}, businesses: {} };
    const usersInState = MOCK_USERS.filter(u => u.state === s);
    const productsInState = MOCK_PRODUCTS.filter(p => p.state === s);
    const mentorsInState = MOCK_MENTORS.filter(m => m.state === s);

    // Calculate demand scores
    const courseDemand = Math.round(
      (usersInState.length * 12) +
      Object.values(weights.skills).reduce((a, b) => a + b, 0) / Object.keys(weights.skills).length
    );
    const productDemand = Math.round(
      (productsInState.length * 15) +
      Object.values(weights.businesses).reduce((a, b) => a + b, 0) / Object.keys(weights.businesses).length
    );
    const mentorshipDemand = Math.round(
      (usersInState.filter(u => u.role === "user").length * 10) -
      (mentorsInState.length * 8) + 50
    );

    const sortedSkills = Object.entries(weights.skills).sort((a, b) => b[1] - a[1]);
    const sortedBiz = Object.entries(weights.businesses).sort((a, b) => b[1] - a[1]);

    return {
      state: s,
      courseDemand: Math.min(100, courseDemand),
      productDemand: Math.min(100, productDemand),
      mentorshipDemand: Math.max(10, Math.min(100, mentorshipDemand)),
      topSkills: sortedSkills.slice(0, 3).map(([k]) => k),
      topBusinessTypes: sortedBiz.slice(0, 3).map(([k]) => k),
      trendingCourses: MOCK_COURSES
        .filter(c => c.state === s || c.state === "All India")
        .sort((a, b) => b.enrolled - a.enrolled)
        .slice(0, 3)
        .map(c => c.title),
    };
  }).sort((a, b) => (b.courseDemand + b.productDemand) - (a.courseDemand + a.productDemand));
}

export function getTrendingSkills(): SkillDemand[] {
  const skillMap = new Map<string, { totalScore: number; states: Set<string>; count: number }>();

  Object.entries(STATE_DEMAND_WEIGHTS).forEach(([state, { skills }]) => {
    Object.entries(skills).forEach(([skill, score]) => {
      const existing = skillMap.get(skill) || { totalScore: 0, states: new Set<string>(), count: 0 };
      existing.totalScore += score;
      existing.states.add(state);
      existing.count += 1;
      skillMap.set(skill, existing);
    });
  });

  // Also factor in user interest counts
  MOCK_USERS.forEach(u => {
    const existing = skillMap.get(u.interest);
    if (existing) existing.totalScore += 5;
  });

  return Array.from(skillMap.entries())
    .map(([skill, data]) => ({
      skill,
      score: Math.round(data.totalScore / data.count),
      states: Array.from(data.states).slice(0, 5),
      trend: (data.totalScore / data.count) > 70 ? "rising" as const :
             (data.totalScore / data.count) > 50 ? "stable" as const : "declining" as const,
    }))
    .sort((a, b) => b.score - a.score);
}

export function getBusinessPredictions(): BusinessPrediction[] {
  const bizMap = new Map<string, { totalScore: number; states: string[]; count: number }>();

  Object.entries(STATE_DEMAND_WEIGHTS).forEach(([state, { businesses }]) => {
    Object.entries(businesses).forEach(([biz, score]) => {
      const existing = bizMap.get(biz) || { totalScore: 0, states: [], count: 0 };
      existing.totalScore += score;
      if (score >= 70) existing.states.push(state);
      existing.count += 1;
      bizMap.set(biz, existing);
    });
  });

  return Array.from(bizMap.entries())
    .map(([businessType, data]) => ({
      businessType,
      score: Math.round(data.totalScore / data.count),
      topStates: data.states.slice(0, 5),
      growth: Math.round((data.totalScore / data.count - 50) * 1.5),
    }))
    .sort((a, b) => b.score - a.score);
}

export function getLocationHeatmapData() {
  return Object.entries(STATE_DEMAND_WEIGHTS).map(([state, { skills, businesses }]) => {
    const avgSkill = Object.values(skills).reduce((a, b) => a + b, 0) / Object.keys(skills).length;
    const avgBiz = Object.values(businesses).reduce((a, b) => a + b, 0) / Object.keys(businesses).length;
    const userCount = MOCK_USERS.filter(u => u.state === state).length;

    return {
      state,
      skillDemand: Math.round(avgSkill),
      businessDemand: Math.round(avgBiz),
      userCount,
      totalScore: Math.round((avgSkill + avgBiz) / 2 + userCount * 3),
    };
  }).sort((a, b) => b.totalScore - a.totalScore);
}

export function getSkillDemandForState(state: string) {
  const weights = STATE_DEMAND_WEIGHTS[state];
  if (!weights) return [];

  return Object.entries(weights.skills)
    .map(([skill, score]) => ({ skill, score }))
    .sort((a, b) => b.score - a.score);
}

export function getBusinessDemandForState(state: string) {
  const weights = STATE_DEMAND_WEIGHTS[state];
  if (!weights) return [];

  return Object.entries(weights.businesses)
    .map(([businessType, score]) => ({ businessType, score }))
    .sort((a, b) => b.score - a.score);
}

// ─── Product Category Stats ───
export function getProductCategoryStats() {
  const categories = new Map<string, number>();
  MOCK_PRODUCTS.forEach(p => {
    categories.set(p.category, (categories.get(p.category) || 0) + 1);
  });
  return Array.from(categories.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

// ─── Mentor Expertise Stats ───
export function getMentorExpertiseStats() {
  const expertise = new Map<string, number>();
  MOCK_MENTORS.forEach(m => {
    expertise.set(m.expertise, (expertise.get(m.expertise) || 0) + 1);
  });
  return Array.from(expertise.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

// ─── Mentee Category Stats ───
export function getMenteeCategoryStats() {
  const categories = new Map<string, number>();
  MOCK_USERS.filter(u => u.role === "user").forEach(u => {
    categories.set(u.interest, (categories.get(u.interest) || 0) + 1);
  });
  return Array.from(categories.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

// ─── Most Searched Courses ───
export function getMostSearchedCourses() {
  return [...MOCK_COURSES]
    .sort((a, b) => b.enrolled - a.enrolled)
    .slice(0, 8)
    .map(c => ({ name: c.title.length > 25 ? c.title.substring(0, 25) + "..." : c.title, enrolled: c.enrolled }));
}

// ─── Demand Trend Data (Mock time-series) ───
export function getDemandTrendData() {
  return [
    { month: "Oct", tailoring: 55, handicrafts: 48, digital: 38, beauty: 42, food: 35 },
    { month: "Nov", tailoring: 60, handicrafts: 52, digital: 42, beauty: 45, food: 38 },
    { month: "Dec", tailoring: 58, handicrafts: 55, digital: 48, beauty: 48, food: 40 },
    { month: "Jan", tailoring: 65, handicrafts: 60, digital: 52, beauty: 50, food: 45 },
    { month: "Feb", tailoring: 72, handicrafts: 65, digital: 58, beauty: 55, food: 48 },
    { month: "Mar", tailoring: 78, handicrafts: 72, digital: 62, beauty: 58, food: 52 },
    { month: "Apr", tailoring: 85, handicrafts: 78, digital: 68, beauty: 62, food: 55 },
  ];
}

// Seller demand trend (individual seller perspective)
export function getSellerDemandTrend() {
  return [
    { month: "Oct", views: 180, orders: 8 },
    { month: "Nov", views: 250, orders: 12 },
    { month: "Dec", views: 320, orders: 15 },
    { month: "Jan", views: 280, orders: 14 },
    { month: "Feb", views: 380, orders: 18 },
    { month: "Mar", views: 450, orders: 22 },
    { month: "Apr", views: 520, orders: 27 },
  ];
}
