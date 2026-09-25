"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

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

type ProductCreateForm = {
  name: string;
  brand: string;
  price: string;
  quantity: string;
  category: number | "";
  subcategory: number | "";
  description: string;
  image: File | null;
  previewUrl: string;
};

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
  const formRef = useRef<HTMLFormElement>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [form, setForm] = useState<ProductCreateForm>({
    name: "",
    brand: "",
    price: "",
    quantity: "",
    category: "",
    subcategory: "",
    description: "",
    image: null,
    previewUrl: "",
  });

  useEffect(() => {
    return () => {
      if (form.previewUrl) {
        URL.revokeObjectURL(form.previewUrl);
      }
    };
  }, [form.previewUrl]);

  const availableSubcategories = subcategories.filter(
    (subcategory) => subcategory.category === form.category
  );

  const updateForm = (field: keyof ProductCreateForm, value: string) => {
    setForm((current) => {
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

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.type !== "image/jpeg") {
      setImageError("فقط تصویر با فرمت JPG مجاز است");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setImageError("اندازه تصویر باید کمتر از ۲ مگابایت باشد");
      event.target.value = "";
      return;
    }

    setForm((current) => ({
      ...current,
      image: file,
      previewUrl: URL.createObjectURL(file),
    }));
    setImageError(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isPending || !form.image || !formRef.current?.reportValidity()) return;

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

    void onCreate({
      name: form.name.trim(),
      brand: form.brand.trim(),
      image: form.image,
      price,
      quantity,
      category: form.category,
      subcategory: form.subcategory,
      description: form.description,
    });
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
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="create-product-name">نام کالا</Label>
              <Input
                id="create-product-name"
                value={form.name}
                onChange={(event) =>
                  updateForm("name", event.target.value)
                }
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="create-product-brand">برند</Label>
              <Input
                id="create-product-brand"
                value={form.brand}
                onChange={(event) =>
                  updateForm("brand", event.target.value)
                }
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="create-product-price">قیمت</Label>
              <Input
                id="create-product-price"
                type="number"
                min="0"
                step="1"
                value={form.price}
                onChange={(event) =>
                  updateForm("price", event.target.value)
                }
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="create-product-quantity">موجودی</Label>
              <Input
                id="create-product-quantity"
                type="number"
                min="0"
                step="1"
                value={form.quantity}
                onChange={(event) =>
                  updateForm("quantity", event.target.value)
                }
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="create-product-category">دسته‌بندی</Label>
              <select
                id="create-product-category"
                value={form.category}
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
              <Label htmlFor="create-product-subcategory">زیردسته</Label>
              <select
                id="create-product-subcategory"
                value={form.subcategory}
                onChange={(event) =>
                  updateForm("subcategory", event.target.value)
                }
                required
                disabled={!form.category}
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
              value={form.description}
              onChange={(event) =>
                updateForm("description", event.target.value)
              }
              className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border border-dashed border-input bg-muted">
              {form.previewUrl ? (
                <img
                  src={form.previewUrl}
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
                required
              />
              <span className="text-xs text-muted-foreground">
                تصویر به‌صورت محلی ذخیره می‌شود. فرمت JPG و حجم کمتر از ۲ مگابایت
              </span>
              {imageError && (
                <p role="alert" className="text-sm text-destructive">
                  {imageError}
                </p>
              )}
            </div>
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
              {isPending ? "در حال ثبت..." : "ثبت کالا"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}