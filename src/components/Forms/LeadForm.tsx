"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { forms, genres, siteConfig } from "@/content/siteConfig";
import { submitLead } from "@/lib/submitLead";
import { validateLead } from "@/lib/validateLead";
import Button from "@/components/UI/Button";
import styles from "./LeadForm.module.css";

type Status = "idle" | "submitting" | "success" | "error";

type Props = {
  form: keyof typeof forms;
  prefill?: string;
  /** light / dark surfaces, or "letter": the same form typeset as a handwritten letter (Contact page). */
  tone?: "light" | "dark" | "letter";
  onSuccess?: () => void;
};

/**
 * Lead form driven entirely by the field definitions in siteConfig (which
 * mirror the live site's forms). Validates inline, submits through the single
 * isolated submitLead() function, and reports the real outcome.
 */
export default function LeadForm({ form, prefill = "", tone = "light", onSuccess }: Props) {
  const config = forms[form];
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverMessage, setServerMessage] = useState("");
  const { contact } = siteConfig;

  const readValues = () => {
    const data = new FormData(formRef.current!);
    return Object.fromEntries([...data.entries()].map(([k, v]) => [k, String(v)]));
  };

  const validateField = (name: string) => {
    const field = config.fields.filter((f) => f.name === name);
    const fieldErrors = validateLead(field, readValues());
    setErrors((prev) => {
      const next = { ...prev };
      if (fieldErrors[name]) next[name] = fieldErrors[name];
      else delete next[name];
      return next;
    });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = readValues();
    const fieldErrors = validateLead(config.fields, values);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length) {
      formRef.current?.querySelector<HTMLElement>(`[name="${Object.keys(fieldErrors)[0]}"]`)?.focus();
      return;
    }

    setStatus("submitting");
    const result = await submitLead({ ...values, formId: config.id });

    if (result.ok) {
      setStatus("success");
      formRef.current?.reset();
      onSuccess?.();
      return;
    }
    if (result.reason === "validation") {
      setErrors(result.fieldErrors);
      setStatus("idle");
      return;
    }
    setServerMessage(
      result.reason === "network"
        ? "We couldn't reach our server. Please check your connection and try again."
        : "Your request couldn't be sent right now.",
    );
    setStatus("error");
  };

  if (status === "success") {
    return (
      <div className={`${styles.success} ${styles[tone]}`} role="status">
        <p className={styles.successTitle}>Thank you — your request is in.</p>
        <p>We&rsquo;ll review your details and be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form ref={formRef} className={`${styles.form} ${styles[tone]}`} onSubmit={onSubmit} noValidate aria-busy={status === "submitting"}>
      {config.fields.map((field) => {
        const id = `${uid}-${field.name}`;
        const errId = `${id}-error`;
        const err = errors[field.name];
        const common = {
          id,
          name: field.name,
          placeholder: field.placeholder,
          required: field.required,
          autoComplete: field.autoComplete,
          "aria-invalid": err ? true : undefined,
          "aria-describedby": err ? errId : undefined,
          onBlur: () => errors[field.name] !== undefined && validateField(field.name),
          className: styles.input,
        };
        return (
          <div key={field.name} className={`${styles.field} ${field.type === "textarea" ? styles.full : ""}`}>
            <label htmlFor={id} className={styles.label}>
              {field.label}
              {field.required && (
                <span className={styles.req} aria-hidden="true">
                  *
                </span>
              )}
            </label>
            {field.type === "textarea" ? (
              <textarea {...common} rows={4} defaultValue={field.name === "message" ? prefill : undefined} key={prefill} />
            ) : field.name === "genre" ? (
              <>
                <input {...common} type="text" list={`${id}-list`} />
                <datalist id={`${id}-list`}>
                  {genres.map((g) => (
                    <option key={g.slug} value={g.label} />
                  ))}
                </datalist>
              </>
            ) : (
              <input {...common} type={field.type} inputMode={field.type === "tel" ? "tel" : undefined} />
            )}
            {err && (
              <p id={errId} className={styles.error}>
                {err}
              </p>
            )}
          </div>
        );
      })}

      {/* Honeypot for bots — hidden from people and assistive tech. */}
      <div className={styles.hp} aria-hidden="true">
        <label htmlFor={`${uid}-company`}>Company</label>
        <input id={`${uid}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={`${styles.full} ${styles.actions}`}>
        <Button type="submit" size="lg" variant={tone === "dark" ? "solid" : "dark"} disabled={status === "submitting"} className={styles.submit}>
          {status === "submitting" ? "Sending…" : config.submitLabel}
        </Button>
        <p className={styles.note}>{siteConfig.footer.confidentiality}</p>
      </div>

      <div className={styles.full} aria-live="assertive">
        {status === "error" && (
          <p className={styles.formError}>
            {serverMessage} Please call us at <a href={contact.phone.href}>{contact.phone.display}</a>.
          </p>
        )}
      </div>
    </form>
  );
}
