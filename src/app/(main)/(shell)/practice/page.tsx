import { Suspense } from "react";
import { PRACTICE } from "@/constants/copy";

interface PracticePageProps {
  searchParams: Promise<{ level?: string; stage?: string }>;
}

async function PracticeContent({ searchParams }: PracticePageProps) {
  const { level = "1", stage = "1" } = await searchParams;
  return (
    <p className="mt-3 text-lg text-slate-500">
      {PRACTICE.stub(Number(level) || 1, Number(stage) || 1)}
    </p>
  );
}

export default function PracticePage({ searchParams }: PracticePageProps) {
  return (
    <main className="mx-auto w-full max-w-260 px-4 py-8 md:px-8">
      <h1 className="text-[28px] font-bold text-navy-900">{PRACTICE.title}</h1>
      <Suspense>
        <PracticeContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
