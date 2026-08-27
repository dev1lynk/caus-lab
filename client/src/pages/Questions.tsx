import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, BookOpen, Loader2 } from "lucide-react";
import { Link } from "wouter";
import type { PublicQuestion } from "@/lib/ask-types";

export default function Questions() {
  const [questions, setQuestions] = useState<PublicQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/questions")
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load questions");
        return response.json();
      })
      .then(setQuestions)
      .catch(() => setError("Published answers are temporarily unavailable."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-[#FAFAFD] px-4 py-8 text-slate-900 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#4F46E5]">
          <ArrowLeft className="h-4 w-4" />
          Back to CAUS
        </Link>
        <header className="mb-10">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-[#4F46E5]">
            <BookOpen className="h-5 w-5" />
          </div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">CAUS knowledge</p>
          <h1 className="font-newsreader text-5xl leading-tight tracking-[-0.03em] sm:text-6xl">Questions worth asking</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">Practical answers to real questions about causal AI, experimentation, and better decision-making.</p>
        </header>

        {loading && <div className="flex items-center gap-2 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading published answers…</div>}
        {error && <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {!loading && !error && questions.length === 0 && (
          <div className="rounded-[14px] border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h2 className="font-newsreader text-3xl">No published answers yet.</h2>
            <p className="mt-2 text-sm text-slate-600">Ask the first question and help shape the CAUS knowledge base.</p>
            <Link href="/ask" className="mt-6 inline-flex rounded-lg bg-[#4F46E5] px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">Ask anything</Link>
          </div>
        )}
        <div className="space-y-4">
          {questions.map((question) => <QuestionCard key={question.id} question={question} />)}
        </div>
      </div>
    </main>
  );
}

export function QuestionCard({ question }: { question: PublicQuestion }) {
  const attribution = [question.firstName, question.company].filter(Boolean).join(" at ");
  return (
    <Link href={`/questions/${question.publishedSlug}`} className="group block rounded-[14px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md sm:p-8">
      <div className="flex items-start justify-between gap-5">
        <h2 className="font-newsreader text-3xl leading-tight tracking-[-0.02em] text-slate-900">{question.questionText}</h2>
        <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-slate-400 transition group-hover:text-[#4F46E5]" />
      </div>
      <p className="mt-5 whitespace-pre-wrap text-[15px] leading-7 text-slate-600">{question.answerText}</p>
      {attribution && !question.keepAnonymous && <p className="mt-5 text-xs font-medium text-slate-400">Asked by {attribution}</p>}
    </Link>
  );
}