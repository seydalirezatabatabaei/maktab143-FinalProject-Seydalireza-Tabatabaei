"use client";

import { type ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { ProductCreateFormInput } from "@/Api/ProductsApi";
import { Category, SubCategory } from "@/app/types/types";
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
import { productCreateSchema, type ProductCreateFormValues } from "@/lib/form-schemas";

interface ProductCreateModalProps {
  categories: Category[];
  subcategories: SubCategory[];
  isPending?: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onCreate: (values: ProductCreateFormInput) => Promise<unknown> | unknown;
}

export default function ProductCreateModal({
  categories,
  subcategories,
  isPending = false,
  errorMessage = null,
  onClose,
  onCreate,
}: ProductCreateModalProps) {
  const [previewUrl, setPreviewUrl] = useState("");
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProductCreateFormValues>({ resolver: zodResolver(productCreateSchema), defaultValues: { name: "", brand: "", price: "", quantity: "", category: "", subcategory: "", description: "" } });
  const image = watch("image");
  const category = watch("category");

  useEffect(() => {
    if (!image) { setPreviewUrl(""); return; }
    const url = URL.createObjectURL(image);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const availableSubcategories = subcategories.filter(
    (subcategory) => subcategory.category === Number(category)
  );

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setValue("image", file, { shouldValidate: true, shouldDirty: true });
  };

  const submitProduct = (form: ProductCreateFormValues) => {
    if (isPending) return;
    void onCreate({ ...form, price: Number(form.price), quantity: Number(form.quantity), category: Number(form.category), subcategory: Number(form.subcategory) });
  };

  return (
    <Dialog
        open
        onOpenChange={(open) => {
          if (!open && !isPending) onClose();
        }}
      >
      <DialogContent
        dir="rtl"
        className="sm:max-w-2xl max-h-[90dvh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>افزودن کالای جدید</DialogTitle>
          <DialogDescription>
            اطلاعات کالا و تصویر آن را وارد کنید.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(submitProduct)}
          className="flex flex-col gap-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="create-product-name">نام کالا</Label>
              <Input
                id="create-product-name"
                {...register("name")}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="create-product-brand">برند</Label>
              <Input
                id="create-product-brand"
                {...register("brand")}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="create-product-price">قیمت</Label>
              <Input
                id="create-product-price"
                type="number"
                min="0"
                step="1"
                {...register("price")}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="create-product-quantity">موجودی</Label>
              <Input
                id="create-product-quantity"
                type="number"
                min="0"
                step="1"
                {...register("quantity")}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="create-product-category">دسته‌بندی</Label>
              <select
                id="create-product-category"
                value={category}
                onChange={(event) => { setValue("category", event.target.value, { shouldValidate: true }); setValue("subcategory", "", { shouldValidate: true }); }}
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
              <Label htmlFor="create-product-subcategory">زیردسته</Label>
              <select
                id="create-product-subcategory"
                {...register("subcategory")}
                disabled={!category}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              >
                <option value="">انتخاب زیردسته</option>
                {availableSubcategories.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="create-product-description">توضیحات</Label>
            <textarea
              id="create-product-description"
              rows={4}
              {...register("description")}
              className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border border-dashed border-input bg-muted">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="پیش‌نمایش تصویر کالا"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm text-muted-foreground">
                  بدون تصویر
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="create-product-image">تصویر کالا</Label>
              <Input
                id="create-product-image"
                type="file"
                accept="image/jpeg"
                onChange={handleImageChange}
              />
              <span className="text-xs text-muted-foreground">
                تصویر به‌صورت محلی ذخیره می‌شود. فرمت JPG و حجم کمتر از ۲ مگابایت
              </span>
              {errors.image && <p role="alert" className="text-sm text-destructive">{errors.image.message}</p>}
            </div>
          </div>

          {errorMessage && (
            <p role="alert" className="text-sm text-destructive">
              {errorMessage}
            </p>
          )}
          {Object.values(errors).map((fieldError, index) => fieldError?.message && (
            <p key={index} role="alert" className="text-sm text-destructive">{fieldError.message}</p>
          ))}

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
              {isPending ? "در حال ثبت..." : "ثبت کالا"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
