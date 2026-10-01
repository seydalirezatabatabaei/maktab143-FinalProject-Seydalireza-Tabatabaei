
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { ProductUpdateInput } from "@/Api/ProductsApi";
import {
  Category,
  Product,
  SubCategory,
} from "@/app/types/types";

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
import { productFormSchema, type ProductFormValues } from "@/lib/form-schemas";

interface ProductEditModalProps {
  product: Product | null;
  categories: Category[];
  subcategories: SubCategory[];
  isPending?: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onUpdate: (
    values: ProductUpdateInput
  ) => Promise<unknown> | unknown;
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
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<ProductFormValues>({ resolver: zodResolver(productFormSchema), defaultValues: { name: "", brand: "", price: "", quantity: "", category: "", subcategory: "", description: "" } });
  const category = watch("category");

// change the the form state whenever the product prop changes
  useEffect(() => {
    reset(product ? { name: product.name ?? "", brand: product.brand ?? "", price: String(product.price ?? ""), quantity: String(product.quantity ?? ""), category: product.category ? String(product.category) : "", subcategory: product.subcategory ? String(product.subcategory) : "", description: product.description ?? "" } : undefined);
  }, [product]);

  const availableSubcategories = subcategories.filter(
    (subcategory) =>
      subcategory.category === Number(category)
  );

  const submitProduct = (form: ProductFormValues) => {
    if (!product || isPending) return;
    void onUpdate({ id: product.id, name: form.name.trim(), brand: form.brand.trim(), price: Number(form.price), quantity: Number(form.quantity), category: Number(form.category), subcategory: Number(form.subcategory), description: form.description.trim() });
  };

  return (
    <Dialog
      open={Boolean(product)}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
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
          onSubmit={handleSubmit(submitProduct)}
          className="flex flex-col gap-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {/* نام */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-product-name">
                نام کالا
              </Label>

              <Input
                id="edit-product-name"
                {...register("name")}
              />
            </div>

            {/* برند */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-product-brand">
                برند
              </Label>

              <Input
                id="edit-product-brand"
                {...register("brand")}
              />
            </div>

            {/* قیمت */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-product-price">
                قیمت
              </Label>

              <Input
                id="edit-product-price"
                type="number"
                min="0"
                step="1"
                {...register("price")}
              />
            </div>

            {/* موجودی */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-product-quantity">
                موجودی
              </Label>

              <Input
                id="edit-product-quantity"
                type="number"
                min="0"
                step="1"
                {...register("quantity")}
              />
            </div>

            {/* دسته‌بندی */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-product-category">
                دسته‌بندی
              </Label>

              <select
                id="edit-product-category"
                value={category} onChange={(event) => { setValue("category", event.target.value, { shouldValidate: true }); setValue("subcategory", "", { shouldValidate: true }); }}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
              >
                <option value="">
                  انتخاب دسته‌بندی
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* زیردسته */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-product-subcategory">
                زیردسته
              </Label>

              <select
                id="edit-product-subcategory"
                {...register("subcategory")}
                disabled={!category}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              >
                <option value="">
                  انتخاب زیردسته
                </option>

                {availableSubcategories.map(
                  (subcategory) => (
                    <option
                      key={subcategory.id}
                      value={subcategory.id}
                    >
                      {subcategory.name}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          {/* توضیحات */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-product-description">
              توضیحات
            </Label>

            <textarea
              id="edit-product-description"
              rows={4}
              {...register("description")}
              className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
            />
          </div>

          {/* خطا */}
          {errorMessage && (
            <p
              role="alert"
              className="text-sm text-destructive"
            >
              {errorMessage}
            </p>
          )}
          {Object.values(errors).map((fieldError, index) => fieldError?.message && (
            <p key={index} role="alert" className="text-sm text-destructive">{fieldError.message}</p>
          ))}

          {/* دکمه‌ها */}
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              انصراف
            </Button>

            <Button
              type="submit"
              disabled={isPending}
            >
              {isPending
                ? "در حال ذخیره..."
                : "ذخیره تغییرات"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

