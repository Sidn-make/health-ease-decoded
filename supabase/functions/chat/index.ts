import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, documentContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let contextBlock = "";
    if (documentContext && Array.isArray(documentContext) && documentContext.length > 0) {
      contextBlock = `\n\nThe user has the following scanned documents on file. Use this context to give personalized advice:\n\n${documentContext.map((doc: any, i: number) => {
        let entry = `--- Document ${i + 1}: ${doc.title} ---\nType: ${doc.document_type || "Unknown"}\nSummary: ${doc.summary || "No summary"}\nScanned: ${doc.created_at ? new Date(doc.created_at).toLocaleDateString() : "Unknown"}`;
        if (doc.breakdown && Array.isArray(doc.breakdown)) {
          entry += `\nCost Breakdown:\n${doc.breakdown.map((b: any) => `  • ${b.label}: ${b.value}`).join("\n")}`;
        }
        if (doc.next_steps && Array.isArray(doc.next_steps)) {
          entry += `\nRecommended Next Steps:\n${doc.next_steps.map((s: string) => `  • ${s}`).join("\n")}`;
        }
        return entry;
      }).join("\n\n")}`;
    }

    const systemPrompt = `You are ClearCare AI, a friendly healthcare literacy assistant. Your job is to help people understand medical bills, insurance documents, EOBs (Explanation of Benefits), and healthcare terminology in plain, simple English.

Guidelines:
- Always explain things as if talking to someone with zero healthcare knowledge
- Use everyday analogies when possible
- When discussing costs, always clarify what the patient actually owes vs what insurance covers
- Highlight any potential billing errors or things to watch out for
- Suggest actionable next steps the user can take
- Be warm, reassuring, and never condescending
- If you're unsure about something, say so — never make up medical or financial advice
- Use bullet points and short paragraphs for readability
- When referencing dollar amounts, always provide context
- When the user asks about their documents, reference the specific details from their scanned entries below${contextBlock}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
