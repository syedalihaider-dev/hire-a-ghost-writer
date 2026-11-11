import { forms } from "@/content/siteConfig";
import { validateLead } from "@/lib/validateLead";

/**
 * Lead intake. Validates server-side, then forwards to the CRM / email webhook
 * set in LEAD_WEBHOOK_URL. Until that is configured it answers 503 honestly —
 * no lead is ever reported as "sent" when it was not delivered.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real users never fill this hidden field.
  if (typeof body.company === "string" && body.company.trim()) {
    return Response.json({ ok: true });
  }

  const formId = String(body.formId ?? "");
  const form = Object.values(forms).find((f) => f.id === formId);
  if (!form) return Response.json({ message: "Unknown form." }, { status: 400 });

  const values: Record<string, string> = {};
  for (const field of form.fields) values[field.name] = String(body[field.name] ?? "").trim();

  const fieldErrors = validateLead(form.fields, values);
  if (Object.keys(fieldErrors).length) {
    return Response.json({ fieldErrors }, { status: 422 });
  }

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (!webhook) {
    return Response.json(
      { message: "Lead delivery is not configured (LEAD_WEBHOOK_URL)." },
      { status: 503 },
    );
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        form: formId,
        ...values,
        source: request.headers.get("referer") ?? "",
        submittedAt: new Date().toISOString(),
      }),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[lead] delivery failed", error);
    return Response.json({ message: "Delivery failed." }, { status: 502 });
  }
}
