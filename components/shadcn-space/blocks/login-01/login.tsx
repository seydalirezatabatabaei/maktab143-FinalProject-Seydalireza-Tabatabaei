"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Logo from "@/assets/logo/logo";

import { loginSchema, type LoginFormValues } from "@/lib/form-schemas";

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema), defaultValues: { username: "", password: "" } });
  const [error, setError] = useState("");

 const submitLogin = async ({ username, password }: LoginFormValues) => {
  try {
    setError("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data?.message || "Login failed"
      );
    }

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    const callbackUrl = new URLSearchParams(window.location.search).get("callbackUrl");
    const isAdminPath = callbackUrl === "/admin" || callbackUrl?.startsWith("/admin/");
    const destination = isAdminPath && callbackUrl && callbackUrl !== "/admin/register" ? callbackUrl : "/admin";
    window.location.replace(destination);
  } catch (error) {
    setError(
      error instanceof Error ? error.message : "نام کاربری یا رمز عبور اشتباه است."
    );
  }
};

  return (
    <section className="bg-white min-h-screen flex items-center justify-center relative">
      <div className="py-10 md:py-20 max-w-lg px-4 sm:px-0 mx-auto w-full">
        <Card className="max-w-lg px-6 py-8 sm:p-12 relative gap-6">
          <CardHeader className="text-center gap-6 p-0">
            <div className="mx-auto">
              <a href="/">
                <Logo />
              </a>
            </div>

            <div className="flex flex-col gap-1">
              <CardTitle className="text-2xl font-medium text-card-foreground">
                خوش برگشتید به پنل مدیریت
              </CardTitle>

              <CardDescription className="text-sm text-muted-foreground font-normal">
                هم اکنون به اکانت خودتان وارد شوید.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <form onSubmit={handleSubmit(submitLogin)}>
              <FieldGroup className="gap-6">
                <div className="flex flex-col gap-4">

                  {/* Username */}
                  <Field className="gap-1.5">
                    <FieldLabel
                      htmlFor="username"
                      className="text-sm text-muted-foreground font-normal"
                    >
                      نام کاربری
                    </FieldLabel>

                    <Input
                      id="username"
                      type="text"
                      placeholder="نام کاربری را وارد کنید"
                      {...register("username")}
                      className="dark:bg-background h-9 shadow-xs"
                    />
                    {errors.username && <p role="alert" className="text-xs text-red-500">{errors.username.message}</p>}
                  </Field>

                  {/* Password */}
                  <Field className="gap-1.5">
                    <FieldLabel
                      htmlFor="password"
                      className="text-sm text-muted-foreground font-normal"
                    >
                      رمز ورود
                    </FieldLabel>

                    <Input
                      id="password"
                      type="password"
                      placeholder="رمز را اینجا وارد کنید"
                      {...register("password")}
                      className="dark:bg-background h-9 shadow-xs"
                    />
                    {errors.password && <p role="alert" className="text-xs text-red-500">{errors.password.message}</p>}
                  </Field>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                  پس از ورود، نشست ادمین تا ۷ روز فعال می‌ماند.
                </p>

                {/* Error */}
                {error && (
                  <p className="text-sm text-red-500 text-center">
                    {error}
                  </p>
                )}

                {/* Submit */}
                <Field className="gap-4">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="rounded-lg h-10 hover:bg-primary/80 cursor-pointer"
                  >
                    {isSubmitting
                      ? "در حال ورود..."
                      : "بگذار داخل شوم"}
                  </Button>

                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default LoginForm;
