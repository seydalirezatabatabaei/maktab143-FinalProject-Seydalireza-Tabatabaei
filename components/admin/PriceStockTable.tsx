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

import { Input } from "@/components/ui/input";

import { Product } from "@/app/types/types";

import { PaginationFunc } from "@/components/ui/PaginationCom";

interface PriceStockTableProps {
  products: Product[];

  page: number;
  totalPages: number;

  onPageChange: (page: number) => void;

  onPriceChange: (
    id: number,
    price: number
  ) => void;

  onQuantityChange: (
    id: number,
    quantity: number
  ) => void;
}

export default function PriceStockTable({
  products,
  page,
  totalPages,
  onPageChange,
  onPriceChange,
  onQuantityChange,
}: PriceStockTableProps) {
  return (
    <div className="w-full overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white px-6 py-5">
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-bold text-gray-900">
            قیمت و موجودی کالاها
          </h2>

          <p className="text-xs text-gray-400">
            قیمت و تعداد موجودی هر کالا را از این بخش مدیریت کنید.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-b border-gray-100 bg-gray-50/80 hover:bg-gray-50/80">
              <TableHead className="h-14 px-6 text-right text-xs font-bold text-gray-500">
                کالا
              </TableHead>

              <TableHead className="h-14 w-[260px] px-6 text-right text-xs font-bold text-gray-500">
                قیمت
              </TableHead>

              <TableHead className="h-14 w-[220px] px-6 text-right text-xs font-bold text-gray-500">
                موجودی
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-2xl">
                      📦
                    </div>

                    <h3 className="mb-1 font-bold text-gray-800">
                      کالایی پیدا نشد
                    </h3>

                    <p className="text-sm text-gray-400">
                      در این صفحه کالایی برای نمایش وجود ندارد.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                const quantity = Number(product.quantity) || 0;

                const isOutOfStock = quantity === 0;
                const isLowStock = quantity > 0 && quantity <= 5;

                return (
                  <TableRow
                    key={product.id}
                    className="group border-b border-gray-100 transition-all duration-200 hover:bg-emerald-50/30"
                  >
                    {/* Product */}
                    <TableCell className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-lg">
                          📦
                        </div>

                        <div className="flex min-w-0 flex-col gap-1">
                          <span className="truncate text-sm font-semibold text-gray-900">
                            {product.name}
                          </span>

                          <span className="text-xs text-gray-400">
                            شناسه کالا: #{product.id}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Price */}
                    <TableCell className="px-6 py-5">
                      <div className="relative">
                        <Input
                          type="number"
                          min={0}
                          value={product.price ?? ""}
                          onChange={(event) =>
                            onPriceChange(
                              product.id,
                              Number(event.target.value)
                            )
                          }
                          className="h-11 rounded-xl border-gray-200 bg-gray-50 pl-16 pr-4 text-sm font-semibold text-gray-900 shadow-none transition-all focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                          placeholder="0"
                        />

                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">
                          تومان
                        </span>
                      </div>
                    </TableCell>

                    {/* Quantity */}
                    <TableCell className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                          <Input
                            type="number"
                            min={0}
                            value={product.quantity ?? ""}
                            onChange={(event) =>
                              onQuantityChange(
                                product.id,
                                Number(event.target.value)
                              )
                            }
                            className="h-11 rounded-xl border-gray-200 bg-gray-50 px-4 text-sm font-semibold text-gray-900 shadow-none transition-all focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                            placeholder="0"
                          />
                        </div>

                        <div className="shrink-0">
                          {isOutOfStock ? (
                            <span className="inline-flex items-center rounded-lg bg-red-50 px-2.5 py-1.5 text-[11px] font-semibold text-red-600">
                              ناموجود
                            </span>
                          ) : isLowStock ? (
                            <span className="inline-flex items-center rounded-lg bg-amber-50 px-2.5 py-1.5 text-[11px] font-semibold text-amber-600">
                              کم
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-600">
                              موجود
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>

          {/* Footer */}
          <TableFooter>
            <TableRow className="border-t border-gray-100 bg-white hover:bg-white">
              <TableCell colSpan={3} className="px-6 py-5">
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                  <div className="text-xs text-gray-400">
                    نمایش
                    <span className="mx-1 font-semibold text-gray-700">
                      {products.length}
                    </span>
                    کالا
                  </div>

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