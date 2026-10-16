import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const returnTo = searchParams.get("return_to") || "/";

  if (!code) {
    return NextResponse.redirect(new URL("/auth?error=missing_code", request.url));
  }

  const internalApiUrl =
    process.env.INTERNAL_API_URL || "https://pude-api-dev.bbxst-hub.dev";

  try {
    const exchangeRes = await fetch(`${internalApiUrl}/auth/exchange`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    if (!exchangeRes.ok) {
      console.error(
        "OAuth exchange failed:",
        exchangeRes.status,
        await exchangeRes.text().catch(() => "")
      );
      return NextResponse.redirect(
        new URL("/auth?error=exchange_failed", request.url)
      );
    }

    // เข้าสู่ระบบสำเร็จและ redirect ไปยัง returnTo ทันทีโดยไม่ต้อง set cookie
    return NextResponse.redirect(new URL(returnTo, request.url));
  } catch (error) {
    console.error("OAuth exchange server error:", error);
    return NextResponse.redirect(
      new URL("/auth?error=server_error", request.url)
    );
  }
}
