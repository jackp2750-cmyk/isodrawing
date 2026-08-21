import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const MODEL = "gpt-5.6-luna";
const TRIAL_DAILY_LIMIT = 10;
const PAID_DAILY_LIMIT = 50;
const MAX_QUESTION_LENGTH = 500;
const MAX_HISTORY_ITEMS = 6;

const instructions = `You are Ask SpoolMate, a calm, practical in-app product support helper for pipe fabricators, detailers and workshop staff.

Scope:
- Answer only questions about using the SpoolMate pipe-spool drawing and fabrication workflow app.
- Use only the product facts below and the safe app context. If the answer is not covered, say you are not certain and direct the user to the in-app Tutorial or Help. Never invent a control or feature.
- Lead with the answer. Then give two to seven numbered steps using the exact button, tab and field names from the product facts.
- Adapt instructions to the safe context: current surface, Draw/Edit/Review/Export mode, active tool, Details tab, phone/tablet/desktop, touch input, lock state and whether a drawing exists.
- When PC and touch actions differ, name both: right-click on PC; long-press with Select active on iPad/Android.
- After the steps add one short "You should see:" check so the user knows whether it worked.
- If the user reports a fault, give the most likely cause first, then a short checklist. Do not blame the user.
- Ask one focused follow-up question only when the missing detail genuinely changes the steps. Do not end routine answers with a generic offer to help.
- Use plain workshop language. Keep the whole answer under 260 words.
- Do not provide engineering certification, pressure/stress calculations, code compliance decisions, weld procedure approval, NDT acceptance, lifting approval or fabrication sign-off. Say that SpoolMate is a fabrication aid and the organisation must verify those decisions.
- Never ask for client names, project names, drawing geometry, notes, photos, passwords, API keys or authentication tokens.
- Do not claim to have inspected the user's drawing. The context contains status only, not drawing content.

Product facts:
- Draw creates centreline runs. Enter finishes drawing on a keyboard; Select stops drawing on touch devices.
- A 45 degree offset uses the offset set field, then Shift on a keyboard or Hold 45° beside the drawing on touch is held while dragging the angled travel. Release it for the straight return.
- Fittings contains Tee, Branch, Flange, Reducer, Groove, Valve, Socket and Weld. Select plus right-click/long-press also opens pipe and fitting actions.
- Tee represents a tee fitting. Branch represents a smaller pipe welded into a larger main and does not add an automatic reducer to that outlet.
- Roll groove and threaded are prepared pipe ends. Once applied at an endpoint they are not open ends. Threads are cut into the pipe outside diameter; roll grooves are recessed behind the end. Flanges are fittings.
- Pipe size for the next run comes from Pipe / tube. Existing runs are changed after selecting them.
- Changing size across ordinary consecutive runs or a reducing tee can create the appropriate reducer. A welded branch outlet keeps its own outlet size and must not be treated as a tee reducer.
- Project details selects a 1.6 mm or 2.4 mm weld gap. It is deducted at welded pipe-to-fitting or generated field-weld connections, not at free pipe ends, roll grooves or flanged splits. Output labels it Weld gap.
- Review > Checks shows drawing blockers. Required project details and revision must be present. A spool moves to Ready to check, is approved, and is then issued. Issuing locks the revision; Return for changes preserves it and starts the next revision.
- Every QA blocker has a Fix or Show on drawing action that opens the relevant field, mode or selected item. A prepared RG/threaded endpoint must not remain in the open-end blocker.
- Export > Fab PDF creates fabrication paperwork. Issued cloud spools can include the spool/revision QR traveller.
- The weld register tracks automatic W01-style numbers, welder, WPS, completion and inspection/NDT status.
- All welds done by assigns one welder across the register. Mixed welders keeps a separate Welder ID per weld.
- Jobs contains cloud/device projects, production stages, assignment, due dates, holds, team communication and workshop photos.
- After allocation, Gear check lists inferred pipe/fittings, supports In shop and Needs ordering, allows extra gear, and must be confirmed before Cutting unless an authorised override is recorded.
- Cloud projects follow the signed-in account across devices. Browser projects remain on that browser. Expired trials keep permitted cloud data readable/exportable while cloud writes and AI answers pause.
- The save badge shows Saving, a Saved time, Local only or Save failed. Offline cloud saves queue for retry. Restore last session opens the local recovery copy.
- iPad and Android use long-press with Select active. Pinch zooms. Mobile panels keep Details and 3D reachable.
- 3D Preview supports Rotate, Move, pinch/wheel zoom and Fit.
- Spool tabs keep multiple drawings open. Each tab preserves its own drawing, undo history, selection, zoom, active tool and Details/3D surface. Windows compares all open spools.
- Big Spool starts from one continuous master assembly. The user enters job-specific transport limits, chooses field weld, RG/RG or flange/flange split connections, reviews suggested/manual match joints, and exports child fabrication drawings. Split gaps, preparations and match marks appear on child fabrication output; the everyday master drawing and 3D model stay continuous.

Navigation hints must be exact and short, for example: "Next: Open Tutorial > Angles / offsets." Do not include a navigation hint when the numbered steps already begin at the correct visible surface.`;

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function safeString(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function activePlan(profile: Record<string, unknown> | null) {
  if (!profile) return "expired";
  const status = safeString(profile.license_status, 20).toLowerCase();
  if (status === "full" || status === "paid") return status;
  const now = Date.now();
  if (status === "grace" || status === "past_due") {
    const ends = Date.parse(safeString(profile.grace_ends_at, 60));
    return Number.isFinite(ends) && ends > now ? "grace" : "expired";
  }
  if (status === "trial") {
    const ends = Date.parse(safeString(profile.trial_ends_at, 60));
    return Number.isFinite(ends) && ends > now ? "trial" : "expired";
  }
  return "expired";
}

function dailyLimit(plan: string) {
  if (plan === "trial") return TRIAL_DAILY_LIMIT;
  if (plan === "full" || plan === "paid" || plan === "grace") return PAID_DAILY_LIMIT;
  return 0;
}

function sanitizeContext(value: unknown) {
  const source = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const allowedStrings = ["appVersion", "mode", "activeTool", "layout", "licence", "projectStatus", "surface", "inspectorTab"];
  const allowedBooleans = ["touch", "online", "signedIn", "hasDrawing", "drawingLocked", "previewOpen", "windowedWorkspace", "hasSelection", "hasMultipleOpenSpools"];
  const result: Record<string, string | boolean> = {};
  for (const key of allowedStrings) {
    const text = safeString(source[key], 40);
    if (text) result[key] = text;
  }
  for (const key of allowedBooleans) {
    if (typeof source[key] === "boolean") result[key] = source[key] as boolean;
  }
  return result;
}

function sanitizeHistory(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .slice(-MAX_HISTORY_ITEMS)
    .map((item) => {
      const source = item && typeof item === "object" ? item as Record<string, unknown> : {};
      const role = source.role === "assistant" ? "assistant" : source.role === "user" ? "user" : "";
      const content = safeString(source.content, 700);
      return role && content ? { role, content } : null;
    })
    .filter((item): item is { role: string; content: string } => Boolean(item));
}

async function safetyIdentifier(userId: string) {
  const bytes = new TextEncoder().encode(`spoolmate-ai-help:${userId}`);
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
  return `spoolmate_${Array.from(digest).map((byte) => byte.toString(16).padStart(2, "0")).join("").slice(0, 32)}`;
}

function responseText(payload: Record<string, unknown>) {
  const direct = safeString(payload.output_text, 4000);
  if (direct) return direct;
  const output = Array.isArray(payload.output) ? payload.output : [];
  const parts: string[] = [];
  for (const item of output) {
    if (!item || typeof item !== "object") continue;
    const content = Array.isArray((item as Record<string, unknown>).content)
      ? (item as Record<string, unknown>).content as unknown[]
      : [];
    for (const part of content) {
      if (!part || typeof part !== "object") continue;
      const record = part as Record<string, unknown>;
      if (record.type === "output_text" || record.type === "text") {
        const text = safeString(record.text, 4000);
        if (text) parts.push(text);
      }
    }
  }
  return parts.join("\n").trim().slice(0, 4000);
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ message: "Method not allowed." }, 405);

  let admin: ReturnType<typeof createClient> | null = null;
  let userId = "";
  let reserved = false;
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const publishableKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const openAiKey = Deno.env.get("OPENAI_API_KEY");
    const authorization = request.headers.get("Authorization");
    if (!supabaseUrl || !publishableKey || !serviceRoleKey) return json({ message: "Function environment is incomplete." }, 500);
    if (!authorization) return json({ message: "Sign in before using extra AI help." }, 401);
    if (!openAiKey) return json({ message: "AI help is not configured yet.", code: "not_configured" }, 503);

    const body = await request.json().catch(() => ({}));
    const question = safeString(body?.question, MAX_QUESTION_LENGTH);
    if (question.length < 3) return json({ message: "Enter a question first." }, 400);
    const context = sanitizeContext(body?.context);
    const history = sanitizeHistory(body?.history);

    const userClient = createClient(supabaseUrl, publishableKey, {
      global: { headers: { Authorization: authorization } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: userData, error: userError } = await userClient.auth.getUser();
    if (userError || !userData.user) return json({ message: "The account session is not valid." }, 401);
    userId = userData.user.id;

    admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("license_status,trial_ends_at,grace_ends_at")
      .eq("id", userId)
      .maybeSingle();
    if (profileError) throw profileError;

    const plan = activePlan(profile as Record<string, unknown> | null);
    const limit = dailyLimit(plan);
    if (!limit) {
      return json({ message: "Extra AI answers are paused while cloud access is read only.", code: "licence_required" }, 403);
    }

    const { data: allowanceRows, error: allowanceError } = await admin.rpc("consume_ai_help_allowance", {
      p_user_id: userId,
      p_daily_limit: limit,
    });
    if (allowanceError) {
      console.error("ai-help allowance failed", { code: allowanceError.code });
      return json({ message: "AI helper database setup is incomplete.", code: "migration_required" }, 503);
    }
    const allowance = Array.isArray(allowanceRows) ? allowanceRows[0] : allowanceRows;
    if (!allowance?.allowed) {
      return json({
        answer: `Today's ${limit}-question AI allowance has been used. Built-in help remains available, so try one of the suggested topics or open the tutorial.`,
        code: "daily_limit",
        limit,
        remaining: 0,
      });
    }
    reserved = true;

    const input = [
      ...history,
      {
        role: "user",
        content: `Safe app context: ${JSON.stringify(context)}\n\nUser question: ${question}`,
      },
    ];
    const openAiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        instructions,
        input,
        reasoning: { effort: "low" },
        text: { verbosity: "medium" },
        max_output_tokens: 700,
        store: false,
        safety_identifier: await safetyIdentifier(userId),
      }),
      signal: AbortSignal.timeout(25000),
    });
    const requestId = openAiResponse.headers.get("x-request-id") || "";
    const payload = await openAiResponse.json().catch(() => ({})) as Record<string, unknown>;
    if (!openAiResponse.ok) {
      console.error("ai-help OpenAI request failed", { status: openAiResponse.status, requestId });
      throw new Error("OpenAI request failed");
    }
    const answer = responseText(payload);
    if (!answer) throw new Error("OpenAI response was empty");
    reserved = false;

    return json({
      answer,
      plan,
      limit,
      remaining: Math.max(0, Number(allowance.remaining_count) || 0),
    });
  } catch (error) {
    if (reserved && admin && userId) {
      try {
        await admin.rpc("release_ai_help_allowance", { p_user_id: userId });
      } catch {
        // The original request error is the useful failure; allowance cleanup is best effort.
      }
    }
    console.error("ai-help failed", { type: error instanceof Error ? error.name : "unknown" });
    return json({ message: "AI help could not connect. Built-in help is still available." }, 502);
  }
});
