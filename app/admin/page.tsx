"use client";

import React, { useMemo, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createProductWithImage,
  deleteProduct,
  getProducts,
  getCategories,
  getSubCategories,
  updateProduct,
} from "@/Api/ProductsApi";

import { Product } from "@/app/types/types";

import { AccordionLoader } from "@/components/accordion-loader";
import { Button } from "@/components/ui/button";

import ProductTable from "@/components/admin/ProductTable";
import ProductEditModal from "@/components/admin/ProductEditModal";
import ProductCreateModal from "@/components/admin/ProductCreateModal";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default function PanelAdmin() {
  const [page, setPage] = useState(1);

  const limit = 10;

  // -----------------------------
  // Category Filter
  // -----------------------------

  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);

  // -----------------------------
  // Get Products
  // -----------------------------

  const {
    data: productsData,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: [
      "products",
      page,
      limit,
      selectedCategory,
    ],

    queryFn: () =>
      getProducts({
        page,
        limit,
        category: selectedCategory,
      }),
  });

  // -----------------------------
  // Get Categories
  // -----------------------------

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // -----------------------------
  // Get SubCategories
  // -----------------------------

  const { data: subCategories } = useQuery({
    queryKey: ["subcategories"],
    queryFn: getSubCategories,
  });

  const queryClient = useQueryClient();

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);

  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      setEditingProduct(null);
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: createProductWithImage,
    onSuccess: () => {
      setIsAddModalOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSettled: () => {
      setDeletingProductId(null);
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });

  // -----------------------------
  // Category Map
  // -----------------------------

  const categoryMap = useMemo(() => {
    const map = new Map<number, string>();

    categories?.forEach((category) => {
      map.set(category.id, category.name);
    });

    return map;
  }, [categories]);

  // -----------------------------
  // SubCategory Map
  // -----------------------------

  const subCategoryMap = useMemo(() => {
    const map = new Map<number, string>();

    subCategories?.forEach((subcategory) => {
      map.set(subcategory.id, subcategory.name);
    });

    return map;
  }, [subCategories]);

  // -----------------------------
  // Products
  // -----------------------------

  const products: Product[] = Array.isArray(productsData)
    ? productsData
    : productsData?.data || [];

  const totalPages = productsData?.pages || 1;

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
        خطا در دریافت اطلاعات
      </p>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen"
    >

      {/* Header */}

      <AdminPageHeader
        title="مدیریت کالاها"
        action={
          <Button
            type="button"
            className="bg-green-600 hover:bg-green-700"
            onClick={() => setIsAddModalOpen(true)}
          >
            افزودن کالا
          </Button>
        }
      />

      <main className="mx-auto p-6">

        {/* Category Filter */}

        <div className="flex items-center gap-3 flex-wrap mb-6">

          {/* All */}

          <Button
            type="button"
            onClick={() => {
              setSelectedCategory(undefined);
              setPage(1);
            }}
            className={
              selectedCategory === undefined
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }
          >
            همه
          </Button>

          {/* Categories */}

          {categories?.map((category) => (

            <Button
              key={category.id}
              type="button"
              onClick={() => {
                setSelectedCategory(category.id);
                setPage(1);
              }}
              className={
                selectedCategory === category.id
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }
            >
              {category.name}
            </Button>

          ))}

        </div>

        {/* Fetching */}

        {isFetching && (
          <div className="text-sm text-blue-500 mb-3">
            در حال دریافت کالاها...
          </div>
        )}

        {/* Product Table */}

        <ProductTable
          products={products}
          categoryMap={categoryMap}
          subCategoryMap={subCategoryMap}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          isFetching={isFetching}
          deletingProductId={deletingProductId}
          onEdit={(product) => {
            setEditingProduct(product);
          }}
          onDelete={(product) => {
            if (!window.confirm(`آیا از حذف «${product.name}» مطمئن هستید؟`)) {
              return;
            }

            setDeletingProductId(product.id);
            void deleteMutation.mutateAsync(product.id);
          }}
        />

        <ProductEditModal
          key={editingProduct?.id ?? "closed"}
          product={editingProduct}
          categories={categories ?? []}
          subcategories={subCategories ?? []}
          isPending={updateMutation.isPending}
          errorMessage={
            updateMutation.isError && updateMutation.error instanceof Error
              ? updateMutation.error.message
              : null
          }
          onClose={() => setEditingProduct(null)}
          onUpdate={(values) => updateMutation.mutateAsync(values)}
        />

        {isAddModalOpen && (
          <ProductCreateModal
            categories={categories ?? []}
            subcategories={subCategories ?? []}
            isPending={createMutation.isPending}
            errorMessage={
              createMutation.isError && createMutation.error instanceof Error
                ? createMutation.error.message
                : null
            }
            onClose={() => setIsAddModalOpen(false)}
            onCreate={(values) => createMutation.mutateAsync(values)}
          />
        )}

      </main>

    </div>
  );
}