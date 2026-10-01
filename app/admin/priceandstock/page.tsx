"use client";

// -----------------------------
// import every things
// -----------------------------
import React, { useEffect, useState } from "react";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getProducts,
  updateProduct,
} from "@/Api/ProductsApi";

import { Product } from "@/app/types/types";

import { AccordionLoader } from "@/components/accordion-loader";
import { Button } from "@/components/ui/button";

import PriceStockTable from "@/components/admin/PriceStockTable";

export default function PriceAndStockPage() {

  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);

  const [editedProducts, setEditedProducts] = useState<Product[]>([]);
  const [dirtyProductIds, setDirtyProductIds] = useState<Set<number>>(new Set());
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  const limit = 10;

  // -----------------------------
  // GET PRODUCTS
  // -----------------------------

  const {
    data,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: [
      "products-price-stock",
      page,
      limit,
    ],

    queryFn: () =>
      getProducts({
        page,
        limit,
      }),
  });

  // -----------------------------
  // Sync API data with local state
  // -----------------------------

  useEffect(() => {

    if (data?.data) {
      setEditedProducts(data.data);
      setDirtyProductIds(new Set());
    }

  }, [data]);

  // -----------------------------
  // Update Product Mutation
  // -----------------------------

  const updateMutation = useMutation({
    mutationFn: updateProduct,

  });

  // -----------------------------
  // Change Price
  // -----------------------------

  const handlePriceChange = (
    id: number,
    price: number
  ) => {

    setEditedProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? {
            ...product,
            price,
          }
          : product
      )
    );
    setDirtyProductIds((prev) => new Set(prev).add(id));
    setSaveMessage("");
    setSaveError("");

  };

  // -----------------------------
  // Change Quantity
  // -----------------------------

  const handleQuantityChange = (
    id: number,
    quantity: number
  ) => {

    setEditedProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? {
            ...product,
            quantity,
          }
          : product
      )
    );
    setDirtyProductIds((prev) => new Set(prev).add(id));
    setSaveMessage("");
    setSaveError("");

  };

  // -----------------------------
  // Save All
  // -----------------------------

  const handleSave = async () => {
    const changedProducts = editedProducts.filter((product) => dirtyProductIds.has(product.id));
    if (!changedProducts.length) return;

    try {
      await Promise.all(
          changedProducts.map((product) =>
          updateMutation.mutateAsync({
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            quantity: product.quantity,
            category: product.category,
            subcategory: product.subcategory,
            description: product.description,
          })
        )
      );
      setDirtyProductIds(new Set());
      setSaveMessage("تغییرات ذخیره شد.");
      await queryClient.invalidateQueries({ queryKey: ["products-price-stock"] });
      await queryClient.invalidateQueries({ queryKey: ["products"] });

    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "ذخیره‌ی تغییرات ناموفق بود.");

    }

  };

  // -----------------------------
  // Loading
  // -----------------------------

  if (isLoading) {

    return (
      <div className="w-full h-40 flex items-center justify-center">
        <AccordionLoader />
      </div>
    );

  }

  // -----------------------------
  // Error
  // -----------------------------

  if (isError) {

    return (
      <p className="p-6 text-red-500">
        خطا در دریافت محصولات
      </p>
    );

  }

  const totalPages =
    data?.pages ?? 1;

  return (
    <div dir="rtl" className="min-h-screen bg-white">

      <div className="flex items-center justify-between border-b px-8 py-5">

        <h1 className="text-2xl font-bold">
          مدیریت موجودی و قیمت ها
        </h1>

        <Button
          onClick={handleSave}
          disabled={updateMutation.isPending || dirtyProductIds.size === 0}
          className="bg-green-600 text-white hover:bg-green-700"
        >
          {updateMutation.isPending
            ? "در حال ذخیره..."
            : "ذخیره"}
        </Button>

      </div>

      <main className="max-w-5xl mx-auto p-6">
        {(saveMessage || saveError) && (
          <p role={saveError ? "alert" : "status"} className={`mb-4 rounded-xl px-4 py-3 text-sm ${saveError ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-800"}`}>
            {saveError || saveMessage}
          </p>
        )}

        {isFetching && (
          <div className="text-sm text-blue-500 mb-3">
            در حال دریافت اطلاعات...
          </div>
        )}

        <PriceStockTable
          products={editedProducts}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onPriceChange={handlePriceChange}
          onQuantityChange={handleQuantityChange}
          disabled={updateMutation.isPending}
        />

      </main>

    </div>
  );
}
