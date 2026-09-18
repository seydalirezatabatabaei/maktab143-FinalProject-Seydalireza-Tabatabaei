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
    <div className="border rounded-md bg-white overflow-hidden">

      <Table className="">

        <TableHeader className="bg-gray-100">

          <TableRow>

            <TableHead className="text-right font-bold">
              کالا
            </TableHead>

            <TableHead className="text-right font-bold w-[220px]">
              قیمت
            </TableHead>

            <TableHead className="text-right font-bold w-[180px]">
              موجودی
            </TableHead>

          </TableRow>

        </TableHeader>

        <TableBody>

          {products.map((product) => (

            <TableRow key={product.id}>

              <TableCell className="font-medium">
                {product.name}
              </TableCell>

              <TableCell>

                <Input
                  type="number"
                  value={product.price}
                  onChange={(event) =>
                    onPriceChange(
                      product.id,
                      Number(event.target.value)
                    )
                  }
                />

              </TableCell>

              <TableCell>

                <Input
                  type="number"
                  value={product.quantity}
                  onChange={(event) =>
                    onQuantityChange(
                      product.id,
                      Number(event.target.value)
                    )
                  }
                />

              </TableCell>

            </TableRow>

          ))}

        </TableBody>

        <TableFooter>

          <TableRow>

            <PaginationFunc
              currentPage={page}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />

          </TableRow>

        </TableFooter>

      </Table>

    </div>
  );
}