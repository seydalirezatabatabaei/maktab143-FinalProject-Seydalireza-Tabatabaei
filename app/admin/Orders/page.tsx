"use client";

import React, { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { getOrders } from "@/Api/OrdersApi";

import { AccordionLoader } from "@/components/accordion-loader";

import OrdersTable from "@/components/admin/OrdersTable";

export default function OrdersPage() {

  const [status, setStatus] = useState<
    "true" | "false"
  >("false");

  const [page, setPage] = useState(1);

  const limit = 10;

  // -----------------------------
  // Get Orders
  // -----------------------------

  const {
    data,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: [
      "orders",
      status,
      page,
      limit,
    ],

    queryFn: () =>
      getOrders({
        page,
        limit,
        delivered: status,
      }),
  });

  const orders = data?.data ?? [];

  const totalPages =
    data?.pages ?? 1;

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
        خطا در دریافت سفارشات
      </p>
    );

  }

  return (
    <div dir="rtl" className="min-h-screen bg-white">

      <div className="border-b px-8 py-5">

        <h1 className="text-2xl font-bold">
          مدیریت سفارش ها
        </h1>

      </div>

      <main className="max-w-5xl mx-auto p-6">

        {/* Status */}

        <div className="flex items-center gap-8 mb-6">

          {/* Delivered */}

          <label className="flex items-center gap-2 cursor-pointer">

            <input
              type="radio"
              name="orderStatus"
              checked={status === "true"}
              onChange={() => {
                setStatus("true");
                setPage(1);
              }}
            />

            <span>
              سفارش های تحویل شده
            </span>

          </label>

          {/* Pending */}

          <label className="flex items-center gap-2 cursor-pointer">

            <input
              type="radio"
              name="orderStatus"
              checked={status === "false"}
              onChange={() => {
                setStatus("false");
                setPage(1);
              }}
            />

            <span>
              سفارش های در انتظار ارسال
            </span>

          </label>

        </div>

        {isFetching && (
          <div className="text-sm text-blue-500 mb-3">
            در حال دریافت سفارشات...
          </div>
        )}

        <OrdersTable
          orders={orders}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onReview={(order) => {
            console.log(
              "بررسی سفارش:",
              order
            );
          }}
        />

      </main>

    </div>
  );
}