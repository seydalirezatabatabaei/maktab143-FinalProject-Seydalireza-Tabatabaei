import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Logo from "@/assets/logo/logo";
import { useState } from "react";
import { login } from "@/Api/AuthApi";

const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  try {
    setLoading(true);
    setError("");

    const data = await login({
      username,
      password,
    });

    console.log("Login successful:", data);

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    window.location.href = "/admin";
  } catch (error) {
    console.error(error);
    setError("نام کاربری یا رمز عبور اشتباه است.");
  } finally {
    setLoading(false);
  }
};
const LoginForm = () => {


  return (
    <section className="bg-[#fff3b0] dark:bg-background min-h-screen flex items-center justify-center relative">
      <div className="pointer-events-none absolute inset-0 right-0 overflow-hidden md:block hidden">
        {/* Outer big circle */}
        <div className="absolute left-1/1 top-0 h-650 w-650 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f3de2c]" />
        {/* Inner circle */}
        <div className="absolute left-1/1 top-0 h-175 w-175 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f8bb66] dark:bg-background" />
      </div>

      <div className="py-10 md:py-20 max-w-lg px-4 sm:px-0 mx-auto w-full">
        <Card className="max-w-lg px-6 py-8 sm:p-12 relative gap-6">
          <CardHeader className="text-center gap-6 p-0">
            <div className="mx-auto">
              <a href="">
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
            <form onSubmit={handleSubmit}>
              <FieldGroup className="gap-6">


                <div className="flex flex-col gap-4">
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
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="dark:bg-background h-9 shadow-xs"
                    />
                  </Field>
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="dark:bg-background h-9 shadow-xs"
                    />
                  </Field>
                </div>

                <Field orientation="horizontal" className="justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="terms"
                      defaultChecked
                      className="cursor-pointer"
                    />
                    <FieldLabel
                      htmlFor="terms"
                      className="text-sm text-primary font-normal cursor-pointer"
                    >
                      منو یادت بمونه
                    </FieldLabel>
                  </div>
                  <a
                    href="#"
                    className="text-sm text-card-foreground font-medium text-end"
                  >
                    رمزو فراموش کردم
                  </a>
                </Field>

                <Field className="gap-4">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="rounded-lg h-10 hover:bg-primary/80 cursor-pointer"
                  >
                    {loading ? "در حال ورود..." : "بگذار داخل شوم"}
                  </Button>
                  <FieldDescription className="text-center text-sm font-normal text-muted-foreground">
                    {" "}
                    <a
                      href="#"
                      className="font-medium text-card-foreground no-underline!"
                    >
                      یه اکانت جدید بساز واسم
                    </a>
                  </FieldDescription>
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
