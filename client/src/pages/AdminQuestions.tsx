import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, ChevronDown, ChevronUp, Lock, LogOut, RefreshCw, Save } from "lucide-react";
import { Link } from "wouter";

const statuses = ["new", "in_review", "answered", "published", "declined"] as const;
type Status = typeof statuses[number];

type AdminQuestion = {
  id: string;
  questionText: string;
  email: string;
  firstName: string | null;
  company: string | null;
  role: string | null;
  keepAnonymous: boolean;
  marketingConsent: boolean;
  status: Status;
  answerText: string | null;
  answeredAt: string | null;
  publishedSlug: string | null;
  createdAt: string;
};

async function requestJson(url: string, options?: RequestInit) {
  const response = await fetch(url, { credentials: "include", ...options, headers: { "Content-Type": "application/json", ...(options?.headers || {}) } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || "Something went wrong");
  return body;
}

export default function AdminQuestions() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [sortAscending, setSortAscending] = useState(false);
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [selected, setSelected] = useState<AdminQuestion | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [status, setStatus] = useState<Status>("new");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const loadQuestions = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await requestJson(`/api/admin/questions?status=${filter}`);
      setQuestions(data);
      if (selected) {
        const updated = data.find((item: AdminQuestion) => item.id === selected.id);
        if (updated) {
          setSelected(updated);
          setAnswerText(updated.answerText || "");
          setStatus(updated.status);
        }
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestJson("/api/admin/session")
      .then((data) => setAuthenticated(data.authenticated))
      .catch(() => setAuthenticated(false));
  }, []);

  useEffect(() => {
    if (authenticated) loadQuestions();
  }, [authenticated, filter]);

  const sortedQuestions = useMemo(
    () => [...questions].sort((a, b) => {
      const difference = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortAscending ? difference : -difference;
    }),
    [questions, sortAscending],
  );

  const login = async (event: FormEvent) => {
    event.preventDefault();
    setLoginError("");
    try {
      await requestJson("/api/admin/login", { method: "POST", body: JSON.stringify({ password }) });
      setAuthenticated(true);
      setPassword("");
    } catch (loginRequestError) {
      setLoginError(loginRequestError instanceof Error ? loginRequestError.message : "Unable to sign in");
    }
  };

  const selectQuestion = (question: AdminQuestion) => {
    setSelected(question);
    setAnswerText(question.answerText || "");
    setStatus(question.status);
    setNotice("");
    setError("");
  };

  const saveQuestion = async (event: FormEvent) => {
    event.preventDefault();
    if (!selected) return;
    setSaving(true);
    setNotice("");
    setError("");
    try {
      await requestJson(`/api/admin/questions/${selected.id}`, {
        method: "PATCH",
        body: JSON.stringify({ answerText, status }),
      });
      setNotice(status === "answered" ? "Saved. The answer notification was sent or logged." : "Question saved.");
      await loadQuestions();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save question");
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    await requestJson("/api/admin/logout", { method: "POST" }).catch(() => undefined);
    setAuthenticated(false);
    setQuestions([]);
    setSelected(null);
  };

  if (authenticated === null) {
    return <div className="flex min-h-screen items-center justify-center bg-[#FAFAFD] text-sm text-slate-500">Checking admin session…</div>;
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-[#FAFAFD] px-4 py-8 text-slate-900 sm:py-12">
        <div className="mx-auto max-w-md">
          <Link href="/" className="mb-12 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#4F46E5]"><ArrowLeft className="h-4 w-4" /> Back to CAUS</Link>
          <section className="rounded-[14px] border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
            <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-[#4F46E5]"><Lock className="h-5 w-5" /></div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">CAUS admin</p>
            <h1 className="font-newsreader text-4xl tracking-[-0.03em]">Question inbox</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">Sign in to review, answer, and publish questions.</p>
            <form onSubmit={login} className="mt-8 space-y-4">
              <input type="text" name="username" autoComplete="username" value="admin" readOnly tabIndex={-1} aria-hidden="true" className="sr-only" />
              <div>
                <label htmlFor="admin-password" className="mb-2 block text-sm font-semibold text-slate-800">Password</label>
                <input id="admin-password" name="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-[10px] border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#4F46E5] focus:ring-4 focus:ring-indigo-100" />
              </div>
              {loginError && <p className="text-sm text-red-600" role="alert">{loginError}</p>}
              <button className="w-full rounded-[10px] bg-[#4F46E5] px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700">Sign in</button>
            </form>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFD] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px]">
        <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link href="/" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#4F46E5]"><ArrowLeft className="h-4 w-4" /> Back to CAUS</Link>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">CAUS admin</p>
            <h1 className="mt-2 font-newsreader text-5xl tracking-[-0.03em]">Question inbox</h1>
          </div>
          <button onClick={logout} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-600 hover:border-slate-400"><LogOut className="h-4 w-4" /> Sign out</button>
        </header>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <label htmlFor="status-filter" className="text-sm font-semibold text-slate-700">Filter</label>
            <select id="status-filter" value={filter} onChange={(event) => setFilter(event.target.value as "all" | Status)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#4F46E5]">
              <option value="all">All statuses</option>
              {statuses.map((item) => <option key={item} value={item}>{formatStatus(item)}</option>)}
            </select>
            <button onClick={() => loadQuestions()} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-[#4F46E5]" title="Refresh questions"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /></button>
          </div>
          <button onClick={() => setSortAscending((current) => !current)} className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#4F46E5]">
            {sortAscending ? "Oldest first" : "Newest first"}
            {sortAscending ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        {error && <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
          <section className="overflow-hidden rounded-[14px] border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr><th className="px-5 py-3 font-semibold">Question</th><th className="px-4 py-3 font-semibold">Submitter</th><th className="px-4 py-3 font-semibold">Role</th><th className="px-4 py-3 font-semibold">Status</th><th className="px-4 py-3 font-semibold">Created</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedQuestions.map((question) => (
                    <tr key={question.id} onClick={() => selectQuestion(question)} className={`cursor-pointer transition hover:bg-indigo-50/50 ${selected?.id === question.id ? "bg-indigo-50" : ""}`}>
                      <td className="max-w-[300px] px-5 py-4 align-top">
                        <button onClick={(event) => { event.stopPropagation(); setExpanded(expanded === question.id ? null : question.id); }} className="text-left font-medium leading-5 text-slate-800 hover:text-[#4F46E5]">
                          {expanded === question.id ? question.questionText : truncate(question.questionText, 80)}
                        </button>
                      </td>
                      <td className="px-4 py-4 align-top"><div className="font-medium text-slate-700">{question.firstName || "—"}</div><div className="mt-1 text-xs text-slate-500">{question.email}</div><div className="mt-1 text-xs text-slate-500">{question.company || "—"}</div></td>
                      <td className="px-4 py-4 align-top text-xs text-slate-600">{question.role || "—"}</td>
                      <td className="px-4 py-4 align-top"><StatusBadge status={question.status} /></td>
                      <td className="whitespace-nowrap px-4 py-4 align-top text-xs text-slate-500">{formatDate(question.createdAt)}</td>
                    </tr>
                  ))}
                  {!loading && sortedQuestions.length === 0 && <tr><td colSpan={5} className="px-5 py-14 text-center text-sm text-slate-500">No questions match this filter.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-[14px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            {selected ? (
              <form onSubmit={saveQuestion}>
                <div className="flex items-start justify-between gap-3">
                  <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4F46E5]">Question detail</p><p className="mt-1 text-xs text-slate-400">{formatDate(selected.createdAt)}</p></div>
                  <StatusBadge status={selected.status} />
                </div>
                <blockquote className="mt-6 border-l-2 border-indigo-200 pl-4 font-newsreader text-2xl leading-tight text-slate-900">{selected.questionText}</blockquote>
                <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
                  <Detail label="Email" value={selected.email} />
                  <Detail label="First name" value={selected.firstName || "Not provided"} />
                  <Detail label="Company" value={selected.company || "Not provided"} />
                  <Detail label="Role" value={selected.role || "Not provided"} />
                </div>
                <div className="mt-5 flex flex-wrap gap-2 border-y border-slate-100 py-4">
                  <ReadOnlyBadge active={selected.keepAnonymous} label={selected.keepAnonymous ? "Anonymous attribution requested" : "Attribution allowed"} />
                  <ReadOnlyBadge active={selected.marketingConsent} label={selected.marketingConsent ? "Marketing opted in" : "Marketing not opted in"} />
                </div>
                <div className="mt-5">
                  <label htmlFor="admin-answer" className="mb-2 block text-sm font-semibold text-slate-800">Answer</label>
                  <textarea id="admin-answer" rows={10} value={answerText} onChange={(event) => setAnswerText(event.target.value)} placeholder="Write a clear, useful answer…" className="w-full resize-y rounded-[10px] border border-slate-300 px-4 py-3 text-sm leading-6 outline-none focus:border-[#4F46E5] focus:ring-4 focus:ring-indigo-100" />
                </div>
                <div className="mt-4">
                  <label htmlFor="admin-status" className="mb-2 block text-sm font-semibold text-slate-800">Status</label>
                  <select id="admin-status" value={status} onChange={(event) => setStatus(event.target.value as Status)} className="w-full rounded-[10px] border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#4F46E5]">
                    {statuses.map((item) => <option key={item} value={item}>{formatStatus(item)}</option>)}
                  </select>
                </div>
                {notice && <p className="mt-4 flex items-center gap-2 text-sm text-emerald-700"><Check className="h-4 w-4" /> {notice}</p>}
                {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
                <button disabled={saving} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#4F46E5] px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"><Save className="h-4 w-4" /> {saving ? "Saving…" : "Save question"}</button>
              </form>
            ) : (
              <div className="flex min-h-[420px] items-center justify-center text-center"><div><p className="font-newsreader text-3xl text-slate-800">Select a question</p><p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">Choose a row to read the full question and prepare an answer.</p></div></div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function truncate(value: string, length: number) {
  return value.length > length ? `${value.slice(0, length).trim()}…` : value;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function formatStatus(value: string) {
  return value.replace("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function StatusBadge({ status }: { status: Status }) {
  const styles: Record<Status, string> = {
    new: "bg-blue-50 text-blue-700",
    in_review: "bg-amber-50 text-amber-700",
    answered: "bg-emerald-50 text-emerald-700",
    published: "bg-indigo-50 text-indigo-700",
    declined: "bg-slate-100 text-slate-600",
  };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>{formatStatus(status)}</span>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 break-words text-slate-700">{value}</p></div>;
}

function ReadOnlyBadge({ active, label }: { active: boolean; label: string }) {
  return <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${active ? "border-indigo-200 bg-indigo-50 text-indigo-700" : "border-slate-200 bg-slate-50 text-slate-500"}`}>{label} · read-only</span>;
}