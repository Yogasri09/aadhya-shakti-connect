// AI-powered hybrid recommendation engine
// 1. Rules-based scoring of real DB items (schemes, courses, products) by location + interests
// 2. Lovable AI generates short personalized reasoning per top item

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ScoredItem {
  kind: "scheme" | "course" | "product";
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  state: string | null;
  city?: string | null;
  score: number;
  matchedOn: string[];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "Unauthorized" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: userData, error: authErr } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (authErr || !userData?.user) return json({ error: "Unauthorized" }, 401);
    const userId = userData.user.id;

    // Load profile + questionnaire
    const [{ data: profile }, { data: qResp }] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle(),
      supabase
        .from("questionnaire_responses")
        .select("responses, role")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    const responses = (qResp?.responses as Record<string, any>) || {};
    const interests: string[] = Array.isArray(responses.interests) ? responses.interests : [];
    const skillLevel: string = responses.skillLevel || "Beginner";
    const goal: string = responses.primaryGoal || "";
    const budget: string = responses.budget || "";
    const userState = parseState(profile?.location) || responses.state || "";
    const userCity = parseCity(profile?.location) || responses.city || "";

    // Pull active items
    const [schemesRes, coursesRes, productsRes] = await Promise.all([
      supabase.from("schemes").select("*").eq("is_active", true).limit(40),
      supabase.from("courses").select("*").eq("is_active", true).limit(40),
      supabase.from("products").select("*").eq("status", "approved").limit(40),
    ]);

    const interestKeywords = interests
      .flatMap((i) => i.toLowerCase().split(/[\s&,/]+/))
      .filter((w) => w.length > 2);

    const scoreItem = (
      kind: ScoredItem["kind"],
      item: any
    ): ScoredItem => {
      const matched: string[] = [];
      let score = 0;
      const blob = `${item.title || item.name || ""} ${item.description || ""} ${item.category || ""}`.toLowerCase();

      // Location match
      if (userState && item.state && item.state.toLowerCase().includes(userState.toLowerCase())) {
        score += 30;
        matched.push(`available in ${userState}`);
      }
      if (userCity && item.city && item.city.toLowerCase().includes(userCity.toLowerCase())) {
        score += 15;
        matched.push(`in your city`);
      }

      // Interest keyword match
      const hits = interestKeywords.filter((k) => blob.includes(k));
      if (hits.length) {
        score += Math.min(40, hits.length * 12);
        matched.push(`matches your interest in ${hits.slice(0, 2).join(", ")}`);
      }

      // Goal / skill alignment
      if (goal && blob.includes(goal.toLowerCase().split(" ")[0])) {
        score += 10;
        matched.push(`aligned with your goal: ${goal}`);
      }
      if (kind === "course" && item.level && item.level.toLowerCase() === skillLevel.toLowerCase()) {
        score += 15;
        matched.push(`suits ${skillLevel} level`);
      }

      // Budget hint for schemes
      if (kind === "scheme" && budget) {
        if (budget.toLowerCase().includes("low") && /shishu|small|micro/.test(blob)) {
          score += 12;
          matched.push("fits your budget range");
        }
        if (budget.toLowerCase().includes("high") && /stand-up|crore|lakh/.test(blob)) {
          score += 12;
          matched.push("fits your budget range");
        }
      }

      // Popularity nudge
      if (kind === "course" && item.enrolled_count > 100) score += 5;
      if (kind === "product" && item.views_count > 50) score += 5;

      // Baseline so items still appear without questionnaire
      score += 1;

      return {
        kind,
        id: item.id,
        title: item.title || item.name,
        description: item.description,
        category: item.category,
        state: item.state,
        city: item.city,
        score,
        matchedOn: matched,
      };
    };

    const ranked: ScoredItem[] = [
      ...(schemesRes.data || []).map((i) => scoreItem("scheme", i)),
      ...(coursesRes.data || []).map((i) => scoreItem("course", i)),
      ...(productsRes.data || []).map((i) => scoreItem("product", i)),
    ].sort((a, b) => b.score - a.score);

    // Take top 2 of each kind
    const pick = (kind: ScoredItem["kind"], n: number) =>
      ranked.filter((r) => r.kind === kind).slice(0, n);
    const top: ScoredItem[] = [...pick("scheme", 2), ...pick("course", 2), ...pick("product", 2)];

    // Generate reasoning with Lovable AI (single batched call)
    const reasoningMap = await generateReasoning(top, {
      name: profile?.full_name || "there",
      state: userState,
      interests,
      goal,
      skillLevel,
    });

    const enriched = top.map((t) => ({
      ...t,
      reason: reasoningMap[t.id] || defaultReason(t),
    }));

    return json({ recommendations: enriched, profile: { state: userState, interests, goal } });
  } catch (e) {
    console.error("ai-recommendations error", e);
    return json({ error: e instanceof Error ? e.message : "Unknown" }, 500);
  }
});

function parseState(loc?: string | null): string {
  if (!loc) return "";
  const parts = loc.split(",").map((s) => s.trim());
  return parts[parts.length - 1] || "";
}
function parseCity(loc?: string | null): string {
  if (!loc) return "";
  const parts = loc.split(",").map((s) => s.trim());
  return parts.length > 1 ? parts[0] : "";
}

function defaultReason(t: ScoredItem): string {
  if (t.matchedOn.length) return `Recommended because it ${t.matchedOn[0]}.`;
  return `A popular ${t.kind} you might like.`;
}

async function generateReasoning(
  items: ScoredItem[],
  user: { name: string; state: string; interests: string[]; goal: string; skillLevel: string }
): Promise<Record<string, string>> {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey || items.length === 0) return {};

  const itemList = items
    .map(
      (it, i) =>
        `${i + 1}. [${it.kind}] id=${it.id} | ${it.title} | matched: ${it.matchedOn.join("; ") || "general fit"}`
    )
    .join("\n");

  const systemPrompt = `You write ultra-short personalized reasoning (max 14 words each) for why a recommendation suits a woman entrepreneur in India. Always start with "Recommended because". Be warm, specific, and concrete. Avoid fluff.`;

  const userPrompt = `User: ${user.name}, in ${user.state || "India"}. Interests: ${user.interests.join(", ") || "general"}. Goal: ${user.goal || "growth"}. Skill: ${user.skillLevel}.

Items:
${itemList}

Return JSON via the tool.`;

  try {
    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "submit_reasons",
              description: "Submit a reason for each item",
              parameters: {
                type: "object",
                properties: {
                  reasons: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        reason: { type: "string" },
                      },
                      required: ["id", "reason"],
                    },
                  },
                },
                required: ["reasons"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "submit_reasons" } },
      }),
    });

    if (!resp.ok) {
      console.error("AI gateway error", resp.status, await resp.text());
      return {};
    }
    const data = await resp.json();
    const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    if (!args) return {};
    const parsed = JSON.parse(args);
    const map: Record<string, string> = {};
    for (const r of parsed.reasons || []) map[r.id] = r.reason;
    return map;
  } catch (e) {
    console.error("reasoning failure", e);
    return {};
  }
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
