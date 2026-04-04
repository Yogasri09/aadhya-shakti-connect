// ─── Mock Database for Aadhya Shakti Connect ───
// Realistic data powering all modules before Supabase integration

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "seller" | "mentor" | "admin";
  status: "active" | "suspended";
  joined: string;
  state: string;
  city: string;
  interest: string;
  questionnaire?: Record<string, unknown>;
}

export interface MockMentor {
  id: string;
  userId: string;
  name: string;
  email: string;
  expertise: string;
  experience: number;
  state: string;
  city: string;
  menteeCount: number;
  sessionsCompleted: number;
  rating: number;
  availability: string;
  languages: string[];
  mentoringType: string;
  status: "active" | "pending";
  questionnaireCompleted: boolean;
}

export interface MockSeller {
  id: string;
  userId: string;
  name: string;
  email: string;
  businessType: string;
  state: string;
  city: string;
  productCount: number;
  totalViews: number;
  totalOrders: number;
  rating: number;
  status: "active" | "pending" | "approved";
  questionnaireCompleted: boolean;
}

export interface MockProduct {
  id: string;
  sellerId: string;
  sellerName: string;
  name: string;
  category: string;
  price: number;
  description: string;
  state: string;
  city: string;
  views: number;
  orders: number;
  status: "active" | "pending" | "out_of_stock";
  createdAt: string;
}

export interface MockCourse {
  id: string;
  title: string;
  category: string;
  provider: string;
  duration: string;
  level: string;
  enrolled: number;
  rating: number;
  state: string;
  isFree: boolean;
}

export interface MockScheme {
  id: string;
  name: string;
  ministry: string;
  category: string;
  applications: number;
  states: string[];
  status: "active" | "upcoming";
}

export interface MentorRequest {
  id: string;
  mentorId: string;
  userId: string;
  userName: string;
  userState: string;
  userCity: string;
  userInterest: string;
  message: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

export interface MockNotification {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: "info" | "success" | "warning" | "demand";
  read: boolean;
  createdAt: string;
  role: "all" | "admin" | "mentor" | "seller" | "user";
}

// ─── USERS (30+) ───
export const MOCK_USERS: MockUser[] = [
  { id: "u1", name: "Priya Sharma", email: "priya@email.com", role: "user", status: "active", joined: "2025-11-10", state: "Delhi", city: "New Delhi", interest: "Tailoring" },
  { id: "u2", name: "Anita Verma", email: "anita@email.com", role: "seller", status: "active", joined: "2025-12-01", state: "Maharashtra", city: "Mumbai", interest: "Handicrafts" },
  { id: "u3", name: "Kavitha R", email: "kavitha@email.com", role: "mentor", status: "active", joined: "2026-01-15", state: "Tamil Nadu", city: "Chennai", interest: "Business Strategy" },
  { id: "u4", name: "Meena Devi", email: "meena@email.com", role: "user", status: "active", joined: "2026-02-20", state: "Rajasthan", city: "Jaipur", interest: "Beauty & Wellness" },
  { id: "u5", name: "Sunita Yadav", email: "sunita@email.com", role: "user", status: "suspended", joined: "2026-01-05", state: "Uttar Pradesh", city: "Lucknow", interest: "Food & Catering" },
  { id: "u6", name: "Rekha Gupta", email: "rekha@email.com", role: "seller", status: "active", joined: "2026-03-01", state: "West Bengal", city: "Kolkata", interest: "Handicrafts" },
  { id: "u7", name: "Lakshmi N", email: "lakshmi@email.com", role: "user", status: "active", joined: "2026-03-10", state: "Telangana", city: "Hyderabad", interest: "Technology" },
  { id: "u8", name: "Deepa Mishra", email: "deepa@email.com", role: "mentor", status: "active", joined: "2025-10-20", state: "Maharashtra", city: "Pune", interest: "Career Guidance" },
  { id: "u9", name: "Fatima Khan", email: "fatima@email.com", role: "user", status: "active", joined: "2026-01-18", state: "Karnataka", city: "Bangalore", interest: "Digital Marketing" },
  { id: "u10", name: "Geeta Patel", email: "geeta@email.com", role: "seller", status: "active", joined: "2026-02-15", state: "Gujarat", city: "Ahmedabad", interest: "Textiles" },
  { id: "u11", name: "Aarti Singh", email: "aarti@email.com", role: "user", status: "active", joined: "2025-09-12", state: "Tamil Nadu", city: "Coimbatore", interest: "Tailoring" },
  { id: "u12", name: "Bhavna Joshi", email: "bhavna@email.com", role: "user", status: "active", joined: "2025-10-05", state: "Tamil Nadu", city: "Madurai", interest: "Handicrafts" },
  { id: "u13", name: "Chandni Verma", email: "chandni@email.com", role: "user", status: "active", joined: "2025-11-22", state: "Kerala", city: "Kochi", interest: "Food & Catering" },
  { id: "u14", name: "Divya Menon", email: "divya@email.com", role: "mentor", status: "active", joined: "2025-12-18", state: "Kerala", city: "Trivandrum", interest: "Financial Planning" },
  { id: "u15", name: "Esha Reddy", email: "esha@email.com", role: "user", status: "active", joined: "2026-01-08", state: "Andhra Pradesh", city: "Visakhapatnam", interest: "Beauty & Wellness" },
  { id: "u16", name: "Farida Begum", email: "farida@email.com", role: "seller", status: "active", joined: "2026-01-25", state: "Telangana", city: "Hyderabad", interest: "Embroidery" },
  { id: "u17", name: "Girija Nair", email: "girija@email.com", role: "user", status: "active", joined: "2026-02-02", state: "Tamil Nadu", city: "Chennai", interest: "Technology" },
  { id: "u18", name: "Harini S", email: "harini@email.com", role: "user", status: "active", joined: "2026-02-14", state: "Karnataka", city: "Mysore", interest: "Teaching" },
  { id: "u19", name: "Indira Kumari", email: "indira@email.com", role: "user", status: "active", joined: "2026-02-28", state: "Bihar", city: "Patna", interest: "Handicrafts" },
  { id: "u20", name: "Jaya Prakash", email: "jaya@email.com", role: "seller", status: "active", joined: "2026-03-05", state: "Madhya Pradesh", city: "Bhopal", interest: "Food & Catering" },
  { id: "u21", name: "Kamala Devi", email: "kamala@email.com", role: "user", status: "active", joined: "2026-03-12", state: "Odisha", city: "Bhubaneswar", interest: "Handicrafts" },
  { id: "u22", name: "Lalitha R", email: "lalitha@email.com", role: "user", status: "active", joined: "2026-03-15", state: "Tamil Nadu", city: "Salem", interest: "Tailoring" },
  { id: "u23", name: "Manju Bai", email: "manju@email.com", role: "mentor", status: "active", joined: "2026-01-20", state: "Rajasthan", city: "Udaipur", interest: "Business Strategy" },
  { id: "u24", name: "Nandini K", email: "nandini@email.com", role: "user", status: "active", joined: "2026-03-18", state: "Karnataka", city: "Hubli", interest: "Agriculture" },
  { id: "u25", name: "Om Shanti", email: "omshanti@email.com", role: "admin", status: "active", joined: "2025-06-01", state: "Delhi", city: "New Delhi", interest: "Administration" },
  { id: "u26", name: "Padma Lakshmi", email: "padma@email.com", role: "user", status: "active", joined: "2026-03-20", state: "Andhra Pradesh", city: "Vijayawada", interest: "Beauty & Wellness" },
  { id: "u27", name: "Radha Krishna", email: "radha@email.com", role: "seller", status: "active", joined: "2026-03-22", state: "Uttar Pradesh", city: "Varanasi", interest: "Handicrafts" },
  { id: "u28", name: "Savitri Devi", email: "savitri@email.com", role: "user", status: "active", joined: "2026-03-25", state: "Haryana", city: "Gurugram", interest: "Technology" },
  { id: "u29", name: "Tulsi Bai", email: "tulsi@email.com", role: "user", status: "active", joined: "2026-03-28", state: "Madhya Pradesh", city: "Indore", interest: "Food & Catering" },
  { id: "u30", name: "Uma Shankar", email: "uma@email.com", role: "mentor", status: "active", joined: "2026-02-10", state: "Gujarat", city: "Surat", interest: "Technical Skills" },
  { id: "u31", name: "Vijaya Shree", email: "vijaya@email.com", role: "user", status: "active", joined: "2026-03-30", state: "Tamil Nadu", city: "Tirunelveli", interest: "Tailoring" },
  { id: "u32", name: "Wahida Bi", email: "wahida@email.com", role: "user", status: "active", joined: "2026-04-01", state: "Kerala", city: "Kozhikode", interest: "Food & Catering" },
];

// ─── MENTORS (10+) ───
export const MOCK_MENTORS: MockMentor[] = [
  { id: "m1", userId: "u3", name: "Kavitha R", email: "kavitha@email.com", expertise: "Business Strategy", experience: 15, state: "Tamil Nadu", city: "Chennai", menteeCount: 8, sessionsCompleted: 34, rating: 4.8, availability: "10 hrs/week", languages: ["English", "Tamil"], mentoringType: "Career", status: "active", questionnaireCompleted: true },
  { id: "m2", userId: "u8", name: "Deepa Mishra", email: "deepa@email.com", expertise: "Career Guidance", experience: 12, state: "Maharashtra", city: "Pune", menteeCount: 6, sessionsCompleted: 28, rating: 4.7, availability: "8 hrs/week", languages: ["English", "Hindi", "Marathi"], mentoringType: "Career", status: "active", questionnaireCompleted: true },
  { id: "m3", userId: "u14", name: "Divya Menon", email: "divya@email.com", expertise: "Financial Planning", experience: 10, state: "Kerala", city: "Trivandrum", menteeCount: 5, sessionsCompleted: 22, rating: 4.9, availability: "6 hrs/week", languages: ["English", "Malayalam"], mentoringType: "Business", status: "active", questionnaireCompleted: true },
  { id: "m4", userId: "u23", name: "Manju Bai", email: "manju@email.com", expertise: "Business Strategy", experience: 8, state: "Rajasthan", city: "Udaipur", menteeCount: 4, sessionsCompleted: 18, rating: 4.5, availability: "5 hrs/week", languages: ["Hindi", "English"], mentoringType: "Business", status: "active", questionnaireCompleted: true },
  { id: "m5", userId: "u30", name: "Uma Shankar", email: "uma@email.com", expertise: "Technical Skills", experience: 7, state: "Gujarat", city: "Surat", menteeCount: 3, sessionsCompleted: 12, rating: 4.6, availability: "8 hrs/week", languages: ["English", "Hindi", "Gujarati"], mentoringType: "Technical", status: "active", questionnaireCompleted: true },
  { id: "m6", userId: "", name: "Pooja Nair", email: "pooja.n@email.com", expertise: "Digital Marketing", experience: 9, state: "Karnataka", city: "Bangalore", menteeCount: 7, sessionsCompleted: 30, rating: 4.8, availability: "10 hrs/week", languages: ["English", "Kannada"], mentoringType: "Technical", status: "active", questionnaireCompleted: true },
  { id: "m7", userId: "", name: "Rekha Bhatia", email: "rekha.b@email.com", expertise: "Fashion & Career", experience: 11, state: "Delhi", city: "New Delhi", menteeCount: 5, sessionsCompleted: 25, rating: 4.4, availability: "6 hrs/week", languages: ["English", "Hindi"], mentoringType: "Career", status: "active", questionnaireCompleted: true },
  { id: "m8", userId: "", name: "Shanti Mishra", email: "shanti@email.com", expertise: "Business Finance", experience: 14, state: "Uttar Pradesh", city: "Lucknow", menteeCount: 4, sessionsCompleted: 20, rating: 4.7, availability: "5 hrs/week", languages: ["Hindi", "English"], mentoringType: "Business", status: "active", questionnaireCompleted: true },
  { id: "m9", userId: "", name: "Archana Pillai", email: "archana@email.com", expertise: "Healthcare Training", experience: 6, state: "Tamil Nadu", city: "Coimbatore", menteeCount: 2, sessionsCompleted: 8, rating: 4.3, availability: "4 hrs/week", languages: ["English", "Tamil"], mentoringType: "Technical", status: "pending", questionnaireCompleted: false },
  { id: "m10", userId: "", name: "Bhagyalakshmi", email: "bhagya@email.com", expertise: "Arts & Crafts", experience: 20, state: "Andhra Pradesh", city: "Vijayawada", menteeCount: 6, sessionsCompleted: 40, rating: 4.9, availability: "8 hrs/week", languages: ["English", "Telugu"], mentoringType: "Technical", status: "active", questionnaireCompleted: true },
];

// ─── SELLERS (10+) ───
export const MOCK_SELLERS: MockSeller[] = [
  { id: "s1", userId: "u2", name: "Anita Verma", email: "anita@email.com", businessType: "Handicrafts", state: "Maharashtra", city: "Mumbai", productCount: 8, totalViews: 1240, totalOrders: 45, rating: 4.6, status: "active", questionnaireCompleted: true },
  { id: "s2", userId: "u6", name: "Rekha Gupta", email: "rekha@email.com", businessType: "Handicrafts", state: "West Bengal", city: "Kolkata", productCount: 5, totalViews: 820, totalOrders: 28, rating: 4.4, status: "active", questionnaireCompleted: true },
  { id: "s3", userId: "u10", name: "Geeta Patel", email: "geeta@email.com", businessType: "Textiles", state: "Gujarat", city: "Ahmedabad", productCount: 12, totalViews: 2100, totalOrders: 67, rating: 4.8, status: "active", questionnaireCompleted: true },
  { id: "s4", userId: "u16", name: "Farida Begum", email: "farida@email.com", businessType: "Embroidery", state: "Telangana", city: "Hyderabad", productCount: 6, totalViews: 950, totalOrders: 32, rating: 4.5, status: "active", questionnaireCompleted: true },
  { id: "s5", userId: "u20", name: "Jaya Prakash", email: "jaya@email.com", businessType: "Food & Catering", state: "Madhya Pradesh", city: "Bhopal", productCount: 4, totalViews: 560, totalOrders: 18, rating: 4.3, status: "active", questionnaireCompleted: true },
  { id: "s6", userId: "u27", name: "Radha Krishna", email: "radha@email.com", businessType: "Handicrafts", state: "Uttar Pradesh", city: "Varanasi", productCount: 9, totalViews: 1500, totalOrders: 52, rating: 4.7, status: "active", questionnaireCompleted: true },
  { id: "s7", userId: "", name: "Sarala Kumari", email: "sarala@email.com", businessType: "Fashion & Textiles", state: "Tamil Nadu", city: "Chennai", productCount: 7, totalViews: 1100, totalOrders: 38, rating: 4.5, status: "active", questionnaireCompleted: true },
  { id: "s8", userId: "", name: "Nirmala Devi", email: "nirmala@email.com", businessType: "Beauty Products", state: "Kerala", city: "Kochi", productCount: 3, totalViews: 420, totalOrders: 14, rating: 4.2, status: "pending", questionnaireCompleted: false },
  { id: "s9", userId: "", name: "Kamini Rao", email: "kamini@email.com", businessType: "Digital Products", state: "Karnataka", city: "Bangalore", productCount: 5, totalViews: 780, totalOrders: 22, rating: 4.6, status: "active", questionnaireCompleted: true },
  { id: "s10", userId: "", name: "Pushpa Devi", email: "pushpa@email.com", businessType: "Handicrafts", state: "Rajasthan", city: "Jaipur", productCount: 11, totalViews: 1800, totalOrders: 58, rating: 4.8, status: "active", questionnaireCompleted: true },
];

// ─── PRODUCTS (20+) ───
export const MOCK_PRODUCTS: MockProduct[] = [
  { id: "p1", sellerId: "s1", sellerName: "Anita Verma", name: "Hand-stitched Kurta", category: "Fashion & Textiles", price: 1200, description: "Beautiful hand-stitched cotton kurta with traditional embroidery", state: "Maharashtra", city: "Mumbai", views: 320, orders: 12, status: "active", createdAt: "2026-01-15" },
  { id: "p2", sellerId: "s1", sellerName: "Anita Verma", name: "Embroidered Dupatta", category: "Fashion & Textiles", price: 800, description: "Handmade embroidered dupatta with mirror work", state: "Maharashtra", city: "Mumbai", views: 280, orders: 9, status: "active", createdAt: "2026-02-01" },
  { id: "p3", sellerId: "s2", sellerName: "Rekha Gupta", name: "Terracotta Planters", category: "Handicrafts", price: 450, description: "Hand-painted terracotta planters set of 3", state: "West Bengal", city: "Kolkata", views: 190, orders: 7, status: "active", createdAt: "2026-03-05" },
  { id: "p4", sellerId: "s3", sellerName: "Geeta Patel", name: "Bandhani Saree", category: "Fashion & Textiles", price: 3500, description: "Traditional Bandhani tie-dye saree from Gujarat", state: "Gujarat", city: "Ahmedabad", views: 520, orders: 18, status: "active", createdAt: "2025-12-20" },
  { id: "p5", sellerId: "s3", sellerName: "Geeta Patel", name: "Patola Silk Stole", category: "Fashion & Textiles", price: 2200, description: "Authentic Patola silk stole with geometric patterns", state: "Gujarat", city: "Ahmedabad", views: 410, orders: 14, status: "active", createdAt: "2026-01-08" },
  { id: "p6", sellerId: "s4", sellerName: "Farida Begum", name: "Zardozi Clutch Bag", category: "Accessories", price: 1500, description: "Zardozi embroidered evening clutch bag", state: "Telangana", city: "Hyderabad", views: 250, orders: 8, status: "active", createdAt: "2026-02-14" },
  { id: "p7", sellerId: "s5", sellerName: "Jaya Prakash", name: "Pickles Combo Pack", category: "Food & Beverages", price: 350, description: "Assorted homemade pickles - Mango, Lemon, Mixed", state: "Madhya Pradesh", city: "Bhopal", views: 180, orders: 15, status: "active", createdAt: "2026-01-22" },
  { id: "p8", sellerId: "s5", sellerName: "Jaya Prakash", name: "Bhutte ka Kees Mix", category: "Food & Beverages", price: 200, description: "Ready-to-cook Bhutte ka Kees spice mix", state: "Madhya Pradesh", city: "Bhopal", views: 95, orders: 6, status: "active", createdAt: "2026-03-10" },
  { id: "p9", sellerId: "s6", sellerName: "Radha Krishna", name: "Banarasi Silk Scarf", category: "Fashion & Textiles", price: 1800, description: "Pure Banarasi silk scarf with golden zari", state: "Uttar Pradesh", city: "Varanasi", views: 380, orders: 13, status: "active", createdAt: "2025-11-28" },
  { id: "p10", sellerId: "s6", sellerName: "Radha Krishna", name: "Wooden Block Print Set", category: "Handicrafts", price: 650, description: "Hand-carved wooden block printing stamps set", state: "Uttar Pradesh", city: "Varanasi", views: 220, orders: 9, status: "active", createdAt: "2026-02-08" },
  { id: "p11", sellerId: "s7", sellerName: "Sarala Kumari", name: "Kanchipuram Silk Blouse", category: "Fashion & Textiles", price: 2800, description: "Ready-made Kanchipuram silk blouse with temple design", state: "Tamil Nadu", city: "Chennai", views: 290, orders: 10, status: "active", createdAt: "2026-01-30" },
  { id: "p12", sellerId: "s7", sellerName: "Sarala Kumari", name: "Cotton Kalamkari Bag", category: "Accessories", price: 500, description: "Handmade Kalamkari print cotton tote bag", state: "Tamil Nadu", city: "Chennai", views: 160, orders: 6, status: "active", createdAt: "2026-03-02" },
  { id: "p13", sellerId: "s9", sellerName: "Kamini Rao", name: "Social Media Course", category: "Digital Products", price: 999, description: "Complete social media marketing for women entrepreneurs", state: "Karnataka", city: "Bangalore", views: 450, orders: 22, status: "active", createdAt: "2026-01-12" },
  { id: "p14", sellerId: "s10", sellerName: "Pushpa Devi", name: "Blue Pottery Vase", category: "Handicrafts", price: 1200, description: "Traditional Jaipur blue pottery flower vase", state: "Rajasthan", city: "Jaipur", views: 340, orders: 11, status: "active", createdAt: "2025-12-15" },
  { id: "p15", sellerId: "s10", sellerName: "Pushpa Devi", name: "Lac Bangles Set", category: "Accessories", price: 350, description: "Handmade lac bangles with mirror work - set of 6", state: "Rajasthan", city: "Jaipur", views: 280, orders: 16, status: "active", createdAt: "2026-02-22" },
  { id: "p16", sellerId: "s10", sellerName: "Pushpa Devi", name: "Hand-painted Diary", category: "Handicrafts", price: 250, description: "Miniature hand-painted Rajasthani diary", state: "Rajasthan", city: "Jaipur", views: 190, orders: 8, status: "active", createdAt: "2026-03-08" },
  { id: "p17", sellerId: "s1", sellerName: "Anita Verma", name: "Warli Art Frame", category: "Handicrafts", price: 900, description: "Hand-painted Warli art on canvas with frame", state: "Maharashtra", city: "Mumbai", views: 210, orders: 7, status: "active", createdAt: "2026-03-15" },
  { id: "p18", sellerId: "s2", sellerName: "Rekha Gupta", name: "Kantha Embroidery Cushion", category: "Home Decor", price: 600, description: "Traditional Kantha stitch cushion cover pair", state: "West Bengal", city: "Kolkata", views: 175, orders: 5, status: "active", createdAt: "2026-03-18" },
  { id: "p19", sellerId: "s3", sellerName: "Geeta Patel", name: "Ajrakh Print Dupatta", category: "Fashion & Textiles", price: 1100, description: "Hand-block printed Ajrakh dupatta on modal silk", state: "Gujarat", city: "Ahmedabad", views: 320, orders: 11, status: "active", createdAt: "2026-03-20" },
  { id: "p20", sellerId: "s8", sellerName: "Nirmala Devi", name: "Herbal Face Pack", category: "Beauty & Wellness", price: 280, description: "Organic herbal face pack with turmeric and neem", state: "Kerala", city: "Kochi", views: 120, orders: 4, status: "pending", createdAt: "2026-03-25" },
  { id: "p21", sellerId: "s4", sellerName: "Farida Begum", name: "Chikankari Top", category: "Fashion & Textiles", price: 950, description: "Hand-embroidered Chikankari georgette top", state: "Telangana", city: "Hyderabad", views: 260, orders: 9, status: "active", createdAt: "2026-03-12" },
];

// ─── COURSES (15+) ───
export const MOCK_COURSES: MockCourse[] = [
  { id: "c1", title: "Beautician & Cosmetology", category: "Beauty & Wellness", provider: "NSDC", duration: "3 months", level: "Beginner", enrolled: 342, rating: 4.5, state: "All India", isFree: true },
  { id: "c2", title: "Digital Marketing Fundamentals", category: "Technology & Digital", provider: "Google", duration: "6 weeks", level: "Beginner", enrolled: 567, rating: 4.7, state: "All India", isFree: true },
  { id: "c3", title: "Tailoring & Fashion Design", category: "Arts & Crafts", provider: "KVIC", duration: "4 months", level: "Beginner", enrolled: 289, rating: 4.4, state: "Tamil Nadu", isFree: true },
  { id: "c4", title: "Food Processing & Preservation", category: "Food & Catering", provider: "FSSAI", duration: "3 months", level: "Intermediate", enrolled: 198, rating: 4.3, state: "All India", isFree: true },
  { id: "c5", title: "Entrepreneurship Development", category: "Business & Entrepreneurship", provider: "NIESBUD", duration: "3 months", level: "Intermediate", enrolled: 234, rating: 4.6, state: "All India", isFree: true },
  { id: "c6", title: "Handicraft Training Program", category: "Arts & Crafts", provider: "DC Handicrafts", duration: "4 months", level: "Beginner", enrolled: 178, rating: 4.5, state: "Rajasthan", isFree: true },
  { id: "c7", title: "Teacher Training (D.El.Ed)", category: "Education & Teaching", provider: "NIOS", duration: "2 years", level: "Advanced", enrolled: 445, rating: 4.2, state: "All India", isFree: false },
  { id: "c8", title: "Organic Farming Basics", category: "Agriculture", provider: "ICAR", duration: "6 weeks", level: "Beginner", enrolled: 156, rating: 4.4, state: "All India", isFree: true },
  { id: "c9", title: "E-commerce for Women", category: "Business & Entrepreneurship", provider: "Flipkart Samarth", duration: "4 weeks", level: "Beginner", enrolled: 312, rating: 4.6, state: "All India", isFree: true },
  { id: "c10", title: "Healthcare Assistant Training", category: "Healthcare", provider: "NSDC", duration: "6 months", level: "Intermediate", enrolled: 201, rating: 4.3, state: "All India", isFree: true },
  { id: "c11", title: "Kalamkari Art Workshop", category: "Arts & Crafts", provider: "APCO", duration: "2 months", level: "Beginner", enrolled: 89, rating: 4.7, state: "Andhra Pradesh", isFree: true },
  { id: "c12", title: "Phulkari Embroidery", category: "Arts & Crafts", provider: "Punjab Handloom", duration: "3 months", level: "Intermediate", enrolled: 67, rating: 4.5, state: "Punjab", isFree: true },
  { id: "c13", title: "Spoken English & Communication", category: "Education & Teaching", provider: "British Council", duration: "2 months", level: "Beginner", enrolled: 523, rating: 4.4, state: "All India", isFree: false },
  { id: "c14", title: "Financial Literacy for Women", category: "Business & Entrepreneurship", provider: "RBI", duration: "4 weeks", level: "Beginner", enrolled: 278, rating: 4.5, state: "All India", isFree: true },
  { id: "c15", title: "Handloom Weaving Advanced", category: "Arts & Crafts", provider: "NIFT", duration: "6 months", level: "Advanced", enrolled: 112, rating: 4.8, state: "Tamil Nadu", isFree: false },
];

// ─── SCHEMES (10+) ───
export const MOCK_SCHEMES: MockScheme[] = [
  { id: "sc1", name: "PMMY - Mudra Loan", ministry: "Ministry of Finance", category: "Business Loan", applications: 2340, states: ["All India"], status: "active" },
  { id: "sc2", name: "Stand-Up India", ministry: "Ministry of Finance", category: "Business Loan", applications: 1890, states: ["All India"], status: "active" },
  { id: "sc3", name: "PMEGP", ministry: "Ministry of MSME", category: "Self-Employment", applications: 1560, states: ["All India"], status: "active" },
  { id: "sc4", name: "Startup India", ministry: "DPIIT", category: "Startup Support", applications: 980, states: ["All India"], status: "active" },
  { id: "sc5", name: "Mahila E-Haat", ministry: "Ministry of WCD", category: "E-Commerce", applications: 3120, states: ["All India"], status: "active" },
  { id: "sc6", name: "DDU-GKY", ministry: "Ministry of Rural Dev", category: "Skill Training", applications: 1450, states: ["All India"], status: "active" },
  { id: "sc7", name: "PMKVY - Skill India", ministry: "MSDE", category: "Skill Training", applications: 2670, states: ["All India"], status: "active" },
  { id: "sc8", name: "TN Magalir Thittam", ministry: "TN State Govt", category: "Women Empowerment", applications: 780, states: ["Tamil Nadu"], status: "active" },
  { id: "sc9", name: "Kudumbashree", ministry: "Kerala State Govt", category: "Women Empowerment", applications: 920, states: ["Kerala"], status: "active" },
  { id: "sc10", name: "Stree Shakti", ministry: "Karnataka State Govt", category: "Self-Help Groups", applications: 650, states: ["Karnataka"], status: "active" },
  { id: "sc11", name: "Ladli Laxmi Yojana", ministry: "MP State Govt", category: "Women Welfare", applications: 1200, states: ["Madhya Pradesh"], status: "active" },
  { id: "sc12", name: "Kanyashree Prakalpa", ministry: "WB State Govt", category: "Education", applications: 890, states: ["West Bengal"], status: "active" },
];

// ─── MENTOR REQUESTS ───
export const MOCK_MENTOR_REQUESTS: MentorRequest[] = [
  { id: "mr1", mentorId: "m1", userId: "u1", userName: "Priya Sharma", userState: "Delhi", userCity: "New Delhi", userInterest: "Tailoring", message: "I want to learn how to start a tailoring business. Need guidance on pricing and finding customers.", status: "pending", createdAt: "2026-03-28" },
  { id: "mr2", mentorId: "m1", userId: "u11", userName: "Aarti Singh", userState: "Tamil Nadu", userCity: "Coimbatore", userInterest: "Tailoring", message: "Looking for mentorship in advanced stitching techniques and business expansion.", status: "pending", createdAt: "2026-03-25" },
  { id: "mr3", mentorId: "m1", userId: "u4", userName: "Meena Devi", userState: "Rajasthan", userCity: "Jaipur", userInterest: "Beauty & Wellness", message: "Want career guidance for starting a beauty salon business.", status: "accepted", createdAt: "2026-03-20" },
  { id: "mr4", mentorId: "m2", userId: "u9", userName: "Fatima Khan", userState: "Karnataka", userCity: "Bangalore", userInterest: "Digital Marketing", message: "Need help with building my personal brand online.", status: "pending", createdAt: "2026-03-30" },
  { id: "mr5", mentorId: "m2", userId: "u7", userName: "Lakshmi N", userState: "Telangana", userCity: "Hyderabad", userInterest: "Technology", message: "Want mentorship for transitioning into a tech career.", status: "accepted", createdAt: "2026-03-15" },
  { id: "mr6", mentorId: "m3", userId: "u13", userName: "Chandni Verma", userState: "Kerala", userCity: "Kochi", userInterest: "Food & Catering", message: "Need financial planning help for my catering startup.", status: "pending", createdAt: "2026-04-01" },
  { id: "mr7", mentorId: "m4", userId: "u19", userName: "Indira Kumari", userState: "Bihar", userCity: "Patna", userInterest: "Handicrafts", message: "Want to learn how to scale my handicraft business.", status: "pending", createdAt: "2026-03-29" },
  { id: "mr8", mentorId: "m5", userId: "u28", userName: "Savitri Devi", userState: "Haryana", userCity: "Gurugram", userInterest: "Technology", message: "Interested in learning web development basics.", status: "pending", createdAt: "2026-04-02" },
];

// ─── NOTIFICATIONS ───
export const MOCK_NOTIFICATIONS: MockNotification[] = [
  { id: "n1", userId: "", title: "New User Registered 🎉", description: "Vijaya Shree from Tamil Nadu joined the platform.", type: "info", read: false, createdAt: "2026-04-03T10:30:00", role: "admin" },
  { id: "n2", userId: "", title: "New Product Added 🛒", description: "Herbal Face Pack by Nirmala Devi is pending approval.", type: "info", read: false, createdAt: "2026-04-03T09:15:00", role: "admin" },
  { id: "n3", userId: "", title: "Demand Surge Alert 📈", description: "Tamil Nadu: Tailoring courses demand increased by 35%.", type: "demand", read: false, createdAt: "2026-04-02T14:00:00", role: "admin" },
  { id: "n4", userId: "", title: "New Mentee Request 📩", description: "Priya Sharma is requesting mentorship in Tailoring.", type: "info", read: false, createdAt: "2026-03-28T11:00:00", role: "mentor" },
  { id: "n5", userId: "", title: "Session Reminder ⏰", description: "You have a mentoring session with Meena Devi tomorrow at 10 AM.", type: "warning", read: false, createdAt: "2026-04-03T08:00:00", role: "mentor" },
  { id: "n6", userId: "", title: "Mentee Completed Course ✅", description: "Rekha Sharma completed the Beautician Training course.", type: "success", read: true, createdAt: "2026-04-01T16:00:00", role: "mentor" },
  { id: "n7", userId: "", title: "New Order Received 🛍️", description: "Hand-stitched Kurta ordered by a customer from Delhi.", type: "success", read: false, createdAt: "2026-04-03T12:00:00", role: "seller" },
  { id: "n8", userId: "", title: "Product Views Spike 👀", description: "Your Bandhani Saree got 120 views today!", type: "info", read: false, createdAt: "2026-04-03T07:30:00", role: "seller" },
  { id: "n9", userId: "", title: "Demand Insight 📊", description: "Handicrafts demand is rising in Rajasthan. Consider listing more products.", type: "demand", read: false, createdAt: "2026-04-02T10:00:00", role: "seller" },
  { id: "n10", userId: "", title: "New Scheme Available 🏛️", description: "PMKVY 4.0 training scheme is now open for applications.", type: "info", read: false, createdAt: "2026-04-01T09:00:00", role: "all" },
  { id: "n11", userId: "", title: "Course Recommendation 📚", description: "Based on your interest, try 'E-commerce for Women' course.", type: "info", read: false, createdAt: "2026-04-02T15:00:00", role: "user" },
  { id: "n12", userId: "", title: "Expo Coming Up 🎪", description: "Women Entrepreneur Expo in Delhi on April 15, 2026.", type: "info", read: true, createdAt: "2026-03-30T11:00:00", role: "all" },
];

// ─── GROWTH DATA ───
export const GROWTH_DATA = [
  { month: "Oct", users: 680, sellers: 35, mentors: 12, products: 85, courses: 10 },
  { month: "Nov", users: 780, sellers: 45, mentors: 15, products: 120, courses: 12 },
  { month: "Dec", users: 870, sellers: 58, mentors: 18, products: 155, courses: 13 },
  { month: "Jan", users: 960, sellers: 65, mentors: 20, products: 180, courses: 14 },
  { month: "Feb", users: 1080, sellers: 75, mentors: 22, products: 205, courses: 15 },
  { month: "Mar", users: 1180, sellers: 82, mentors: 24, products: 230, courses: 15 },
  { month: "Apr", users: 1290, sellers: 88, mentors: 26, products: 250, courses: 16 },
];

// ─── HELPER FUNCTIONS ───
export function getUsersByRole(role: string) {
  return MOCK_USERS.filter(u => u.role === role);
}

export function getUsersByState(state: string) {
  return MOCK_USERS.filter(u => u.state === state);
}

export function getProductsByCategory(category: string) {
  return MOCK_PRODUCTS.filter(p => p.category === category);
}

export function getProductsBySeller(sellerId: string) {
  return MOCK_PRODUCTS.filter(p => p.sellerId === sellerId);
}

export function getMentorRequestsByMentor(mentorId: string) {
  return MOCK_MENTOR_REQUESTS.filter(r => r.mentorId === mentorId);
}

export function getNotificationsByRole(role: string) {
  return MOCK_NOTIFICATIONS.filter(n => n.role === role || n.role === "all");
}

export function getStats() {
  return {
    totalUsers: MOCK_USERS.length,
    totalSellers: MOCK_SELLERS.length,
    totalMentors: MOCK_MENTORS.length,
    totalProducts: MOCK_PRODUCTS.length,
    totalCourses: MOCK_COURSES.length,
    totalSchemes: MOCK_SCHEMES.length,
    activeUsers: MOCK_USERS.filter(u => u.status === "active").length,
    pendingSellers: MOCK_SELLERS.filter(s => s.status === "pending").length,
  };
}
