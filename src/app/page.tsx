import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogIn, Sparkles, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-6">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-primary/10 blur-[130px] dark:bg-primary/20" />

      <main className="relative flex w-full max-w-2xl flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted/60 px-4 py-1.5 text-xs font-medium text-foreground backdrop-blur-md mb-6">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Next.js 16 + NestJS Authentication</span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
          Portal Management System
        </h1>
        <p className="mt-4 max-w-lg text-base sm:text-lg text-muted-foreground">
          ระบบบริหารจัดการข้อมูลและการเข้าถึงด้วยสิทธิ์ความปลอดภัยสูง ผ่าน Google OAuth 2.0 Single Sign-On
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/practice"
            className={buttonVariants({
              size: "lg",
              className: "h-12 px-8 rounded-xl font-medium shadow-md flex items-center gap-2",
            })}
          >
            <Sparkles className="h-4 w-4" />
            <span>เริ่มฝึกพูดทันที (Practice)</span>
          </Link>
          <Link
            href="/auth"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "h-12 px-8 rounded-xl font-medium shadow-xs flex items-center gap-2",
            })}
          >
            <LogIn className="h-4 w-4" />
            <span>เข้าสู่ระบบ (Sign In)</span>
          </Link>
        </div>

      </main>
    </div>
  );
}
