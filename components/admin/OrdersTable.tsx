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

import { Order } from "@/app/types/types";

interface OrdersTableProps {
  orders: Order[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onReview: (order: Order) => void;

  onSortByTime: () => void;
  sortOrder: "asc" | "desc";
}

export default function OrdersTable({
  orders,
  page,
  totalPages,
  onPageChange,
  onReview,
  onSortByTime,
  sortOrder,
}: OrdersTableProps) {
  // -----------------------------
  // Convert date to Persian/Jalali
  // -----------------------------
  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(timestamp));
  };

  // -----------------------------
  // Format time
  // -----------------------------
  const formatTime = (timestamp: number) => {
    return new Intl.DateTimeFormat("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(timestamp));
  };

  return (
    <div className="w-full overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white px-6 py-5">
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-bold text-gray-900">
            سفارش‌ها
          </h2>

          <p className="text-xs text-gray-400">
            لیست سفارش‌های ثبت‌شده و جزئیات مربوط به آن‌ها
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-b border-gray-100 bg-gray-50/80 hover:bg-gray-50/80">
              {/* User */}
              <TableHead className="h-14 px-6 text-right text-xs font-bold text-gray-500">
                مشتری
              </TableHead>

              {/* Price */}
              <TableHead className="h-14 px-6 text-right text-xs font-bold text-gray-500">
                مبلغ سفارش
              </TableHead>

              {/* Time */}
              <TableHead className="h-14 px-6 text-right text-xs font-bold text-gray-500">
                <button
                  type="button"
                  onClick={onSortByTime}
                  className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-bold text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-900"
                >
                  <span>زمان ثبت</span>

                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-md text-xs transition-all ${
                      sortOrder === "desc"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {sortOrder === "desc" ? "↓" : "↑"}
                  </span>
                </button>
              </TableHead>

              {/* Action */}
              <TableHead className="h-14 w-[170px] px-6 text-center text-xs font-bold text-gray-500">
                عملیات
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-2xl">
                      🛒
                    </div>

                    <h3 className="mb-1 font-bold text-gray-800">
                      سفارشی وجود ندارد
                    </h3>

                    <p className="text-sm text-gray-400">
                      هنوز هیچ سفارشی برای نمایش ثبت نشده است.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow
                  key={order.id}
                  className="group border-b border-gray-100 transition-all duration-200 hover:bg-emerald-50/30"
                >
                  {/* User */}
                  <TableCell className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 font-bold text-emerald-600">
                        {order.username?.charAt(0) || "ک"}
                      </div>

                      <div className="flex min-w-0 flex-col gap-1">
                        <span className="text-sm font-semibold text-gray-900">
                          {order.username} {order.lastname}
                        </span>

                        <span className="text-xs text-gray-400">
                          سفارش #{order.id}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Price */}
                  <TableCell className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-gray-900">
                        {order.prices.toLocaleString("fa-IR")}
                      </span>

                      <span className="text-[11px] text-gray-400">
                        تومان
                      </span>
                    </div>
                  </TableCell>

                  {/* Date */}
                  <TableCell className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-gray-800">
                        {formatDate(order.createdAt)}
                      </span>

                      <span className="text-xs text-gray-400">
                        {formatTime(order.createdAt)}
                      </span>
                    </div>
                  </TableCell>

                  {/* Review */}
                  <TableCell className="px-6 py-5">
                    <div className="flex justify-center">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => onReview(order)}
                        className="h-9 rounded-xl px-4 text-xs font-semibold text-emerald-600 transition-all hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        <span className="ml-2">↗</span>
                        بررسی سفارش
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>

          {/* Footer */}
          <TableFooter>
            <TableRow className="border-t border-gray-100 bg-white hover:bg-white">
              <TableCell colSpan={4} className="px-6 py-5">
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                  <div className="text-xs text-gray-400">
                    نمایش
                    <span className="mx-1 font-semibold text-gray-700">
                      {orders.length}
                    </span>
                    سفارش
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