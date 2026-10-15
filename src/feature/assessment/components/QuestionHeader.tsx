import { ListenButton } from "@/components/shared/ListenButton";
import { ASSESSMENT, COMMON } from "@/constants/copy";

interface QuestionHeaderProps {
  number: number;
  total: number;
  title: string;
  listenText: string;
}

export function QuestionHeader({
  number,
  total,
  title,
  listenText,
}: QuestionHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-2 text-center [@media(max-height:760px)]:gap-1.5">
      <p className="text-[15px] text-slate-500">
        {ASSESSMENT.progress(number, total)}
      </p>
      <h1 className="text-xl font-bold leading-normal text-navy-900 md:text-[28px] [@media(max-height:760px)]:md:text-2xl">
        {title}
      </h1>
      <ListenButton text={listenText} label={COMMON.listenAgain} compact />
    </div>
  );
}
