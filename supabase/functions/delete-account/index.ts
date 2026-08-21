import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function storageFilesUnder(admin: ReturnType<typeof createClient>, root: string) {
  const bucket = admin.storage.from("spool-photos");
  const files: string[] = [];

  async function visit(prefix: string) {
    let offset = 0;
    while (true) {
      const { data, error } = await bucket.list(prefix, {
        limit: 1000,
        offset,
        sortBy: { column: "name", order: "asc" },
      });
      if (error) throw error;
      const entries = data ?? [];
      for (const entry of entries) {
        const path = `${prefix}/${entry.name}`;
        if (entry.id) files.push(path);
        else await visit(path);
      }
      if (entries.length < 1000) break;
      offset += entries.length;
    }
  }

  await visit(root);
  return files;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ message: "Method not allowed." }, 405);

  try {
    const body = await request.json().catch(() => ({}));
    if (body?.confirmation !== "DELETE") return json({ message: "Deletion confirmation is required." }, 400);

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const publishableKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const authorization = request.headers.get("Authorization");
    if (!supabaseUrl || !publishableKey || !serviceRoleKey) return json({ message: "Function environment is incomplete." }, 500);
    if (!authorization) return json({ message: "Sign in before deleting an account." }, 401);

    const userClient = createClient(supabaseUrl, publishableKey, {
      global: { headers: { Authorization: authorization } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: userData, error: userError } = await userClient.auth.getUser();
    if (userError || !userData.user) return json({ message: "The account session is not valid." }, 401);

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const userId = userData.user.id;

    const { data: ownedCompanies, error: companyError } = await admin
      .from("companies")
      .select("id,name")
      .eq("created_by", userId);
    if (companyError) throw companyError;

    for (const company of ownedCompanies ?? []) {
      const { count, error } = await admin
        .from("company_members")
        .select("user_id", { count: "exact", head: true })
        .eq("company_id", company.id)
        .eq("status", "approved")
        .neq("user_id", userId);
      if (error) throw error;
      if ((count ?? 0) > 0) {
        return json({
          message: `Transfer ownership or remove the other approved members from ${company.name || "your team"} before deleting this account.`,
        }, 409);
      }
    }

    const photoRoots = [userId, ...(ownedCompanies ?? []).map((company) => company.id)];
    for (const root of photoRoots) {
      const files = await storageFilesUnder(admin, root);
      for (let index = 0; index < files.length; index += 100) {
        const { error } = await admin.storage.from("spool-photos").remove(files.slice(index, index + 100));
        if (error) throw error;
      }
    }

    // Personal projects belong to the person. A sole owner's business projects
    // also go with the business; projects created by a non-owner employee stay
    // attached to that business when the employee leaves.
    const { error: personalProjectsError } = await admin
      .from("spool_projects")
      .delete()
      .eq("owner_id", userId)
      .is("company_id", null);
    if (personalProjectsError) throw personalProjectsError;

    const ownedCompanyIds = (ownedCompanies ?? []).map((company) => company.id);
    if (ownedCompanyIds.length) {
      const { error: businessProjectsError } = await admin
        .from("spool_projects")
        .delete()
        .in("company_id", ownedCompanyIds);
      if (businessProjectsError) throw businessProjectsError;
    }

    const { error: deleteError } = await admin.auth.admin.deleteUser(userId, false);
    if (deleteError) throw deleteError;

    return json({ deleted: true });
  } catch (error) {
    console.error("delete-account failed", error);
    return json({ message: error instanceof Error ? error.message : "Account deletion failed." }, 500);
  }
});
