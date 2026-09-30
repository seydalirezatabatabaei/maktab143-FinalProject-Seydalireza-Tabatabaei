"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { getProducts } from "@/Api/ProductsApi";
import type { Product } from "@/app/types/types";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";

export default function RelatedProductsSlider({ product }: { product: Product }) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { data: relatedProducts = [], isLoading } = useQuery({
    queryKey: ["related-products", product.id, product.category, product.subcategory],
    queryFn: async () => {
      const subcategoryProducts = await getProducts({
        page: 1,
        limit: 8,
        category: product.category,
        subcategory: product.subcategory,
      });
      const subcategoryMatches = subcategoryProducts.data.filter((item) => item.id !== product.id);
      if (subcategoryMatches.length >= 2) return subcategoryMatches;

      const categoryProducts = await getProducts({
        page: 1,
        limit: 8,
        category: product.category,
      });
      return categoryProducts.data.filter((item) => item.id !== product.id).slice(0, 8);
    },
    enabled: Number.isFinite(product.category),
  });

  const scroll = (direction: "previous" | "next") => {
    const slider = sliderRef.current;
    if (!slider) return;
    const distance = slider.clientWidth * 0.8;
    slider.scrollBy({ left: direction === "next" ? -distance : distance, behavior: "smooth" });
  };

  if (!isLoading && relatedProducts.length === 0) return null;

  return (
    <section dir="rtl" aria-labelledby="related-products-title" className="mt-14 rounded-[2rem] border border-white/80 bg-white/40 p-5 shadow-[0_20px_55px_rgba(57,47,90,0.07)] backdrop-blur-xl sm:p-7">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="mb-1 flex items-center gap-2 text-xs font-semibold text-[#b85c00]">
            <Sparkles size={15} /> پیشنهاد برای شما
          </p>
          <h2 id="related-products-title" className="text-xl font-bold text-[#392f5a] sm:text-2xl">
            محصولات مشابه
          </h2>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="icon" aria-label="محصولات قبلی" onClick={() => scroll("previous")}>
            <ChevronRight />
          </Button>
          <Button type="button" variant="outline" size="icon" aria-label="محصولات بعدی" onClick={() => scroll("next")}>
            <ChevronLeft />
          </Button>
        </div>
      </div>

      <div ref={sliderRef} className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:thin]">
        {isLoading
          ? Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="w-56 shrink-0 snap-start animate-pulse overflow-hidden rounded-2xl border bg-white/70 sm:w-64">
                <div className="aspect-square bg-[#9dd9d2]/35" />
                <div className="space-y-3 p-4">
                  <div className="h-4 w-3/4 rounded-full bg-[#392f5a]/10" />
                  <div className="h-4 w-1/2 rounded-full bg-[#f4d06f]/45" />
                </div>
              </div>
            ))
          : relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="w-56 shrink-0 snap-start sm:w-64">
                <ProductCard
                  product={relatedProduct}
                  onClick={(item) => router.push(`/application/products/${item.id}`)}
                />
              </div>
            ))}
      </div>
    </section>
  );
}
