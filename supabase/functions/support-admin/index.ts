import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const licenceStatuses = new Set(["trial", "paid", "grace", "full", "expired"]);
const memberRoles = new Set(["owner", "admin", "designer", "checker", "workshop", "viewer", "member"]);
const memberStatuses = new Set(["pending", "invited", "approved", "suspended", "rejected"]);
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type AdminClient = ReturnType<typeof createClient>;
type JsonRecord = Record<string, unknown>;

function json(body: JsonRecord, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

function cleanText(value: unknown, max = 500) {
  return String(value ?? "").trim().slice(0, max);
}

function requireUuid(value: unknown, label = "User") {
  const id = cleanText(value, 40);
  if (!uuidPattern.test(id)) throw new Error(`${label} identifier is invalid.`);
  return id;
}

function requireReason(value: unknown) {
  const reason = cleanText(value, 500);
  if (reason.length < 8) throw new Error("Enter a support reason of at least 8 characters.");
  return reason;
}

function boundedInteger(value: unknown, fallback: number, minimum: number, maximum: number) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(minimum, Math.min(maximum, parsed));
}

function addDays(days: number) {
  return new Date(Date.now() + days * 86_400_000).toISOString();
}

function isActiveLicence(record: Record<string, unknown> | null | undefined) {
  const status = cleanText(record?.license_status, 20).toLowerCase();
  if (status === "paid" || status === "full") return true;
  const endValue = status === "trial" ? record?.trial_ends_at : status === "grace" ? record?.grace_ends_at : null;
  const end = endValue ? new Date(String(endValue)).getTime() : 0;
  return end > Date.now();
}

function publicUser(user: any) {
  return {
    id: user.id,
    email: user.email ?? "",
    phone: user.phone ?? "",
    createdAt: user.created_at ?? null,
    lastSignInAt: user.last_sign_in_at ?? null,
    confirmedAt: user.confirmed_at ?? user.email_confirmed_at ?? null,
    bannedUntil: user.banned_until ?? null,
    accountType: cleanText(user.user_metadata?.account_type, 20),
    displayName: cleanText(user.user_metadata?.full_name ?? user.user_metadata?.name, 80),
  };
}

async function allAuthUsers(admin: AdminClient) {
  const users: any[] = [];
  for (let page = 1; page <= 20; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    const batch = data?.users ?? [];
    users.push(...batch);
    if (batch.length < 1000) break;
  }
  return users;
}

async function authenticateOperator(request: Request) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const publishableKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const authorization = request.headers.get("Authorization");
  if (!supabaseUrl || !publishableKey || !serviceRoleKey) throw new Error("Support function environment is incomplete.");
  if (!authorization) return { denied: json({ ok: false, message: "Sign in before opening Support Admin." }, 401) };

  const userClient = createClient(supabaseUrl, publishableKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: userData, error: userError } = await userClient.auth.getUser();
  if (userError || !userData.user) return { denied: json({ ok: false, message: "The account session is not valid." }, 401) };

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: operator, error: operatorError } = await admin
    .from("platform_support_admins")
    .select("user_id,display_name,active")
    .eq("user_id", userData.user.id)
    .eq("active", true)
    .maybeSingle();
  if (operatorError) throw operatorError;
  if (!operator) return { denied: json({ ok: false, message: "This account is not a SpoolMate platform administrator." }, 403) };

  return { admin, user: userData.user, operator };
}

async function startAudit(
  admin: AdminClient,
  operatorId: string,
  action: string,
  reason: string,
  options: { targetUserId?: string | null; targetCompanyId?: string | null; before?: unknown } = {},
) {
  const { data, error } = await admin
    .from("support_admin_audit_log")
    .insert({
      admin_user_id: operatorId,
      target_user_id: options.targetUserId ?? null,
      target_company_id: options.targetCompanyId ?? null,
      action,
      reason,
      before_state: options.before ?? {},
      after_state: { status: "started" },
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

async function finishAudit(admin: AdminClient, auditId: number, after: unknown) {
  const { error } = await admin
    .from("support_admin_audit_log")
    .update({ after_state: after ?? {} })
    .eq("id", auditId);
  if (error) throw error;
}

async function failAudit(admin: AdminClient, auditId: number, error: unknown) {
  await admin
    .from("support_admin_audit_log")
    .update({
      after_state: {
        status: "failed",
        message: error instanceof Error ? error.message.slice(0, 300) : "Support action failed.",
      },
    })
    .eq("id", auditId);
}

async function overview(admin: AdminClient, operator: any) {
  const [users, profilesResult, companiesResult, projectCountResult, auditResult] = await Promise.all([
    allAuthUsers(admin),
    admin.from("profiles").select("license_status,trial_ends_at,grace_ends_at"),
    admin.from("companies").select("license_status,trial_ends_at,grace_ends_at"),
    admin.from("spool_projects").select("id", { count: "exact", head: true }),
    admin
      .from("support_admin_audit_log")
      .select("id,action,reason,target_user_id,target_company_id,created_at,after_state")
      .order("created_at", { ascending: false })
      .limit(12),
  ]);
  if (profilesResult.error) throw profilesResult.error;
  if (companiesResult.error) throw companiesResult.error;
  if (projectCountResult.error) throw projectCountResult.error;
  if (auditResult.error) throw auditResult.error;

  const thirtyDaysAgo = Date.now() - 30 * 86_400_000;
  const profiles = profilesResult.data ?? [];
  const companies = companiesResult.data ?? [];
  return {
    operator: { id: operator.user_id, displayName: operator.display_name },
    stats: {
      users: users.length,
      activeUsers30d: users.filter((user) => new Date(user.last_sign_in_at ?? 0).getTime() >= thirtyDaysAgo).length,
      personalTrials: profiles.filter((profile) => profile.license_status === "trial").length,
      personalExpired: profiles.filter((profile) => !isActiveLicence(profile)).length,
      businesses: companies.length,
      activeBusinesses: companies.filter(isActiveLicence).length,
      cloudSpools: projectCountResult.count ?? 0,
    },
    recentAudit: auditResult.data ?? [],
  };
}

async function searchUsers(admin: AdminClient, queryValue: unknown) {
  const query = cleanText(queryValue, 120).toLowerCase();
  if (query.length < 2) return [];
  const users = (await allAuthUsers(admin))
    .filter((user) => {
      const haystack = [
        user.id,
        user.email,
        user.phone,
        user.user_metadata?.full_name,
        user.user_metadata?.name,
        user.user_metadata?.business_name,
      ].map((value) => String(value ?? "").toLowerCase()).join(" ");
      return haystack.includes(query);
    })
    .slice(0, 25);
  if (!users.length) return [];

  const ids = users.map((user) => user.id);
  const [profilesResult, membershipsResult, projectsResult] = await Promise.all([
    admin.from("profiles").select("id,license_status,trial_ends_at,grace_ends_at").in("id", ids),
    admin.from("company_members").select("user_id,company_id,status").in("user_id", ids),
    admin.from("spool_projects").select("id,owner_id").in("owner_id", ids),
  ]);
  if (profilesResult.error) throw profilesResult.error;
  if (membershipsResult.error) throw membershipsResult.error;
  if (projectsResult.error) throw projectsResult.error;

  return users.map((user) => {
    const profile = (profilesResult.data ?? []).find((row) => row.id === user.id) ?? null;
    return {
      ...publicUser(user),
      licenceStatus: profile?.license_status ?? "setup",
      licenceActive: isActiveLicence(profile),
      businesses: (membershipsResult.data ?? []).filter((row) => row.user_id === user.id).length,
      cloudSpools: (projectsResult.data ?? []).filter((row) => row.owner_id === user.id).length,
    };
  });
}

async function userDetail(admin: AdminClient, operatorId: string, targetUserId: string) {
  const userResult = await admin.auth.admin.getUserById(targetUserId);
  if (userResult.error || !userResult.data.user) throw userResult.error ?? new Error("User not found.");
  const [profileResult, membershipsResult, projectsResult, auditResult] = await Promise.all([
    admin.from("profiles").select("*").eq("id", targetUserId).maybeSingle(),
    admin.from("company_members").select("company_id,user_id,email,role,status,created_at,updated_at").eq("user_id", targetUserId),
    admin
      .from("spool_projects")
      .select("id,name,company_id,updated_at,project_info")
      .eq("owner_id", targetUserId)
      .order("updated_at", { ascending: false })
      .limit(50),
    admin
      .from("support_admin_audit_log")
      .select("id,action,reason,created_at,before_state,after_state,target_company_id")
      .eq("target_user_id", targetUserId)
      .order("created_at", { ascending: false })
      .limit(30),
  ]);
  if (profileResult.error) throw profileResult.error;
  if (membershipsResult.error) throw membershipsResult.error;
  if (projectsResult.error) throw projectsResult.error;
  if (auditResult.error) throw auditResult.error;

  const companyIds = [...new Set((membershipsResult.data ?? []).map((row) => row.company_id))];
  const companiesResult = companyIds.length
    ? await admin
      .from("companies")
      .select("id,name,created_by,license_status,trial_started_at,trial_ends_at,grace_ends_at,included_seats,extra_seats,created_at")
      .in("id", companyIds)
    : { data: [], error: null };
  if (companiesResult.error) throw companiesResult.error;

  await admin.from("support_admin_audit_log").insert({
    admin_user_id: operatorId,
    target_user_id: targetUserId,
    action: "view_user",
    reason: "Support account viewed from the console.",
    before_state: {},
    after_state: { status: "viewed" },
  });

  const companies = companiesResult.data ?? [];
  return {
    user: publicUser(userResult.data.user),
    profile: profileResult.data,
    memberships: (membershipsResult.data ?? []).map((membership) => ({
      ...membership,
      company: companies.find((company) => company.id === membership.company_id) ?? null,
    })),
    projects: (projectsResult.data ?? []).map((project) => ({
      id: project.id,
      name: project.name,
      companyId: project.company_id,
      updatedAt: project.updated_at,
      jobNumber: cleanText(project.project_info?.jobNumber ?? project.project_info?.job_number, 80),
      spoolNumber: cleanText(project.project_info?.spoolNumber ?? project.project_info?.spool_number, 80),
      status: cleanText(project.project_info?.status, 40),
    })),
    audit: auditResult.data ?? [],
  };
}

async function setPersonalLicence(admin: AdminClient, operatorId: string, body: any) {
  const targetUserId = requireUuid(body.targetUserId);
  const reason = requireReason(body.reason);
  const status = cleanText(body.status, 20).toLowerCase();
  if (!licenceStatuses.has(status)) throw new Error("Personal licence status is invalid.");
  const days = boundedInteger(body.days, status === "grace" ? 7 : 30, 1, 3650);
  const { data: before, error: beforeError } = await admin.from("profiles").select("*").eq("id", targetUserId).maybeSingle();
  if (beforeError) throw beforeError;
  const userResult = await admin.auth.admin.getUserById(targetUserId);
  if (userResult.error || !userResult.data.user) throw userResult.error ?? new Error("User not found.");

  const next: Record<string, unknown> = {
    id: targetUserId,
    email: userResult.data.user.email ?? before?.email ?? null,
    license_status: status,
    trial_started_at: before?.trial_started_at ?? new Date().toISOString(),
    trial_ends_at: before?.trial_ends_at ?? addDays(30),
    grace_ends_at: null,
    updated_at: new Date().toISOString(),
  };
  if (status === "trial") next.trial_ends_at = addDays(days);
  if (status === "grace") next.grace_ends_at = addDays(days);

  const auditId = await startAudit(admin, operatorId, "set_personal_licence", reason, { targetUserId, before });
  try {
    const { data: after, error } = await admin.from("profiles").upsert(next, { onConflict: "id" }).select("*").single();
    if (error) throw error;
    await finishAudit(admin, auditId, after);
    return after;
  } catch (error) {
    await failAudit(admin, auditId, error);
    throw error;
  }
}

async function setCompanyEntitlements(admin: AdminClient, operatorId: string, body: any) {
  const companyId = requireUuid(body.companyId, "Company");
  const targetUserId = requireUuid(body.targetUserId);
  const reason = requireReason(body.reason);
  const status = cleanText(body.status, 20).toLowerCase();
  if (!licenceStatuses.has(status)) throw new Error("Business licence status is invalid.");
  const days = boundedInteger(body.days, status === "grace" ? 7 : 30, 1, 3650);
  const includedSeats = boundedInteger(body.includedSeats, 5, 1, 10000);
  const extraSeats = boundedInteger(body.extraSeats, 0, 0, 10000);
  const { data: before, error: beforeError } = await admin.from("companies").select("*").eq("id", companyId).single();
  if (beforeError) throw beforeError;
  const next: Record<string, unknown> = {
    license_status: status,
    included_seats: includedSeats,
    extra_seats: extraSeats,
    grace_ends_at: null,
    updated_at: new Date().toISOString(),
  };
  if (status === "trial") next.trial_ends_at = addDays(days);
  if (status === "grace") next.grace_ends_at = addDays(days);

  const auditId = await startAudit(admin, operatorId, "set_company_entitlements", reason, {
    targetUserId,
    targetCompanyId: companyId,
    before,
  });
  try {
    const { data: after, error } = await admin.from("companies").update(next).eq("id", companyId).select("*").single();
    if (error) throw error;
    await finishAudit(admin, auditId, after);
    return after;
  } catch (error) {
    await failAudit(admin, auditId, error);
    throw error;
  }
}

async function setMembership(admin: AdminClient, operatorId: string, body: any) {
  const targetUserId = requireUuid(body.targetUserId);
  const companyId = requireUuid(body.companyId, "Company");
  const reason = requireReason(body.reason);
  const role = cleanText(body.role, 20).toLowerCase();
  const status = cleanText(body.status, 20).toLowerCase();
  if (!memberRoles.has(role) || !memberStatuses.has(status)) throw new Error("Membership role or status is invalid.");
  const { data: before, error: beforeError } = await admin
    .from("company_members")
    .select("*")
    .eq("company_id", companyId)
    .eq("user_id", targetUserId)
    .single();
  if (beforeError) throw beforeError;
  if (before.role === "owner" && (role !== "owner" || status !== "approved")) {
    throw new Error("Business ownership needs a separate ownership-transfer workflow.");
  }
  if (before.role !== "owner" && role === "owner") {
    throw new Error("Use the ownership-transfer workflow before assigning an Owner.");
  }

  const auditId = await startAudit(admin, operatorId, "set_company_membership", reason, {
    targetUserId,
    targetCompanyId: companyId,
    before,
  });
  try {
    const { data: after, error } = await admin
      .from("company_members")
      .update({ role, status, updated_at: new Date().toISOString() })
      .eq("company_id", companyId)
      .eq("user_id", targetUserId)
      .select("*")
      .single();
    if (error) throw error;
    await finishAudit(admin, auditId, after);
    return after;
  } catch (error) {
    await failAudit(admin, auditId, error);
    throw error;
  }
}

async function sendPasswordReset(admin: AdminClient, operatorId: string, body: any) {
  const targetUserId = requireUuid(body.targetUserId);
  const reason = requireReason(body.reason);
  const userResult = await admin.auth.admin.getUserById(targetUserId);
  if (userResult.error || !userResult.data.user?.email) throw userResult.error ?? new Error("This user has no email address.");
  const rawRedirect = cleanText(body.redirectTo, 500);
  let redirectTo: string | undefined;
  if (rawRedirect) {
    const url = new URL(rawRedirect);
    if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("Password-reset return URL is invalid.");
    url.search = "";
    url.hash = "";
    redirectTo = url.toString();
  }
  const auditId = await startAudit(admin, operatorId, "send_password_reset", reason, {
    targetUserId,
    before: { email: userResult.data.user.email },
  });
  try {
    const { error } = await admin.auth.resetPasswordForEmail(userResult.data.user.email, redirectTo ? { redirectTo } : undefined);
    if (error) throw error;
    const after = { status: "sent", sentAt: new Date().toISOString() };
    await finishAudit(admin, auditId, after);
    return after;
  } catch (error) {
    await failAudit(admin, auditId, error);
    throw error;
  }
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ ok: false, message: "Method not allowed." }, 405);

  try {
    const auth = await authenticateOperator(request);
    if (auth.denied) return auth.denied;
    const { admin, user, operator } = auth as { admin: AdminClient; user: any; operator: any };
    const body = await request.json().catch(() => ({}));
    const action = cleanText(body?.action, 80).toLowerCase();

    if (action === "me") {
      return json({ ok: true, authorised: true, operator: { id: user.id, displayName: operator.display_name } });
    }
    if (action === "overview") {
      return json({ ok: true, ...(await overview(admin, operator)) });
    }
    if (action === "search") {
      return json({ ok: true, users: await searchUsers(admin, body?.query) });
    }
    if (action === "detail") {
      const targetUserId = requireUuid(body?.targetUserId);
      return json({ ok: true, detail: await userDetail(admin, user.id, targetUserId) });
    }
    if (action === "set-personal-licence") {
      return json({ ok: true, profile: await setPersonalLicence(admin, user.id, body) });
    }
    if (action === "set-company-entitlements") {
      return json({ ok: true, company: await setCompanyEntitlements(admin, user.id, body) });
    }
    if (action === "set-membership") {
      return json({ ok: true, membership: await setMembership(admin, user.id, body) });
    }
    if (action === "send-password-reset") {
      return json({ ok: true, result: await sendPasswordReset(admin, user.id, body) });
    }
    return json({ ok: false, message: "Unknown support action." }, 400);
  } catch (error) {
    console.error("support-admin failed", error);
    const message = error instanceof Error ? error.message : "Support Admin request failed.";
    const status = /invalid|reason|unknown|ownership|email address|not found/i.test(message) ? 400 : 500;
    return json({ ok: false, message }, status);
  }
});
