"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createOrder } from "@/Api/OrdersApi";
import { useCart } from "@/app/store/cart-context";
import { Button } from "@/components/ui/button";
import { checkoutSchema, type CheckoutFormValues } from "@/lib/form-schemas";

export default function CheckoutPage() {
  const router = useRouter();
  const { items } = useCart();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
    username: "",
    lastname: "",
    phone: "",
    address: "",
    expectAt: "",
    },
  });
  const total = items.reduce((sum, item) => sum + item.product.price * item.count, 0);

  const submitOrder = async (form: CheckoutFormValues) => {
    if (items.length === 0) return;
    setError("");
    try {
      const order = await createOrder({
        ...form,
        expectAt: new Date(`${form.expectAt}T12:00:00`).getTime(),
        products: items.map(({ product, count }) => ({
          id: product.id,
          name: product.name,
          count: String(count),
          price: String(product.price),
          image: product.image[0] ?? product.thumbnail,
        })),
        prices: total,
        delivered: "false",
      });
      router.push(`/application/payment?orderId=${order.id}`);
    } catch {
      setError("ثبت سفارش انجام نشد. اتصال به سرور را بررسی و دوباره تلاش کنید.");
    }
  };

  if (items.length === 0) {
    return (
      <main dir="rtl" className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">سبد خرید خالی است</h1>
        <p className="mt-3 text-muted-foreground">برای ادامه‌ی خرید ابتدا محصولی به سبد اضافه کنید.</p>
        <Button render={<Link href="/application/products" />} className="mt-6">مشاهده‌ی محصولات</Button>
      </main>
    );
  }

  return (
    <main dir="rtl" className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-8 text-2xl font-bold">اطلاعات سفارش و پرداخت</h1>
      <form onSubmit={handleSubmit(submitOrder)} className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <section className="space-y-5 rounded-xl border p-5 sm:p-7">
          <h2 className="text-lg font-semibold">اطلاعات تحویل</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm">نام
              <input autoComplete="given-name" className="w-full rounded-lg border bg-background px-3 py-2" {...register("username")} />
              {errors.username && <span role="alert" className="text-xs text-destructive">{errors.username.message}</span>}
            </label>
            <label className="space-y-2 text-sm">نام خانوادگی
              <input autoComplete="family-name" className="w-full rounded-lg border bg-background px-3 py-2" {...register("lastname")} />
              {errors.lastname && <span role="alert" className="text-xs text-destructive">{errors.lastname.message}</span>}
            </label>
            <label className="space-y-2 text-sm sm:col-span-2">شماره تماس
              <input type="tel" autoComplete="tel" className="w-full rounded-lg border bg-background px-3 py-2" {...register("phone")} />
              {errors.phone && <span role="alert" className="text-xs text-destructive">{errors.phone.message}</span>}
            </label>
            <label className="space-y-2 text-sm sm:col-span-2">نشانی
              <textarea rows={3} autoComplete="street-address" className="w-full rounded-lg border bg-background px-3 py-2" {...register("address")} />
              {errors.address && <span role="alert" className="text-xs text-destructive">{errors.address.message}</span>}
            </label>
            <label className="space-y-2 text-sm sm:col-span-2">تاریخ تقریبی تحویل
              <input type="date" min={new Date().toISOString().slice(0, 10)} className="w-full rounded-lg border bg-background px-3 py-2" {...register("expectAt")} />
              {errors.expectAt && <span role="alert" className="text-xs text-destructive">{errors.expectAt.message}</span>}
            </label>
          </div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        </section>

        <aside className="h-fit space-y-4 rounded-xl border p-5">
          <h2 className="font-semibold">خلاصه‌ی سفارش</h2>
          <ul className="space-y-3 text-sm">
            {items.map(({ product, count }) => (
              <li key={product.id} className="flex justify-between gap-3">
                <span>{product.name} × {count}</span>
                <span className="shrink-0">{(product.price * count).toLocaleString("fa-IR")} تومان</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between border-t pt-4 font-bold">
            <span>مبلغ قابل پرداخت</span>
            <span>{total.toLocaleString("fa-IR")} تومان</span>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "در حال ثبت سفارش..." : "ثبت سفارش و رفتن به درگاه پرداخت"}
          </Button>
        </aside>
      </form>
    </main>
  );
}
