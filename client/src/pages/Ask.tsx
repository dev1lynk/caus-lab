import { FormEvent, useState } from "react";
import { ArrowLeft, Check, Mail, Send } from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";

const roles = [
  "Leadership / executive",
  "Data / analytics",
  "Product / strategy",
  "Researcher / academic",
  "Other",
];

type FormData = {
  questionText: string;
  firstName: string;
  email: string;
  company: string;
  role: string;
  keepAnonymous: boolean;
  marketingConsent: boolean;
  website: string;
};

const initialForm: FormData = {
  questionText: "",
  firstName: "",
  email: "",
  company: "",
  role: "",
  keepAnonymous: false,
  marketingConsent: false,
  website: "",
};

export default function Ask() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const update = (field: keyof FormData, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: "" }));
    setServerError("");
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (form.questionText.trim().length < 10) {
      nextErrors.questionText = "Please share at least 10 characters so we can understand your question.";
    }
    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setServerError("");

    try {
      await apiRequest("POST", "/api/questions", {
        questionText: form.questionText.trim(),
        firstName: form.firstName.trim(),
        email: form.email.trim(),
        company: form.company.trim(),
        role: form.role || null,
        keepAnonymous: form.keepAnonymous,
        marketingConsent: form.marketingConsent,
        website: form.website,
      });
      setSubmitted(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      setServerError(message.includes("429")
        ? "We’ve received a lot of questions from this connection. Please try again later."
        : "We couldn’t send your question right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAFD] px-4 py-8 text-slate-900 sm:py-12">
      <div className="mx-auto max-w-[640px]">
        <Link href="/" className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-[#4F46E5]">
          <ArrowLeft className="h-4 w-4" />
          Back to CAUS
        </Link>

        {submitted ? (
          <section className="rounded-[14px] border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-[#4F46E5]">
              <Check className="h-6 w-6" />
            </div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#4F46E5]">Question received</p>
            <h1 className="mb-4 font-newsreader text-4xl leading-tight sm:text-5xl">Thank you for asking.</h1>
            <p className="max-w-lg text-base leading-7 text-slate-600">
              We read every question personally. We’ll follow up by email if it’s a good fit for a public answer.
            </p>
            <Link href="/questions" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#4F46E5] hover:underline">
              Browse published answers
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </section>
        ) : (
          <>
            <header className="mb-9">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Ask Anything</p>
              <h1 className="font-newsreader text-5xl leading-[1.05] tracking-[-0.03em] sm:text-6xl">
                Ask us anything about causal AI
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
                Bring us the question behind the question. We’ll share a practical, causal perspective when it can help others too.
              </p>
            </header>

            <form onSubmit={submit} noValidate className="rounded-[14px] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
              <div className="space-y-6">
                <div>
                  <label htmlFor="questionText" className="mb-2 block text-sm font-semibold text-slate-800">Question <span className="text-[#4F46E5]">*</span></label>
                  <textarea
                    id="questionText"
                    value={form.questionText}
                    onChange={(event) => update("questionText", event.target.value)}
                    onBlur={validate}
                    minLength={10}
                    rows={6}
                    placeholder="e.g. How would I know if a correlation in our sales data is actually causal?"
                    className={`w-full resize-y rounded-[10px] border bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#4F46E5] focus:ring-4 focus:ring-indigo-100 ${errors.questionText ? "border-red-300" : "border-slate-300"}`}
                  />
                  {errors.questionText && <p className="mt-2 text-sm text-red-600">{errors.questionText}</p>}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="First name" id="firstName" value={form.firstName} onChange={(value) => update("firstName", value)} />
                  <Field label="Email" id="email" type="email" required value={form.email} onChange={(value) => update("email", value)} error={errors.email} />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Company" id="company" value={form.company} onChange={(value) => update("company", value)} />
                  <div>
                    <label htmlFor="role" className="mb-2 block text-sm font-semibold text-slate-800">Role</label>
                    <select
                      id="role"
                      value={form.role}
                      onChange={(event) => update("role", event.target.value)}
                      className="w-full rounded-[10px] border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#4F46E5] focus:ring-4 focus:ring-indigo-100"
                    >
                      <option value="">Select your role</option>
                      {roles.map((role) => <option key={role} value={role}>{role}</option>)}
                    </select>
                  </div>
                </div>

                <CheckboxField
                  checked={form.keepAnonymous}
                  onChange={(checked) => update("keepAnonymous", checked)}
                  label="Keep my name out of it if this becomes a public post"
                />

                <div className="rounded-[12px] border border-slate-200 bg-slate-50 p-4">
                  <CheckboxField
                    checked={form.marketingConsent}
                    onChange={(checked) => update("marketingConsent", checked)}
                    label="I’d like to receive occasional emails from CAUS about causal AI — separate from the answer to this question. Unsubscribe anytime."
                  />
                </div>

                <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
                  <label htmlFor="website">Website</label>
                  <input id="website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => update("website", event.target.value)} />
                </div>

                {serverError && <p className="text-sm text-red-600" role="alert">{serverError}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#4F46E5] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Sending…" : "Send my question"}
                  {!submitting && <Send className="h-4 w-4" />}
                </button>
                <p className="flex items-start gap-2 text-xs leading-5 text-slate-500">
                  <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  We&apos;ll only use your email to follow up on this question, unless you&apos;ve opted in above.
                </p>
              </div>
            </form>
          </>
        )}
      </div>
    </main>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  type = "text",
  required = false,
  error,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-800">
        {label} {required && <span className="text-[#4F46E5]">*</span>}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-[10px] border bg-white px-4 py-3 text-sm outline-none transition focus:border-[#4F46E5] focus:ring-4 focus:ring-indigo-100 ${error ? "border-red-300" : "border-slate-300"}`}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

function CheckboxField({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-slate-600">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 shrink-0 accent-[#4F46E5]"
      />
      <span>{label}</span>
    </label>
  );
}