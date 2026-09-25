"use client";

import { useEffect, use } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/Api/axios";
import { getProductImageSrc } from "@/Api/ProductsApi";
import { Product } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import { AccordionLoader } from "@/components/accordion-loader";
import { Separator } from "@/components/ui/separator";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = use(params);
  const productId = Number(id);

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
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image */}

          <div className="overflow-hidden rounded-2xl bg-muted">
            <img
              src={imageSrc}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Details */}

          <div className="flex flex-col">
            <p className="text-sm text-muted-foreground">{product.brand}</p>
            <h1 className="mt-1 text-3xl font-bold">{product.name}</h1>

            <div className="mt-4">
              <span className="text-2xl font-bold text-primary">
                {product.price.toLocaleString("fa-IR")} تومان
              </span>
            </div>

            <Separator className="my-6" />

            <div className="space-y-3 text-sm">
              <div className="flex">
                <span className="w-24 font-semibold">موجودی:</span>
                <span>{product.quantity} عدد</span>
              </div>
            </div>

            <Separator className="my-6" />

            <div>
              <h3 className="mb-2 font-semibold">توضیحات</h3>
              <div
                className="text-sm leading-relaxed text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>

            <div className="mt-8 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => window.history.back()}
              >
                بازگشت
              </Button>
              <Button
                disabled
                className="flex-1 cursor-not-allowed opacity-60"
                title="عملکرد این دکمه غیر_faactive است"
              >
                افزودن به سبد
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




