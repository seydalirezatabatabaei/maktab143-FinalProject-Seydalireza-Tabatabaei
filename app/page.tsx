"use client";

import { ReactNode, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { getCategories, getProducts } from "@/Api/ProductsApi";
import { Category, Product } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product-card";
import CategoryProductsSlider from "@/components/category-products-slider";
import StorefrontInventoryReadout from "@/components/storefront-inventory-readout";
import StorefrontHero from "@/components/storefront-hero";
import { AccordionLoader } from "@/components/accordion-loader";
import {
  Cable,
  ChevronRight,
  Cpu,
  Gamepad2,
  HardDrive,
  Headphones,
  Heart,
  Laptop,
  Keyboard,
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
} from "lucide-react";

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
          <StorefrontHero />

          <StorefrontInventoryReadout products={featuredProducts} />

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
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-2xl">
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
      {/* <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
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
      </section> */}

      {/* Products from every category, limited by the API to the first ten. */}
      {categories?.map((category) => (
        <CategoryProductsSlider key={category.id} category={category} />
      ))}

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
    tablet: <Tablet />,
    headphones: <Headphones />,
    monitor: <Monitor />,
    keyboard: <Keyboard />,
    accessories: <Cable />,
    storage: <HardDrive />,
  };
  return icons[icon] || <Package />;
}
