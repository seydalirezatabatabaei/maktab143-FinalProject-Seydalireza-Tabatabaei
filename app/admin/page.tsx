"use client";

import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  getProducts,
  getCategories,
  getSubCategories,
} from "@/Api/ProductsApi";

import { Product } from "@/app/types/types";

import { AccordionLoader } from "@/components/accordion-loader";
import { Button } from "@/components/ui/button";

import ProductTable from "@/components/admin/ProductTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default function PanelAdmin() {
  const [page, setPage] = useState(1);

  const limit = 10;

  const {
    data: productsData,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["products", page, limit],
    queryFn: () => getProducts({ page, limit }),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: subCategories } = useQuery({
    queryKey: ["subcategories"],
    queryFn: getSubCategories,
  });

  const categoryMap = useMemo(() => {
    const map = new Map<number, string>();

    categories?.forEach((category) => {
      map.set(category.id, category.name);
    });

    return map;
  }, [categories]);

  const subCategoryMap = useMemo(() => {
    const map = new Map<number, string>();

    subCategories?.forEach((subcategory) => {
      map.set(subcategory.id, subcategory.name);
    });

    return map;
  }, [subCategories]);

  const products: Product[] = Array.isArray(productsData)
    ? productsData
    : productsData?.data || [];

  const totalPages = productsData?.pages || 1;

  if (isLoading) {
    return (
      <div className="w-full h-40 flex items-center justify-center">
        <AccordionLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="p-6 text-red-500">
        خطا در دریافت اطلاعات
      </p>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-white">
      
      <AdminPageHeader
        title="مدیریت کالاها"
        action={
          <Button className="bg-green-600 hover:bg-green-700">
            افزودن کالا
          </Button>
        }
      />

      <main className="max-w-5xl mx-auto p-6">
        <ProductTable
          products={products}
          categoryMap={categoryMap}
          subCategoryMap={subCategoryMap}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          isFetching={isFetching}
          onEdit={(product) => {
            console.log("edit", product);
          }}
          onDelete={(product) => {
            console.log("delete", product);
          }}
        />
      </main>

    </div>
  );
}