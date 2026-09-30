"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/store/cart-context";
import { getProductImageSrc } from "@/Api/ProductsApi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CartDialog() {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 72, right: 16 });
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { items, itemCount, setItemCount, removeItem } = useCart();
  const total = items.reduce((sum, item) => sum + item.product.price * item.count, 0);

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 180);
  };
  const openBesideCart = (element: HTMLElement) => {
    cancelClose();
    const bounds = element.getBoundingClientRect();
    setPosition({
      top: Math.min(bounds.bottom + 8, window.innerHeight - 120),
      right: Math.max(8, window.innerWidth - bounds.right),
    });
    setOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        variant="ghost"
        aria-label={`سبد خرید، ${itemCount} کالا`}
        className="relative h-auto gap-2 rounded-full px-3 py-2"
        onMouseEnter={(event) => openBesideCart(event.currentTarget)}
        onMouseLeave={scheduleClose}
        onFocus={() => setOpen(true)}
        onClick={(event) => {
          if (open) setOpen(false);
          else openBesideCart(event.currentTarget);
        }}
      >
        <ShoppingCart size={20} />
        <span className="hidden sm:inline">سبد خرید</span>
        {itemCount > 0 && <span className="min-w-5 rounded-full bg-green-600 px-1.5 py-0.5 text-center text-xs text-white">{itemCount}</span>}
      </Button>

      <DialogContent
        dir="rtl"
        showOverlay={false}
        className="fixed inset-auto left-auto max-h-[85vh] w-[calc(100%-2rem)] max-w-xl translate-x-0 translate-y-0 overflow-y-auto shadow-xl"
        style={{ top: position.top, right: position.right }}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
        onFocus={cancelClose}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) scheduleClose();
        }}
      >
        <DialogHeader>
          <DialogTitle>سبد خرید ({itemCount})</DialogTitle>
          <DialogDescription>
            {items.length === 0 ? "سبد خرید شما خالی است." : "محصولات انتخاب‌شده را مرور و تعدادشان را ویرایش کنید."}
          </DialogDescription>
        </DialogHeader>

        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            هنوز محصولی به سبد خرید اضافه نکرده‌اید.
          </div>
        ) : (
          <>
            <ul className="divide-y">
              {items.map(({ product, count }) => (
                <li key={product.id} className="flex flex-wrap items-center gap-3 py-4">
                  <img src={getProductImageSrc(product.image)} alt={product.name} className="h-16 w-16 rounded-lg bg-muted object-cover" />
                  <div className="min-w-28 flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{product.price.toLocaleString("fa-IR")} تومان</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="sm" aria-label={`افزایش تعداد ${product.name}`} disabled={count >= product.quantity} onClick={() => setItemCount(product.id, count + 1)}>+</Button>
                    <span className="min-w-6 text-center">{count}</span>
                    <Button type="button" variant="outline" size="sm" aria-label={`کاهش تعداد ${product.name}`} onClick={() => setItemCount(product.id, count - 1)}>−</Button>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(product.id)}>حذف</Button>
                </li>
              ))}
            </ul>
            <div className="flex justify-between border-t pt-4 font-semibold">
              <span>جمع کل</span>
              <span>{total.toLocaleString("fa-IR")} تومان</span>
            </div>
          </>
        )}

        <DialogFooter className="sm:flex-row">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>ادامه خرید</Button>
          {items.length > 0 && (
            <Button render={<Link href="/application/cart" onClick={() => setOpen(false)} />}>
              مشاهده سبد خرید
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
