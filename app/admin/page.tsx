
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
  const limit = 5;

  const [selectedCategory, setSelectedCategory] = useState<
    number | undefined
  >(undefined);

  // --------------------------------
  // Products
  // --------------------------------

  const {
    data: productsData,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["products", page, limit, selectedCategory],

    queryFn: () =>
      getProducts({
        page,
        limit,
        category: selectedCategory,
      }),
  });

  // --------------------------------
  // Categories
  // --------------------------------

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // --------------------------------
  // Sub Categories
  // --------------------------------

  const { data: subCategories } = useQuery({
    queryKey: ["subcategories"],
    queryFn: getSubCategories,
  });

  const queryClient = useQueryClient();

  // --------------------------------
  // State
  // --------------------------------

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] =
    useState(false);

  const [deletingProductId, setDeletingProductId] =
    useState<number | null>(null);

  // --------------------------------
  // Update
  // --------------------------------

  const updateMutation = useMutation({
    mutationFn: updateProduct,

    onSuccess: () => {
      setEditingProduct(null);

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });

  // --------------------------------
  // Create
  // --------------------------------

  const createMutation = useMutation({
    mutationFn: createProductWithImage,

    onSuccess: () => {
      setIsAddModalOpen(false);

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });

  // --------------------------------
  // Delete
  // --------------------------------

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,

    onSettled: () => {
      setDeletingProductId(null);

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });

  // --------------------------------
  // Category Map
  // --------------------------------

  const categoryMap = useMemo(() => {
    const map = new Map<number, string>();

    categories?.forEach((category) => {
      map.set(category.id, category.name);
    });

    return map;
  }, [categories]);

  // --------------------------------
  // Sub Category Map
  // --------------------------------

  const subCategoryMap = useMemo(() => {
    const map = new Map<number, string>();

    subCategories?.forEach((subcategory) => {
      map.set(subcategory.id, subcategory.name);
    });

    return map;
  }, [subCategories]);

  // --------------------------------
  // Products
  // --------------------------------

  const products: Product[] = Array.isArray(productsData)
    ? productsData
    : productsData?.data || [];

  const totalPages = productsData?.pages || 1;

  // --------------------------------
  // Loading
  // --------------------------------

  if (isLoading) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-[#f7f9f8] flex items-center justify-center"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center">
            <AccordionLoader />
          </div>

          <p className="text-sm text-gray-500">
            در حال بارگذاری اطلاعات...
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------
  // Error
  // --------------------------------

  if (isError) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-[#f7f9f8] flex items-center justify-center p-6"
      >
        <div className="w-full max-w-md rounded-3xl bg-white border border-red-100 shadow-sm p-8 text-center">
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-red-50 flex items-center justify-center text-2xl">
            !
          </div>

          <h2 className="text-lg font-bold text-gray-900 mb-2">
            دریافت اطلاعات ناموفق بود
          </h2>

          <p className="text-sm text-gray-500">
            در دریافت اطلاعات کالاها مشکلی رخ داده است.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#f7f9f8]"
    >
      {/* ================================================= */}
      {/* Header */}
      {/* ================================================= */}

      <div className="border-b border-gray-200/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">

          <AdminPageHeader
            title="مدیریت کالاها"
            action={
              <Button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="
                  h-11
                  px-5
                  rounded-xl
                  bg-emerald-600
                  hover:bg-emerald-700
                  text-white
                  shadow-lg
                  shadow-emerald-600/20
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                "
              >
                <span className="text-xl ml-2 leading-none">
                  +
                </span>

                افزودن کالا
              </Button>
            }
          />

        </div>
      </div>

      {/* ================================================= */}
      {/* Main */}
      {/* ================================================= */}

      <main className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6 lg:py-8">

        {/* ================================================= */}
        {/* Top Stats */}
        {/* ================================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

          {/* Products */}

          <div className="group bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500 mb-2">
                تعداد کالا ها در هر صفحه 
                </p>

                <p className="text-3xl font-bold text-gray-900">
                  {productsData?.data.length}
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                📦
              </div>

            </div>

          </div>

          {/* Categories */}

          <div className="group bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500 mb-2">
                  دسته‌بندی‌ها
                </p>

                <p className="text-3xl font-bold text-gray-900">
                  {categories?.length ?? 0}
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                ◈
              </div>

            </div>

          </div>

          {/* Sub Categories */}

          <div className="group bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500 mb-2">
                  زیر دسته‌ها
                </p>

                <p className="text-3xl font-bold text-gray-900">
                  {subCategories?.length ?? 0}
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                ≡
              </div>

            </div>

          </div>

        </div>

        {/* ================================================= */}
        {/* Filter */}
        {/* ================================================= */}

        <section className="bg-white border border-gray-100 rounded-3xl shadow-sm mb-6 overflow-hidden">

          <div className="p-5 sm:p-6">

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

              <div>
                <h2 className="text-base font-bold text-gray-900">
                  فیلتر دسته‌بندی
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  برای مشاهده کالاها یک دسته‌بندی انتخاب کنید
                </p>
              </div>

              {isFetching && (
                <div className="inline-flex items-center gap-2 self-start lg:self-auto bg-emerald-50 text-emerald-700 rounded-full px-4 py-2 text-xs font-medium">

                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />

                  در حال بروزرسانی...

                </div>
              )}

            </div>

            {/* Category Pills */}

            <div className="flex flex-wrap gap-2 mt-5">

              <Button
                type="button"
                onClick={() => {
                  setSelectedCategory(undefined);
                  setPage(1);
                }}
                className={`
                  h-10
                  px-5
                  rounded-full
                  text-sm
                  border
                  transition-all
                  duration-200

                  ${
                    selectedCategory === undefined
                      ? "bg-gray-900 text-white border-gray-900 shadow-md"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                  }
                `}
              >
                همه کالاها
              </Button>

              {categories?.map((category) => (

                <Button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setPage(1);
                  }}
                  className={`
                    h-10
                    px-5
                    rounded-full
                    text-sm
                    border
                    transition-all
                    duration-200

                    ${
                      selectedCategory === category.id
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                    }
                  `}
                >
                  {category.name}
                </Button>

              ))}

            </div>

          </div>

        </section>

        {/* ================================================= */}
        {/* Products */}
        {/* ================================================= */}

        <section className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">

          {/* Products Header */}

          <div className="px-5 sm:px-6 py-5 border-b border-gray-100">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  لیست کالاها
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  مدیریت و ویرایش محصولات فروشگاه
                </p>
              </div>

              <div className="flex items-center gap-2">

                <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">

                  <span className="text-xs text-gray-500">
                    صفحه
                  </span>

                  <span className="min-w-7 h-7 px-2 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-700">
                    {page}
                  </span>

                  <span className="text-xs text-gray-400">
                    از {totalPages}
                  </span>

                </div>

              </div>

            </div>

          </div>

          {/* Table */}

          <div className="overflow-x-auto">

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
                if (
                  !window.confirm(
                    `آیا از حذف «${product.name}» مطمئن هستید؟`
                  )
                ) {
                  return;
                }

                setDeletingProductId(product.id);

                void deleteMutation.mutateAsync(
                  product.id
                );
              }}
            />

          </div>

        </section>

      </main>

      {/* ================================================= */}
      {/* Edit Modal */}
      {/* ================================================= */}

      <ProductEditModal
        key={editingProduct?.id ?? "closed"}
        product={editingProduct}
        categories={categories ?? []}
        subcategories={subCategories ?? []}
        isPending={updateMutation.isPending}

        errorMessage={
          updateMutation.isError &&
          updateMutation.error instanceof Error
            ? updateMutation.error.message
            : null
        }

        onClose={() => setEditingProduct(null)}

        onUpdate={(values) =>
          updateMutation.mutateAsync(values)
        }
      />

      {/* ================================================= */}
      {/* Create Modal */}
      {/* ================================================= */}

      {isAddModalOpen && (
        <ProductCreateModal
          categories={categories ?? []}
          subcategories={subCategories ?? []}
          isPending={createMutation.isPending}

          errorMessage={
            createMutation.isError &&
            createMutation.error instanceof Error
              ? createMutation.error.message
              : null
          }

          onClose={() => setIsAddModalOpen(false)}

          onCreate={(values) =>
            createMutation.mutateAsync(values)
          }
        />
      )}

    </div>
  );
}

