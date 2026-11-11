import type { FormField } from "@/content/siteConfig";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\-.\s\d]{7,20}$/;

/** Shared by the client (instant feedback) and the route handler (trust boundary). */
export function validateLead(fields: FormField[], values: Record<string, string>) {
  const errors: Record<string, string> = {};

  for (const field of fields) {
    const value = (values[field.name] ?? "").trim();

    if (field.required && !value) {
      errors[field.name] = `${field.label} is required.`;
      continue;
    }
    if (!value) continue;

    if (field.type === "email" && !EMAIL_RE.test(value)) {
      errors[field.name] = "Please enter a valid email address.";
    } else if (field.type === "tel" && !PHONE_RE.test(value)) {
      errors[field.name] = "Please enter a valid phone number.";
    } else if (value.length > (field.type === "textarea" ? 5000 : 200)) {
      errors[field.name] = `${field.label} is too long.`;
    }
  }

  return errors;
}
