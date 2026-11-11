/**
 * Client-side lead submission. All forms go through this one function so the
 * backend can be swapped in a single place. It posts to our own route handler
 * (/api/lead), which forwards to the CRM/webhook configured on the server.
 */
export type LeadPayload = Record<string, string> & { formId: string };

export type LeadResult =
  | { ok: true }
  | { ok: false; reason: "validation"; fieldErrors: Record<string, string> }
  | { ok: false; reason: "unavailable" | "network" | "server"; message: string };

export async function submitLead(payload: LeadPayload): Promise<LeadResult> {
  try {
    const res = await fetch("/api/lead/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));

    if (res.ok) return { ok: true };
    if (res.status === 422) return { ok: false, reason: "validation", fieldErrors: data.fieldErrors ?? {} };
    if (res.status === 503) return { ok: false, reason: "unavailable", message: data.message ?? "" };
    return { ok: false, reason: "server", message: data.message ?? "" };
  } catch {
    return { ok: false, reason: "network", message: "" };
  }
}
