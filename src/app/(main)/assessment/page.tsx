import { redirect } from "next/navigation";
import { connection } from "next/server";
import { AssessmentFlow } from "@/feature/assessment/components/AssessmentFlow";
import {
  ApiError,
  fetchPlacementStatus,
  fetchPlacementTest,
} from "@/lib/api/placement";
import { getEntryPath } from "@/lib/routing";

function LoadError() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-lg">โหลดแบบประเมินไม่สำเร็จ กรุณาลองอีกครั้ง</p>
      <a href="/assessment" className="underline">
        ลองอีกครั้ง
      </a>
    </div>
  );
}

export default async function AssessmentPage() {
  await connection();

  let status;
  let placement;
  try {
    status = await fetchPlacementStatus();
    if (!status.completed) placement = await fetchPlacementTest();
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) redirect("/auth");
    console.error("Placement test load failed:", error);
    return <LoadError />;
  }

  if (status.completed || !placement) redirect(getEntryPath(true));

  return (
    <AssessmentFlow
      test={placement.test}
      userName={status.name}
      imageUrls={placement.imageUrls}
    />
  );
}
