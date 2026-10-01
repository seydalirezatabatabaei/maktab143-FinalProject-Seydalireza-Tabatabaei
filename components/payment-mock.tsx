"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getOrder, updateOrderPaymentStatus } from "@/Api/OrdersApi";
import type { Order } from "@/app/types/types";
import { useCart } from "@/app/store/cart-context";
import { Button } from "@/components/ui/button";

export default function PaymentMock({ orderId }: { orderId: number }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { clearCart } = useCart();

  const loadOrder = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const loadedOrder = await getOrder(orderId);
      setOrder(loadedOrder);
      if (loadedOrder.paymentStatus === "paid") {
        clearCart();
        router.replace(`/application/payment/success?orderId=${orderId}`);
      } else if (loadedOrder.paymentStatus === "failed") {
        router.replace(`/application/payment/failed?orderId=${orderId}`);
      }
    } catch {
      setError("اطلاعات سفارش دریافت نشد. دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  }, [orderId, clearCart, router]);

  useEffect(() => { void loadOrder(); }, [loadOrder]);

  const settlePayment = async (paymentStatus: "paid" | "failed") => {
    setProcessing(true);
    setError("");
    try {
      const updatedOrder = await updateOrderPaymentStatus(orderId, paymentStatus);
      setOrder(updatedOrder);
      if (paymentStatus === "paid") {
        clearCart();
        router.push(`/application/payment/success?orderId=${orderId}`);
      } else {
        router.push(`/application/payment/failed?orderId=${orderId}`);
      }
    } catch {
      setError("ثبت نتیجه‌ی پرداخت انجام نشد. اتصال به سرور را بررسی کنید.");
    } finally {
      setProcessing(false);
    }
  };

  const retryPayment = async () => {
    setProcessing(true);
    setError("");
    try {
      const updatedOrder = await updateOrderPaymentStatus(orderId, "pending");
      setOrder(updatedOrder);
    } catch {
      setError("امکان شروع دوباره‌ی پرداخت وجود ندارد. دوباره تلاش کنید.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <main dir="rtl" className="mx-auto max-w-xl px-4 py-16 text-center">در حال دریافت سفارش...</main>;
  }

  if (!order) {
    return (
      <main dir="rtl" className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">درگاه پرداخت آزمایشی</h1>
        <p role="alert" className="mt-4 text-destructive">{error}</p>
        <Button className="mt-6" onClick={() => void loadOrder()}>تلاش دوباره</Button>
      </main>
    );
  }

  const paymentStatus = order.paymentStatus ?? "pending";
  const succeeded = paymentStatus === "paid";
  const failed = paymentStatus === "failed";

  return (
    <main dir="rtl" className="mx-auto max-w-xl px-4 py-12">
      <section className="overflow-hidden rounded-2xl border shadow-sm">
        <header className="bg-slate-900 px-6 py-5 text-white">
          <p className="text-sm text-slate-300">درگاه پرداخت آزمایشی</p>
          <h1 className="mt-1 text-xl font-bold">پرداخت سفارش #{order.id}</h1>
        </header>
        <div className="space-y-5 p-6">
          {succeeded ? (
            <div role="status" className="rounded-lg bg-green-50 p-4 text-green-800">
              پرداخت با موفقیت انجام شد. سفارش شما ثبت شده است.
            </div>
          ) : failed ? (
            <div role="status" className="rounded-lg bg-red-50 p-4 text-red-800">
              پرداخت ناموفق بود و مبلغی از حساب شما کسر نشد.
            </div>
          ) : (
            <>
              <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
                این یک درگاه شبیه‌سازی‌شده است؛ اطلاعات واقعی کارت بانکی وارد نکنید.
              </div>
              <p className="text-sm text-muted-foreground">پرداخت برای سفارش {order.username} {order.lastname}</p>
            </>
          )}

          <div className="flex items-center justify-between border-y py-4 font-semibold">
            <span>مبلغ پرداخت</span>
            <span>{order.prices.toLocaleString("fa-IR")} تومان</span>
          </div>

          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

          {paymentStatus === "pending" ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <Button disabled={processing} onClick={() => void settlePayment("paid")}>
                {processing ? "در حال پردازش..." : "پرداخت موفق (ماک)"}
              </Button>
              <Button variant="outline" disabled={processing} onClick={() => void settlePayment("failed")}>
                پرداخت ناموفق / انصراف
              </Button>
            </div>
          ) : failed ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <Button disabled={processing} onClick={() => void retryPayment()}>
                تلاش دوباره برای پرداخت
              </Button>
              <Button variant="outline" render={<Link href="/application/products" />}>
                بازگشت به فروشگاه
              </Button>
            </div>
          ) : (
            <Button className="w-full" render={<Link href="/application/products" />}>
              بازگشت به فروشگاه
            </Button>
          )}
        </div>
      </section>
    </main>
  );
}
