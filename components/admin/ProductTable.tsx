"use client";

import React from "react";
import Image from "next/image";

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

interface ProductTableProps {
  products: Product[];

  categoryMap: Map<number, string>;
  subCategoryMap: Map<number, string>;

  page: number;
  totalPages: number;

  onPageChange: (page: number) => void;

  isFetching?: boolean;

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
  onEdit,
  onDelete,
}: ProductTableProps) {

  return (
    <div className="w-full bg-[#ffcb77]">

      {isFetching && (
        <div className="text-center text-sm text-blue-500 mb-2">
          در حال بارگذاری صفحه {page}...
        </div>
      )}

      <div className="border rounded-md bg-white overflow-hidden">

        <Table className="bg-[#ffcb77]">

          <TableHeader className="bg-[#adafa7]">
            <TableRow>

              <TableHead className="w-[100px] text-right font-bold">
                تصویر
              </TableHead>

              <TableHead className="text-right font-bold">
                نام کالا
              </TableHead>

              <TableHead className="text-right font-bold">
                دسته بندی
              </TableHead>

              <TableHead className="text-center font-bold w-[180px]">
                عملیات
              </TableHead>

            </TableRow>
          </TableHeader>

          <TableBody>

            {products.map((product) => (

              <TableRow key={product.id}>

                {/* Image */}

                <TableCell>

                  <div className="w-12 h-12 rounded-md bg-gray-200 overflow-hidden border">

                    <Image
                      src={`/ImageProduct/${product.image[0]}.jpg`}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />

                  </div>

                </TableCell>

                {/* Name */}

                <TableCell className="font-medium">
                  {product.name}
                </TableCell>

                {/* Category */}

                <TableCell>

                  <div className="flex flex-col">

                    <span className="font-semibold">
                      {categoryMap.get(product.category) || "—"}
                    </span>

                    <span className="text-xs text-gray-500">
                      {subCategoryMap.get(product.subcategory) || "—"}
                    </span>

                  </div>

                </TableCell>

                {/* Actions */}

                <TableCell>

                  <div className="flex items-center justify-center gap-3">

                    <Button
                      variant="link"
                      className="text-blue-600 p-0"
                      onClick={() =>
                        onEdit?.(product)
                      }
                    >
                      ویرایش
                    </Button>

                    <span className="text-gray-300">
                      |
                    </span>

                    <Button
                      variant="link"
                      className="text-blue-600 p-0"
                      onClick={() =>
                        onDelete?.(product)
                      }
                    >
                      حذف
                    </Button>

                  </div>

                </TableCell>

              </TableRow>

            ))}

          </TableBody>

          <TableFooter>

            <TableRow >
              <TableCell colSpan={5} className="flex justify-center">
              <PaginationFunc
                currentPage={page}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
              </TableCell>
            </TableRow>

          </TableFooter>

        </Table>

      </div>

    </div>
  );
}