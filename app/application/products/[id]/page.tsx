"use client";

import { useEffect, use } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/Api/axios";
import { getProductImageSrc } from "@/Api/ProductsApi";
import { Product } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import { AccordionLoader } from "@/components/accordion-loader";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/app/store/cart-context";
import RelatedProductsSlider from "@/components/related-products-slider";
import ProductComments from "@/components/product-comments";
import LowStockNotice from "@/components/low-stock-notice";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = use(params);
  const productId = Number(id);
  const { addItem } = useCart();

  const {
    data: product,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: async (): Promise<Product> => {
      const response = await api.get<Product & { image: string | string[] }>(
        `/products/${productId}`
      );
      const data = response.data;
      return {
        ...data,
        image: Array.isArray(data.image)
          ? data.image
          : data.image
            ? [data.image]
            : [],
      };
    },
    enabled: !!id && !Number.isNaN(productId),
  });

  useEffect(() => {
    if (product) {
      document.title = `${product.name} | محصولات`;
    }
  }, [product]);

  if (isPending || !id || Number.isNaN(productId)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <AccordionLoader />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-red-500">خطا در دریافت اطلاعات محصول</p>
      </div>
    );
  }

  const imageSrc = getProductImageSrc(product.image);

  return (
    <div dir="rtl" className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid items-start gap-7 lg:grid-cols-2">
          {/* Image */}

          <div className="group relative aspect-square overflow-hidden rounded-[2rem] border border-white/80 bg-gradient-to-br from-[#f4d06f]/55 via-[#fff8f0] to-[#9dd9d2]/55 p-4 shadow-[0_24px_70px_rgba(57,47,90,0.12)] sm:p-7">
            <div className="absolute right-7 top-7 z-10 rounded-full border border-white/80 bg-[#fff8f0]/80 px-4 py-2 text-xs font-semibold text-[#392f5a] shadow-sm backdrop-blur-lg">
              انتخاب هوشمندانه
            </div>
            <img
              src={imageSrc}
              alt={product.name}
              className="h-full w-full rounded-[1.5rem] object-cover transition-transform duration-700 group-hover:scale-[1.035]"
            />
          </div>

          {/* Details */}

          <div className="flex flex-col rounded-[2rem] border border-white/80 bg-white/55 p-6 shadow-[0_24px_70px_rgba(57,47,90,0.08)] backdrop-blur-xl sm:p-8">
            <p className="inline-flex w-fit rounded-full bg-[#9dd9d2]/35 px-3 py-1 text-sm font-semibold text-[#326d68]">{product.brand}</p>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-[#392f5a] sm:text-4xl">{product.name}</h1>

            <div className="mt-4">
              <LowStockNotice quantity={product.quantity} />
            </div>

            <div className="mt-6 rounded-2xl border border-[#f4d06f]/60 bg-gradient-to-l from-[#f4d06f]/35 to-[#fff8f0]/80 p-5">
              <p className="text-xs font-medium text-[#706780]">قیمت محصول</p>
              <span className="mt-1 block text-2xl font-bold text-[#392f5a] sm:text-3xl">
                {product.price.toLocaleString("fa-IR")} تومان
              </span>
            </div>

            <Separator className="my-6" />

            <div className="space-y-3 text-sm">
              <div className="flex">
                <span className="w-24 font-semibold text-[#392f5a]">موجودی:</span>
                <span>{product.quantity} عدد</span>
              </div>
            </div>

            <Separator className="my-6" />

            <div>
              <h3 className="mb-2 font-semibold text-[#392f5a]">توضیحات</h3>
              <div
                className="rounded-2xl bg-[#fff8f0]/75 p-4 text-sm leading-8 text-[#625a75]"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>

            <div className="mt-8 flex gap-3">
              <Button
                variant="outline"
                className="h-11 flex-1 rounded-xl border-[#392f5a]/15 bg-white/70 text-[#392f5a]"
                onClick={() => window.history.back()}
              >
                بازگشت
              </Button>
              <Button
                disabled={product.quantity < 1}
                className="h-11 flex-1 rounded-xl bg-[#392f5a] text-[#fff8f0] shadow-lg shadow-[#392f5a]/15 hover:bg-[#ff8811]"
                onClick={() => addItem(product)}
              >
                افزودن به سبد
              </Button>
            </div>
          </div>
        </div>
        <ProductComments productId={product.id} />
        <RelatedProductsSlider product={product} />
      </div>
    </div>
  );
}




