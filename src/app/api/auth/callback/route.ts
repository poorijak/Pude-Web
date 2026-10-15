import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const returnTo = searchParams.get("return_to") || "/";

  if (!code) {
    return NextResponse.redirect(new URL("/auth?error=missing_code", request.url));
  }

  const internalApiUrl = process.env.INTERNAL_API_URL;
  if (!internalApiUrl) {
    console.error("INTERNAL_API_URL is not set");
    return NextResponse.redirect(
      new URL("/auth?error=server_error", request.url),
    );
  }

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

    const data = (await exchangeRes.json().catch(() => null)) as {
      accessToken?: string;
      refreshToken?: string;
    } | null;

    const response = NextResponse.redirect(new URL(returnTo, request.url));

    const isProduction = process.env.NODE_ENV === "production";

    // ตั้งชื่อ Cookie อย่างชัดเจน: accessToken และ refreshToken
    if (data?.accessToken) {
      response.cookies.set("accessToken", data.accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 วัน
      });
    }

    if (data?.refreshToken) {
      response.cookies.set("refreshToken", data.refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60, // 30 วัน
      });
    }

    // Forward Cookies อื่นๆ (ถ้ามี) จาก Backend
    const getSetCookie = exchangeRes.headers.getSetCookie?.();
    if (getSetCookie && getSetCookie.length > 0) {
      for (const cookieStr of getSetCookie) {
        if (
          !cookieStr.startsWith("accessToken=") &&
          !cookieStr.startsWith("refreshToken=")
        ) {
          response.headers.append("Set-Cookie", cookieStr);
        }
      }
    }

    return response;
  } catch (error) {
    console.error("OAuth exchange server error:", error);
    return NextResponse.redirect(
      new URL("/auth?error=server_error", request.url)
    );
  }
}
