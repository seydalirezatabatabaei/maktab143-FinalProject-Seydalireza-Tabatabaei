import { NextResponse } from "next/server";

import { createSession, SESSION_DURATION_SECONDS } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        {
          message: "نام کاربری و رمز عبور الزامی است.",
        },
        {
          status: 400,
        }
      );
    }

    // ارسال اطلاعات Login به Backend
    const response = await fetch(
      `${API_BASE_URL.replace(/\/+$/, "")}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        {
          message:
            data?.message ||
            "نام کاربری یا رمز عبور اشتباه است.",
        },
        {
          status: response.status,
        }
      );
    }

    const { accessToken, refreshToken, user } = data;
    if (user?.role !== "admin") {
      return NextResponse.json(
        { message: "این حساب دسترسی پنل مدیریت را ندارد." },
        { status: 403 }
      );
    }

    const session = await createSession(username, user.role);

    const result = NextResponse.json({
      success: true,
      accessToken,
      refreshToken,
    });

    // Session
    result.cookies.set("admin_session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_DURATION_SECONDS,
      path: "/",
    });

    // فعلاً Tokenهای Backend را هم Cookie می‌کنیم
    result.cookies.set(
      "access_token",
      accessToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60,
        path: "/",
      }
    );

    result.cookies.set(
      "refresh_token",
      refreshToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      }
    );

    return result;
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        message: "خطایی در ورود رخ داد.",
      },
      {
        status: 500,
      }
    );
  }
}
