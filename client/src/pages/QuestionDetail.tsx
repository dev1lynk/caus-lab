import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, Loader2 } from "lucide-react";
import { Link, useRoute } from "wouter";
import type { PublicQuestion } from "@/lib/ask-types";

export default function QuestionDetail() {
  const [, params] = useRoute("/questions/:slug");
  const [question, setQuestion] = useState<PublicQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params?.slug) return;
    fetch(`/api/questions/${encodeURIComponent(params.slug)}`)
      .then(async (response) => {
        if (!response.ok) throw new Error("not found");
        return response.json();
      })
      .then(setQuestion)
      .catch(() => setError("This question could not be found."))
      .finally(() => setLoading(false));
  }, [params?.slug]);

  return (
    <main className="min-h-screen bg-[#FAFAFD] px-4 py-8 text-slate-900 sm:py-12">
      <article className="mx-auto max-w-3xl">
        <Link href="/questions" className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#4F46E5]">
          <ArrowLeft className="h-4 w-4" />
          All questions
        </Link>
        {loading && <div className="flex items-center gap-2 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading answer…</div>}
        {error && <div className="rounded-[14px] border border-slate-200 bg-white p-8 shadow-sm"><h1 className="font-newsreader text-3xl">{error}</h1><Link href="/questions" className="mt-5 inline-flex text-sm font-semibold text-[#4F46E5] hover:underline">Return to knowledge base</Link></div>}
        {question && (
          <>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">CAUS knowledge</p>
            <h1 className="font-newsreader text-5xl leading-[1.08] tracking-[-0.03em] sm:text-6xl">{question.questionText}</h1>
            <div className="my-9 h-px bg-slate-200" />
            <p className="whitespace-pre-wrap text-lg leading-8 text-slate-700">{question.answerText}</p>
            {!question.keepAnonymous && (question.firstName || question.company) && (
              <p className="mt-8 text-sm text-slate-400">Asked by {[question.firstName, question.company].filter(Boolean).join(" at ")}</p>
            )}
            <Link href="/ask" className="mt-12 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-indigo-300 hover:text-[#4F46E5]">
              Ask your own question
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </>
        )}
      </article>
    </main>
  );
}