import Link from "next/link";
import { ArrowUpLeft, Sparkles } from "lucide-react";

const footerLinks = [
  { label: "فروشگاه محصولات", href: "/application/products" },
  { label: "سبد خرید", href: "/application/cart" },
  { label: "صفحه اصلی", href: "/application" },
];

export default function SiteFooter() {
  return (
    <footer dir="rtl" className="site-footer mt-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.4fr_0.8fr_1fr] md:py-16">
        <div>
          <Link href="/application" className="group inline-flex items-center gap-3 rounded-2xl">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#392f5a] to-[#ff8811] text-white shadow-lg shadow-[#392f5a]/20 transition-transform group-hover:-rotate-6 group-hover:scale-105">
              <Sparkles size={23} />
            </span>
            <span className="text-lg font-bold tracking-tight text-slate-900">فروشگاه فناوری</span>
          </Link>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">
            انتخابی ساده‌تر برای پیدا کردن ابزارهای دیجیتال، لوازم جانبی و همراهان روزمره‌ی شما.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-slate-900">دسترسی سریع</h2>
          <ul className="mt-4 space-y-3">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="group inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-[#392f5a]">
                  <ArrowUpLeft size={14} className="transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-white/80 bg-white/45 p-5 shadow-sm backdrop-blur-xl">
          <h2 className="text-sm font-bold text-slate-900">خریدی روان و دلنشین</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            محصولات را بررسی کنید، به سبدتان اضافه کنید و سفارش را در چند مرحله ثبت کنید.
          </p>
          <Link href="/application/products" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#392f5a] px-4 py-2.5 text-sm font-semibold text-[#fff8f0] shadow-md shadow-[#392f5a]/15 transition-all hover:-translate-y-0.5 hover:bg-[#ff8811] hover:shadow-lg">
            شروع خرید
            <ArrowUpLeft size={16} />
          </Link>
        </div>
      </div>

      <div className="border-t border-white/70 bg-white/25">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:px-8">
          <span>© {new Date().getFullYear()} فروشگاه فناوری</span>
          <span>با دقت برای تجربه‌ی بهتر خرید طراحی شده است</span>
        </div>
      </div>
    </footer>
  );
}
