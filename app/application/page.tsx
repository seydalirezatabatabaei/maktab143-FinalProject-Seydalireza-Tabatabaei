"use client";

import { ReactNode, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { getCategories, getProducts } from "@/Api/ProductsApi";
import { Category, Product } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product-card";
import { AccordionLoader } from "@/components/accordion-loader";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Cpu,
  Gamepad2,
  Headphones,
  Heart,
  Laptop,
  LayoutGrid,
  Menu,
  Monitor,
  Package,
  Search,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Tablet,
  Truck,
  X,
  Zap,
} from "lucide-react";import Image from "next/image";

const FEATURED_LIMIT = 16;

export default function HomePage() {
    const [mobileMenu, setMobileMenu] = useState(false);
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });


  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["products-home", FEATURED_LIMIT],
    queryFn: () => getProducts({ page: 1, limit: FEATURED_LIMIT }),
  });

  const featuredProducts: Product[] = useMemo(() => {
    return productsData?.data ?? [];
  }, [productsData]);

  const isLoading = categoriesLoading || productsLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <AccordionLoader />
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-background">
     


{/* modern side bar  */}
   <aside
            id="shop-sidebar"
            aria-label="Product categories"
            className={`fixed bottom-0 left-0 top-18 z-30 flex w-64 flex-col overflow-y-auto border-r border-slate-100 bg-white p-6 transition-transform ${
              mobileMenu ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0`}
          >
            <p className="mb-5 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              توی فروشگاه بگرد 
            </p>
    
    <nav className="space-y-2">
              {categories?.map((category: Category) => (
                <button
                  type="button"
                  key={category.id}
                  // aria-pressed={category.name === name}
                  // onClick={() => {
                  //   setCategory(name);
                  //   setMobileMenu(false);
                  // }}
                  className={"flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-sm transition "}
                >
                  <span className="flex gap-5">
                  <span>
                    {category.name}
                  </span>
                  {getCategoryIcon(category.icon)}
                  </span>
                </button>
              ))}
            </nav>
    
   
          </aside>

 {/* Hero */}
  <section className="relative isolate overflow-hidden rounded-[2rem] border border-white/70 bg-[#9dd9d2]/55 p-7 shadow-[0_24px_70px_rgba(57,47,90,0.10)] backdrop-blur-xl sm:p-10 xl:p-14">
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div className="relative z-10">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#fff8f0]/85 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[#392f5a]">
                  <Zap size={13} />
                   هر روز خودت را بهتر کن 
                </span>

<h1 className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl xl:text-6xl">
                  فناوری بهتر
                  <br />
                  <span className="text-[#ff8811]">روز بهتر</span>
                </h1>
                

<p className="mt-5 max-w-sm text-sm leading-7 text-slate-600">
                  مجموعه‌ای از نیازهای زیبا و خوش‌طراحی را کشف کنید که کار، بازی و هر چیز دیگری در این میان را دلپذیرتر می‌کنند.
                </p>

<Link
                  href="http://localhost:3000/application/products"
                 
                  className="mt-7 inline-flex items-center gap-5 rounded-xl bg-[#392f5a] px-6 py-4 text-sm font-semibold text-[#fff8f0] shadow-lg shadow-[#392f5a]/15 transition hover:-translate-y-1 hover:bg-[#ff8811]"
                >
                  نیاز هاتو بخر <ArrowRight size={17} />
                </Link>

<div className="mt-7 flex items-center gap-2 text-xs text-slate-500">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white">
                    <Check size={12} className="text-[#392f5a]" />
                  </span>
                  ساخته شده برای روش زندگی شما
                </div>
              </div>

<div className="relative mx-auto w-full max-w-md">
                <div className="absolute inset-4 rounded-full bg-white/40 blur-2xl" />
                <div className="relative aspect-square overflow-hidden rounded-full border-[12px] border-[#fff8f0]/65 bg-[#f4d06f] shadow-2xl shadow-[#392f5a]/15">
                  <Image
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85"
                    alt="Over-ear headphones on a yellow background"
                    fill
                    priority
                    unoptimized
                    sizes="(max-width: 768px) 90vw, 440px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </section>

{/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h2 className="mb-6 text-2xl font-bold">دسته‌بندی‌ها</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {categories?.map((category: Category) => (
            <Link
              key={category.id}
              href={`/application/products?category=${category.id}`}
              className="group flex flex-col items-center gap-3 rounded-xl border bg-card p-4 text-center transition-all hover:shadow-md hover:border-primary"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
                {getCategoryIcon(category.icon)}
              </div>
              <span className="text-sm font-medium">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>
{/* explain the services */}
<section
  aria-label="مزایای خرید"
  dir="rtl"
  className="mx-auto max-w-7xl px-4 py-12 sm:px-6 flex gap-2"
>
  {[
    {
      icon: Truck,
      title: "تحویل درِ خانه",
      text: "ارتقای بعدی‌ات، در راه است",
    },
    {
      icon: ShieldCheck,
      title: "با خیال راحت خرید کن",
      text: "ضروری‌هایی با دقت انتخاب‌شده",
    },
    {
      icon: Package,
      title: "تجربه‌ای بهتر از باز کردن بسته",
      text: "چیزهای خوب در بسته‌های کوچک می‌آیند",
    },
  ].map(({ icon: Icon, title, text }) => (
    <div key={title} className="flex items-center gap-3">
      <div className="rounded-xl bg-[#9dd9d2]/35 p-3 text-[#392f5a]">
        <Icon size={22} />
      </div>
      <div>
        <p className="text-xs font-bold">{title}</p>
        <p className="mt-1 text-[11px] text-slate-500">{text}</p>
      </div>
    </div>
  ))}
</section>

{/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">محصولات ویژه</h2>
          <Link href="/application/products">
            <Button variant="ghost" className="text-primary">
              مشاهده بیشتر ←
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
          {featuredProducts.map((product: Product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={(p) => (window.location.href = `/application/products/${p.id}`)}
            />
          ))}
        </div>
      </section>

      {/* Banner */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/70 p-8 text-white sm:p-12">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold sm:text-3xl">
              تحویل سریع به سراسر ایران
            </h2>
            <p className="mt-3 text-white/80">
              تمام محصولات ما با بهترین کیفیت و گارانتی معتبر ارسال می‌شوند.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function getCategoryIcon(icon: string): ReactNode {
  const icons: Record<string, ReactNode> = {
    laptop: <Laptop />,
    mobile: <Smartphone />,
    tablet:<Tablet/>,
    headphones: <Headphones />,
    monitor: "🖥️",
    keyboard: "⌨️",
    accessories: "🔌",
    storage: "💾",
  };
  return icons[icon] || "📦";
}

