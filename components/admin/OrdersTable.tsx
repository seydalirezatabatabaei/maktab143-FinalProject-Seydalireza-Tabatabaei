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

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).format(new Date(timestamp));
  };

  return (
    <div className="border rounded-md bg-white overflow-hidden">

      <Table>

        <TableHeader className="bg-gray-100">

          <TableRow>

            {/* User */}

            <TableHead className="text-right font-bold">
              نام کاربر
            </TableHead>

            {/* Price */}

            <TableHead className="text-right font-bold">
              مجموع مبلغ
            </TableHead>

            {/* Time */}

            <TableHead className="text-right font-bold">

              <button
                type="button"
                onClick={onSortByTime}
                className="flex items-center gap-2 font-bold hover:text-green-600 transition-colors"
              >
                <span>
                  زمان
                </span>

                <span className="text-sm">
                  {sortOrder === "desc" ? "↓" : "↑"}
                </span>

              </button>

            </TableHead>

            {/* Review */}

            <TableHead className="text-center font-bold">
              بررسی سفارش
            </TableHead>

          </TableRow>

        </TableHeader>

        <TableBody>

          {orders.length === 0 ? (

            <TableRow>

              <TableCell
                colSpan={4}
                className="text-center py-8 text-gray-500"
              >
                سفارشی وجود ندارد
              </TableCell>

            </TableRow>

          ) : (

            orders.map((order) => (

              <TableRow key={order.id}>

                {/* User */}

                <TableCell className="font-medium">
                  {order.username}{" "}
                  {order.lastname}
                </TableCell>

                {/* Price */}

                <TableCell>
                  {order.prices.toLocaleString("fa-IR")} تومان
                </TableCell>

                {/* Date */}

                <TableCell>
                  {formatDate(order.createdAt)}
                </TableCell>

                {/* Review */}

                <TableCell className="text-center">

                  <Button
                    variant="link"
                    className="text-blue-600 p-0"
                    onClick={() => onReview(order)}
                  >
                    بررسی سفارش
                  </Button>

                </TableCell>

              </TableRow>

            ))

          )}

        </TableBody>

        <TableFooter>

          <TableRow>

            <TableCell colSpan={4}>

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
  );
}