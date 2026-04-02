// Indian States and Union Territories
export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
] as const;

export type IndianState = (typeof INDIAN_STATES)[number];

// State-specific scheme IDs (maps to scheme data)
export const STATE_SCHEMES: Record<string, string[]> = {
  "Tamil Nadu": ["tn-pudhu-vaazhvu", "tn-tnsrlm", "tn-amma-scheme", "tn-magalir-thittam"],
  "Maharashtra": ["mh-mjpjay", "mh-cmegp", "mh-ladki-bahin"],
  "Karnataka": ["ka-sanjeevini", "ka-stree-shakti", "ka-udyogini"],
  "Kerala": ["kl-kudumbashree", "kl-we-mission"],
  "Rajasthan": ["rj-bhamashah", "rj-priyadarshini"],
  "Uttar Pradesh": ["up-bc-sakhi", "up-kanya-sumangala"],
  "West Bengal": ["wb-kanyashree", "wb-lakshmir-bhandar"],
  "Gujarat": ["gj-mahila-samridhi", "gj-sakhi-mandal"],
  "Madhya Pradesh": ["mp-ladli-laxmi", "mp-mukhyamantri-kaushal"],
  "Andhra Pradesh": ["ap-she-teams", "ap-ys-aasara"],
  "Telangana": ["ts-she-teams", "ts-aasra"],
  "Bihar": ["br-mukhyamantri-kanya", "br-jeevika"],
  "Delhi": ["dl-ladli", "dl-mahila-samman"],
  "Haryana": ["hr-ladli", "hr-sakham"],
  "Punjab": ["pb-mai-bhago", "pb-mgnrega-women"],
};

// Questionnaire answer options
export const QUESTIONNAIRE_OPTIONS = {
  primaryGoal: ["Business", "Skill Development", "Job / Employment"],
  interests: ["Business & Entrepreneurship", "Technology & Digital", "Arts & Crafts", "Education & Teaching", "Food & Catering", "Beauty & Wellness", "Healthcare", "Agriculture"],
  skillLevel: ["Beginner", "Intermediate", "Advanced"],
  learningMode: ["Online", "Offline", "Hybrid (Both)"],
  needMentorship: ["Yes", "No"],
  mentorshipArea: ["Business Strategy", "Career Guidance", "Technical Skills", "Financial Planning"],
  govSchemeInterest: ["Yes", "No"],
  budget: ["Low (< ₹5,000)", "Medium (₹5,000 - ₹50,000)", "High (> ₹50,000)"],
  weeklyTime: ["Less than 5 hours", "5 - 10 hours", "More than 10 hours"],
  interestedInSelling: ["Yes", "No"],
  businessType: ["Handmade / Handicraft", "Digital Products / Services", "Food & Catering", "Fashion & Textiles", "Other Services"],
  preferLocal: ["Yes", "No"],
  motivation: ["Income & Financial Independence", "Passion & Creativity", "Growth & Learning"],
  needCertification: ["Yes", "No"],
  language: ["English", "Tamil", "Hindi", "Both English & Tamil", "Both English & Hindi"],
};

export interface QuestionnaireAnswers {
  primaryGoal?: string;
  interests?: string[];
  skillLevel?: string;
  learningMode?: string;
  needMentorship?: string;
  mentorshipArea?: string;
  govSchemeInterest?: string;
  budget?: string;
  weeklyTime?: string;
  interestedInSelling?: string;
  businessType?: string;
  preferLocal?: string;
  motivation?: string;
  needCertification?: string;
  language?: string;
}
