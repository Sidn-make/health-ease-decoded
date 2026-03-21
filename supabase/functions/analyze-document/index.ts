import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageBase64 } = await req.json();
    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "No image provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are ClearCare AI, a healthcare document analyzer. Analyze the provided medical document image and extract structured information.

You MUST call the analyze_document function with your analysis.`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this healthcare document. Identify the document type, provider, date, and provide a plain-English summary. Break down any costs and give actionable next steps.",
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64,
                },
              },
            ],
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_document",
              description: "Return structured analysis of a healthcare document",
              parameters: {
                type: "object",
                properties: {
                  title: {
                    type: "string",
                    description: "A short descriptive title for this document (e.g., 'ER Visit Bill - Memorial Hospital')",
                  },
                  document_type: {
                    type: "string",
                    description: "Type of document: Medical Bill, EOB, Insurance Card, Lab Results, Prescription, or Other",
                  },
                  provider: {
                    type: "string",
                    description: "Healthcare provider or facility name",
                  },
                  date: {
                    type: "string",
                    description: "Date on the document if visible",
                  },
                  summary: {
                    type: "string",
                    description: "Plain-English summary of what this document is about, written for someone with no healthcare knowledge. 2-4 sentences.",
                  },
                  breakdown: {
                    type: "array",
                    description: "Cost breakdown items. Include at minimum: Total Charged, Insurance Paid, You Owe. If not a billing document, describe key data points instead.",
                    items: {
                      type: "object",
                      properties: {
                        label: { type: "string" },
                        value: { type: "string" },
                      },
                      required: ["label", "value"],
                    },
                  },
                  next_steps: {
                    type: "array",
                    description: "3-5 actionable next steps the person should take, in plain English",
                    items: { type: "string" },
                  },
                },
                required: ["title", "document_type", "summary", "breakdown", "next_steps"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "analyze_document" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      // Fallback: try to parse from message content
      return new Response(JSON.stringify({ error: "Could not analyze document. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const analysis = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
