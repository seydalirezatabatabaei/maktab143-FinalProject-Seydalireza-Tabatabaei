"use client";

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

  const [editedProducts, setEditedProducts] =
    useState<Product[]>([]);

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
    }

  }, [data]);

  // -----------------------------
  // Update Product Mutation
  // -----------------------------

  const updateMutation = useMutation({
    mutationFn: updateProduct,

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: [
          "products-price-stock",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

    },
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

  };

  // -----------------------------
  // Save All
  // -----------------------------

  const handleSave = async () => {

    try {

      await Promise.all(
        editedProducts.map((product) =>
          updateMutation.mutateAsync({
            id: product.id,
            price: product.price,
            quantity: product.quantity,
          })
        )
      );

      console.log(
        "تمام تغییرات ذخیره شد"
      );

    } catch (error) {

      console.error(
        "خطا در ذخیره:",
        error
      );

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
          variant="outline"
          onClick={handleSave}
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending
            ? "در حال ذخیره..."
            : "ذخیره"}
        </Button>

      </div>

      <main className="max-w-5xl mx-auto p-6">

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
        />

      </main>

    </div>
  );
}