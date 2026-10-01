"use client";

import React, { useState } from "react";
import { Minus, Package, Plus } from "lucide-react";

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
import { Button } from "@/components/ui/button";

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
  disabled?: boolean;
}
export default function PriceStockTable({
  products,
  page,
  totalPages,
  onPageChange,
  onPriceChange,
  onQuantityChange,
  disabled = false,
}: PriceStockTableProps) {
  const [editingField, setEditingField] = useState<{ id: number; field: "price" | "quantity" } | null>(null);

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
                    <div className="mb-4 flex h-16 w-16 items-center justify-center border border-border text-primary"><Package size={24} aria-hidden="true" /></div>

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
                const price = Number(product.price) || 0;
                const editingPrice = editingField?.id === product.id && editingField.field === "price";
                const editingQuantity = editingField?.id === product.id && editingField.field === "quantity";

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
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-primary text-primary"><Package size={18} aria-hidden="true" /></div>

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
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          step={1000}
                          readOnly={!editingPrice}
                          disabled={disabled}
                          aria-label={`قیمت ${product.name}`}
                          title={editingPrice ? "ویرایش قیمت" : "برای ویرایش کلیک کنید"}
                          onClick={() => setEditingField({ id: product.id, field: "price" })}
                          onFocus={() => setEditingField({ id: product.id, field: "price" })}
                          onBlur={() => setEditingField((current) => current?.id === product.id && current.field === "price" ? null : current)}
                          value={product.price ?? ""}
                          onChange={(event) =>
                            onPriceChange(
                              product.id,
                              Number(event.target.value)
                            )
                          }
                          className={`h-11 rounded-xl border-gray-200 pl-16 pr-4 text-sm font-semibold text-gray-900 shadow-none transition-all focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100 ${editingPrice ? "bg-white" : "cursor-pointer bg-gray-50"}`}
                          placeholder="0"
                        />
                        <div className="flex shrink-0 gap-1">
                          <Button type="button" variant="outline" size="icon" aria-label={`افزایش قیمت ${product.name} به اندازه هزار تومان`} disabled={disabled} onClick={() => onPriceChange(product.id, price + 1000)}>
                            <Plus size={15} aria-hidden="true" />
                          </Button>
                          <Button type="button" variant="outline" size="icon" aria-label={`کاهش قیمت ${product.name} به اندازه هزار تومان`} disabled={disabled || price <= 0} onClick={() => onPriceChange(product.id, Math.max(0, price - 1000))}>
                            <Minus size={15} aria-hidden="true" />
                          </Button>
                        </div>
                        <span className="shrink-0 text-xs font-medium text-gray-400">تومان</span>
                      </div>
                    </TableCell>

                    {/* Quantity */}
                    <TableCell className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                          <Input
                            type="number"
                            min={0}
                            step={1}
                            readOnly={!editingQuantity}
                            disabled={disabled}
                            aria-label={`موجودی ${product.name}`}
                            title={editingQuantity ? "ویرایش موجودی" : "برای ویرایش کلیک کنید"}
                            onClick={() => setEditingField({ id: product.id, field: "quantity" })}
                            onFocus={() => setEditingField({ id: product.id, field: "quantity" })}
                            onBlur={() => setEditingField((current) => current?.id === product.id && current.field === "quantity" ? null : current)}
                            value={product.quantity ?? ""}
                            onChange={(event) =>
                              onQuantityChange(
                                product.id,
                                Number(event.target.value)
                              )
                            }
                            className={`h-11 rounded-xl border-gray-200 px-4 text-sm font-semibold text-gray-900 shadow-none transition-all focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100 ${editingQuantity ? "bg-white" : "cursor-pointer bg-gray-50"}`}
                            placeholder="0"
                          />
                        </div>

                        <div className="flex shrink-0 gap-1">
                          <Button type="button" variant="outline" size="icon" aria-label={`افزایش موجودی ${product.name}`} disabled={disabled} onClick={() => onQuantityChange(product.id, quantity + 1)}>
                            <Plus size={15} aria-hidden="true" />
                          </Button>
                          <Button type="button" variant="outline" size="icon" aria-label={`کاهش موجودی ${product.name}`} disabled={disabled || quantity <= 0} onClick={() => onQuantityChange(product.id, Math.max(0, quantity - 1))}>
                            <Minus size={15} aria-hidden="true" />
                          </Button>
                        </div>

                        <div className="shrink-0">
                          <div className="inventory-readout min-w-[160px] flex-col gap-1">
                            <span>موجودی / وضعیت</span>
                            <span className="inventory-readout__value">{quantity.toLocaleString("fa-IR")} · {isOutOfStock ? "ناموجود" : isLowStock ? "کم" : "موجود"}</span>
                          </div>
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
