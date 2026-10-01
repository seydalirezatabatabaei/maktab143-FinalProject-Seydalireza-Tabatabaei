"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getOrder, updateOrderPaymentStatus } from "@/Api/OrdersApi";
import type { Order } from "@/app/types/types";
import { Button } from "@/components/ui/button";

export default function PaymentResult({
  orderId,
  result,
}: {
  orderId: number;
  result: "success" | "failed";
}) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const loadOrder = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const loadedOrder = await getOrder(orderId);
      setOrder(loadedOrder);
      const expectedStatus = result === "success" ? "paid" : "failed";
      if (loadedOrder.paymentStatus !== expectedStatus) {
        router.replace(`/application/payment?orderId=${orderId}`);
      }
    } catch {
      setError("اطلاعات سفارش دریافت نشد. اتصال به سرور را بررسی کنید.");
    } finally {
      setLoading(false);
    }
  }, [orderId, result, router]);

  useEffect(() => { void loadOrder(); }, [loadOrder]);

  const retryPayment = async () => {
    setProcessing(true);
    setError("");
    try {
      await updateOrderPaymentStatus(orderId, "pending");
      router.push(`/application/payment?orderId=${orderId}`);
    } catch {
      setError("امکان شروع دوباره‌ی پرداخت وجود ندارد. دوباره تلاش کنید.");
      setProcessing(false);
    }
  };

  if (loading) {
    return <main dir="rtl" className="mx-auto max-w-xl px-4 py-16 text-center">در حال دریافت نتیجه‌ی پرداخت...</main>;
  }

  if (!order) {
    return (
      <main dir="rtl" className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">نتیجه‌ی پرداخت</h1>
        <p role="alert" className="mt-4 text-destructive">{error}</p>
        <Button className="mt-6" onClick={() => void loadOrder()}>تلاش دوباره</Button>
      </main>
    );
  }

  const succeeded = result === "success";

  return (
    <main dir="rtl" className="mx-auto max-w-xl px-4 py-12">
      <section className="overflow-hidden rounded-2xl border shadow-sm">
        <header className={`px-6 py-6 text-white ${succeeded ? "bg-green-700" : "bg-red-700"}`}>
          <p className="text-sm text-white/80">نتیجه‌ی پرداخت آزمایشی</p>
          <h1 className="mt-1 text-2xl font-bold">{succeeded ? "پرداخت موفق بود" : "پرداخت ناموفق بود"}</h1>
        </header>
        <div className="space-y-5 p-6">
          <p className={succeeded ? "text-green-800" : "text-red-800"} role="status">
            {succeeded
              ? "پرداخت سفارش شما با موفقیت ثبت شد. از خرید شما سپاسگزاریم."
              : "پرداخت انجام نشد و مبلغی از حساب شما کسر نشده است."}
          </p>
          <div className="space-y-3 rounded-lg bg-muted/50 p-4 text-sm">
            <div className="flex justify-between gap-4"><span>شماره سفارش</span><span>#{order.id}</span></div>
            <div className="flex justify-between gap-4 font-semibold"><span>مبلغ سفارش</span><span>{order.prices.toLocaleString("fa-IR")} تومان</span></div>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {order.products.map((product, index) => (
              <li key={`${product.id}-${index}`} className="flex justify-between gap-4">
                <span>{product.name} × {product.count}</span>
                <span>{(Number(product.price) * Number(product.count)).toLocaleString("fa-IR")} تومان</span>
              </li>
            ))}
          </ul>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          {succeeded ? (
            <Button className="w-full" render={<Link href="/application/products" />}>بازگشت به فروشگاه</Button>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <Button disabled={processing} onClick={() => void retryPayment()}>
                {processing ? "در حال انتقال..." : "تلاش دوباره برای پرداخت"}
              </Button>
              <Button variant="outline" render={<Link href="/application/cart" />}>بازگشت به سبد خرید</Button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
