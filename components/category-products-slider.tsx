"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { getProducts } from "@/Api/ProductsApi";
import type { Category } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product-card";

const CATEGORY_PRODUCT_LIMIT = 10;

export default function CategoryProductsSlider({ category }: { category: Category }) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["home-category-products", category.id, CATEGORY_PRODUCT_LIMIT],
    queryFn: () => getProducts({ page: 1, limit: CATEGORY_PRODUCT_LIMIT, category: category.id }),
  });

  const scroll = (direction: "previous" | "next") => {
    const slider = sliderRef.current;
    if (!slider) return;
    slider.scrollBy({
      left: direction === "next" ? -slider.clientWidth * 0.8 : slider.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  const products = data?.data ?? [];

  if (!isLoading && !isError && products.length === 0) return null;

  return (
    <section dir="rtl" aria-labelledby={`category-products-${category.id}`} className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 id={`category-products-${category.id}`} className="text-xl font-bold sm:text-2xl">
            {category.name}
          </h2>
          {!isLoading && !isError && (
            <p className="mt-1 text-sm text-muted-foreground">
              {products.length.toLocaleString("fa-IR")} محصول
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button type="button" variant="outline" size="icon" aria-label={`محصولات قبلی ${category.name}`} onClick={() => scroll("previous")} disabled={isLoading || products.length < 2}>
            <ChevronRight aria-hidden="true" />
          </Button>
          <Button type="button" variant="outline" size="icon" aria-label={`محصولات بعدی ${category.name}`} onClick={() => scroll("next")} disabled={isLoading || products.length < 2}>
            <ChevronLeft aria-hidden="true" />
          </Button>
        </div>
      </div>

      {isError ? (
        <p role="status" className="rounded-xl border border-border bg-card px-4 py-5 text-sm text-muted-foreground">
          دریافت محصولات این دسته‌بندی ممکن نشد.
        </p>
      ) : (
        <div ref={sliderRef} className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:thin]" aria-label={`محصولات دسته‌بندی ${category.name}`}>
          {isLoading
            ? Array.from({ length: 4 }, (_, index) => (
                <div key={index} aria-hidden="true" className="w-52 shrink-0 snap-start animate-pulse overflow-hidden rounded-2xl border border-border bg-card sm:w-60">
                  <div className="aspect-square bg-muted" />
                  <div className="space-y-3 p-4">
                    <div className="h-4 w-3/4 rounded-full bg-secondary" />
                    <div className="h-4 w-1/2 rounded-full bg-muted" />
                  </div>
                </div>
              ))
            : products.map((product) => (
                <div key={product.id} className="w-52 shrink-0 snap-start sm:w-60">
                  <ProductCard product={product} onClick={(item) => router.push(`/application/products/${item.id}`)} />
                </div>
              ))}
        </div>
      )}
    </section>
  );
}
