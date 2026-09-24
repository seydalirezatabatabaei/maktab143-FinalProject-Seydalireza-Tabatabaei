import { NextResponse } from "next/server";

import { createSession } from "@/lib/auth";

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
      "http://localhost:3002/auth/login",
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

    const data = await response.json();

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

    const { accessToken, refreshToken } = data;

    // ساخت Session مخصوص Next.js
    const session = await createSession(username);

    const result = NextResponse.json({
      success: true,
    });

    // Session
    result.cookies.set("admin_session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
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