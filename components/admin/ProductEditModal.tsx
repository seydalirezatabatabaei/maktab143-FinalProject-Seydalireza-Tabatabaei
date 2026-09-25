"use client";

import { useRef, useState } from "react";

import type { ProductUpdateInput } from "@/Api/ProductsApi";
import { Category, Product, SubCategory } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ProductForm = {
  name: string;
  brand: string;
  price: string;
  quantity: string;
  category: number | "";
  subcategory: number | "";
  description: string;
};

interface ProductEditModalProps {
  product: Product | null;
  categories: Category[];
  subcategories: SubCategory[];
  isPending?: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onUpdate: (values: ProductUpdateInput) => Promise<unknown> | unknown;
}

export default function ProductEditModal({
  product,
  categories,
  subcategories,
  isPending = false,
  errorMessage = null,
  onClose,
  onUpdate,
}: ProductEditModalProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState<ProductForm | null>(
    product
      ? {
          name: product.name,
          brand: product.brand,
          price: String(product.price),
          quantity: String(product.quantity),
          category: product.category,
          subcategory: product.subcategory,
          description: product.description,
        }
      : null
  );

  const availableSubcategories = subcategories.filter(
    (subcategory) => subcategory.category === form?.category
  );

  const updateForm = (field: keyof ProductForm, value: string) => {
    setForm((current) => {
      if (!current) return current;

      if (field === "category") {
        return {
          ...current,
          category: value ? Number(value) : "",
          subcategory: "",
        };
      }

      return {
        ...current,
        [field]: value,
      };
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form || !product || !formRef.current?.reportValidity()) return;

    const price = Number(form.price);
    const quantity = Number(form.quantity);

    if (
      !form.name.trim() ||
      !form.brand.trim() ||
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isFinite(quantity) ||
      quantity < 0 ||
      !form.category ||
      !form.subcategory
    ) {
      return;
    }

    void onUpdate({
      id: product.id,
      name: form.name.trim(),
      brand: form.brand.trim(),
      price,
      quantity,
      category: form.category,
      subcategory: form.subcategory,
      description: form.description,
    });
  };

  return (
    <Dialog
      open={Boolean(product)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        dir="rtl"
        className="sm:max-w-2xl max-h-[90dvh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>ویرایش کالا</DialogTitle>
          <DialogDescription>
            اطلاعات کالای انتخاب شده را تغییر دهید.
          </DialogDescription>
        </DialogHeader>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-product-name">نام کالا</Label>
              <Input
                id="edit-product-name"
                value={form?.name ?? ""}
                onChange={(event) =>
                  updateForm("name", event.target.value)
                }
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-product-brand">برند</Label>
              <Input
                id="edit-product-brand"
                value={form?.brand ?? ""}
                onChange={(event) =>
                  updateForm("brand", event.target.value)
                }
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-product-price">قیمت</Label>
              <Input
                id="edit-product-price"
                type="number"
                min="0"
                step="1"
                value={form?.price ?? ""}
                onChange={(event) =>
                  updateForm("price", event.target.value)
                }
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-product-quantity">موجودی</Label>
              <Input
                id="edit-product-quantity"
                type="number"
                min="0"
                step="1"
                value={form?.quantity ?? ""}
                onChange={(event) =>
                  updateForm("quantity", event.target.value)
                }
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-product-category">دسته‌بندی</Label>
              <select
                id="edit-product-category"
                value={form?.category ?? ""}
                onChange={(event) =>
                  updateForm("category", event.target.value)
                }
                required
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
              >
                <option value="">انتخاب دسته‌بندی</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-product-subcategory">زیردسته</Label>
              <select
                id="edit-product-subcategory"
                value={form?.subcategory ?? ""}
                onChange={(event) =>
                  updateForm("subcategory", event.target.value)
                }
                required
                disabled={!form?.category}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              >
                <option value="">انتخاب زیردسته</option>
                {availableSubcategories.map((subcategory) => (
                  <option
                    key={subcategory.id}
                    value={subcategory.id}
                  >
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-product-description">توضیحات</Label>
            <textarea
              id="edit-product-description"
              rows={4}
              value={form?.description ?? ""}
              onChange={(event) =>
                updateForm("description", event.target.value)
              }
              className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
            />
          </div>

          {errorMessage && (
            <p role="alert" className="text-sm text-destructive">
              {errorMessage}
            </p>
          )}

          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              انصراف
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}