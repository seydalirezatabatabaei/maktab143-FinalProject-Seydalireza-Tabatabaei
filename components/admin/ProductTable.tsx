
"use client";

import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { PaginationFunc } from "@/components/ui/PaginationCom";

import { Product } from "@/app/types/types";

const getProductImageSrc = (product: Product) => {
  const image = Array.isArray(product.image)
    ? product.image[0]
    : product.image;

  if (!image) {
    return "/ImageProduct/phone.jpg";
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("/")
  ) {
    return image;
  }

  return `/ImageProduct/${image}.jpg`;
};

interface ProductTableProps {
  products: Product[];

  categoryMap: Map<number, string>;
  subCategoryMap: Map<number, string>;

  page: number;
  totalPages: number;

  onPageChange: (page: number) => void;

  isFetching?: boolean;
  deletingProductId?: number | null;

  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export default function ProductTable({
  products,
  categoryMap,
  subCategoryMap,
  page,
  totalPages,
  onPageChange,
  isFetching = false,
  deletingProductId = null,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <div className="w-full">

      {/* ================================================= */}
      {/* Fetching */}
      {/* ================================================= */}

      {isFetching && (
        <div className="px-5 pt-4">
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm text-emerald-700">

            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />

            <span>
              در حال دریافت اطلاعات صفحه {page}...
            </span>

          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* Table Container */}
      {/* ================================================= */}

      <div className="overflow-hidden">

        <Table className="w-full">

          {/* ================================================= */}
          {/* Header */}
          {/* ================================================= */}

          <TableHeader>

            <TableRow className="border-b border-gray-100 bg-gray-50/70 hover:bg-gray-50/70">

              <TableHead className="h-14 w-[100px] px-6 text-right text-xs font-bold text-gray-500">
                تصویر
              </TableHead>

              <TableHead className="h-14 px-4 text-right text-xs font-bold text-gray-500">
                اطلاعات کالا
              </TableHead>

              <TableHead className="h-14 px-4 text-right text-xs font-bold text-gray-500">
                دسته‌بندی
              </TableHead>

              <TableHead className="h-14 w-[180px] px-6 text-center text-xs font-bold text-gray-500">
                عملیات
              </TableHead>

            </TableRow>

          </TableHeader>

          {/* ================================================= */}
          {/* Body */}
          {/* ================================================= */}

          <TableBody>

            {products.length === 0 ? (

              <TableRow>

                <TableCell
                  colSpan={4}
                  className="h-64 text-center"
                >
                  <div className="flex flex-col items-center justify-center">

                    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl mb-4">
                      📦
                    </div>

                    <h3 className="font-bold text-gray-800 mb-1">
                      کالایی پیدا نشد
                    </h3>

                    <p className="text-sm text-gray-400">
                      در این دسته‌بندی هنوز کالایی ثبت نشده است.
                    </p>

                  </div>
                </TableCell>

              </TableRow>

            ) : (

              products.map((product) => {

                const isDeleting =
                  deletingProductId === product.id;

                const categoryName =
                  categoryMap.get(product.category) || "بدون دسته‌بندی";

                const subCategoryName =
                  subCategoryMap.get(product.subcategory) || null;

                return (

                  <TableRow
                    key={product.id}
                    className="
                      group
                      border-b
                      border-gray-100
                      transition-all
                      duration-200
                      hover:bg-emerald-50/30
                    "
                  >

                    {/* ================================================= */}
                    {/* Image */}
                    {/* ================================================= */}

                    <TableCell className="px-6 py-4">

                      <div className="relative w-14 h-14">

                        <div
                          className="
                            w-14
                            h-14
                            rounded-2xl
                            overflow-hidden
                            bg-gray-50
                            border
                            border-gray-100
                            shadow-sm
                            transition-all
                            duration-300
                            group-hover:shadow-md
                            group-hover:scale-[1.03]
                          "
                        >

                          <img
                            src={getProductImageSrc(product)}
                            alt={product.name}
                            width={56}
                            height={56}
                            loading="lazy"
                            className="
                              w-full
                              h-full
                              object-cover
                              transition-transform
                              duration-300
                              group-hover:scale-110
                            "
                          />

                        </div>

                        {/* Status Dot */}

                        <span
                          className="
                            absolute
                            -bottom-1
                            -left-1
                            w-4
                            h-4
                            rounded-full
                            bg-emerald-500
                            border-[3px]
                            border-white
                            shadow-sm
                          "
                        />

                      </div>

                    </TableCell>

                    {/* ================================================= */}
                    {/* Product Name */}
                    {/* ================================================= */}

                    <TableCell className="px-4 py-4">

                      <div className="flex flex-col gap-1">

                        <span className="font-semibold text-gray-900 text-sm">
                          {product.name}
                        </span>

                        <span className="text-xs text-gray-400">
                          شناسه کالا: #{product.id}
                        </span>

                      </div>

                    </TableCell>

                    {/* ================================================= */}
                    {/* Category */}
                    {/* ================================================= */}

                    <TableCell className="px-4 py-4">

                      <div className="flex flex-col items-start gap-1.5">

                        {/* Category */}

                        <span
                          className="
                            inline-flex
                            items-center
                            rounded-lg
                            bg-emerald-50
                            px-2.5
                            py-1
                            text-xs
                            font-semibold
                            text-emerald-700
                          "
                        >
                          {categoryName}
                        </span>

                        {/* Sub Category */}

                        {subCategoryName && (
                          <span className="text-xs text-gray-400">
                            {subCategoryName}
                          </span>
                        )}

                      </div>

                    </TableCell>

                    {/* ================================================= */}
                    {/* Actions */}
                    {/* ================================================= */}

                    <TableCell className="px-6 py-4">

                      <div className="flex items-center justify-center gap-2">

                        {/* Edit */}

                        <Button
                          type="button"
                          variant="ghost"
                          disabled={isDeleting}
                          onClick={() =>
                            onEdit?.(product)
                          }
                          className="
                            h-9
                            rounded-xl
                            px-3
                            text-xs
                            font-medium
                            text-blue-600
                            hover:bg-blue-50
                            hover:text-blue-700
                            transition-all
                          "
                        >
                          <span className="ml-1.5">
                            ✎
                          </span>

                          ویرایش
                        </Button>

                        {/* Delete */}

                        <Button
                          type="button"
                          variant="ghost"
                          disabled={isDeleting}
                          onClick={() =>
                            onDelete?.(product)
                          }
                          className="
                            h-9
                            rounded-xl
                            px-3
                            text-xs
                            font-medium
                            text-red-500
                            hover:bg-red-50
                            hover:text-red-600
                            transition-all
                          "
                        >
                          {isDeleting ? (
                            <>
                              <span className="ml-1.5 w-3 h-3 rounded-full border-2 border-red-400 border-t-transparent animate-spin" />

                              در حال حذف...
                            </>
                          ) : (
                            <>
                              <span className="ml-1.5">
                                ×
                              </span>

                              حذف
                            </>
                          )}
                        </Button>

                      </div>

                    </TableCell>

                  </TableRow>

                );
              })

            )}

          </TableBody>

          {/* ================================================= */}
          {/* Footer */}
          {/* ================================================= */}

          <TableFooter>

            <TableRow className="border-t border-gray-100 bg-white hover:bg-white">

              <TableCell
                colSpan={4}
                className="px-5 py-5"
              >

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

                  {/* Result Info */}

                  <div className="text-xs text-gray-400">

                    نمایش
                    <span className="mx-1 font-semibold text-gray-700">
                      {products.length}
                    </span>
                    کالا

                  </div>

                  {/* Pagination */}

                  <div className="flex justify-center">

                    <PaginationFunc
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={onPageChange}
                    />

                  </div>

                </div>

              </TableCell>

            </TableRow>

          </TableFooter>

        </Table>

      </div>

    </div>
  );
}

