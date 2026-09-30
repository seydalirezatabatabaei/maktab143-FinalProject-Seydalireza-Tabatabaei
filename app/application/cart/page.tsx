"use client";

import Link from "next/link";
import { useCart } from "@/app/store/cart-context";
import { getProductImageSrc } from "@/Api/ProductsApi";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { items, setItemCount, removeItem } = useCart();
  const total = items.reduce((sum, item) => sum + item.product.price * item.count, 0);

  return (
    <main dir="rtl" className="mx-auto min-h-[60vh] max-w-5xl px-4 py-10">
      <h1 className="mb-8 text-2xl font-bold">سبد خرید</h1>
      {items.length === 0 ? (
        <section className="rounded-xl border p-8 text-center">
          <p className="text-muted-foreground">سبد خرید شما خالی است.</p>
          <Link className="mt-5 inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80" href="/application/products">مشاهده محصولات</Link>
        </section>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <ul className="divide-y rounded-xl border px-5">
            {items.map(({ product, count }) => (
              <li key={product.id} className="flex flex-wrap items-center gap-4 py-5">
                <img src={getProductImageSrc(product.image)} alt={product.name} className="h-20 w-20 rounded-lg bg-muted object-cover" />
                <div className="min-w-32 flex-1">
                  <h2 className="font-semibold">{product.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{product.price.toLocaleString("fa-IR")} تومان</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" aria-label={`افزایش تعداد ${product.name}`} disabled={count >= product.quantity} onClick={() => setItemCount(product.id, count + 1)}>+</Button>
                  <span className="min-w-7 text-center">{count}</span>
                  <Button variant="outline" size="sm" aria-label={`کاهش تعداد ${product.name}`} onClick={() => setItemCount(product.id, count - 1)}>−</Button>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeItem(product.id)}>حذف</Button>
              </li>
            ))}
          </ul>
          <aside className="h-fit rounded-xl border p-5">
            <div className="flex justify-between font-semibold"><span>مبلغ کل</span><span>{total.toLocaleString("fa-IR")} تومان</span></div>
            <Link className="mt-5 flex h-9 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80" href="/application/checkout">ادامه فرایند خرید</Link>
          </aside>
        </div>
      )}
    </main>
  );
}
