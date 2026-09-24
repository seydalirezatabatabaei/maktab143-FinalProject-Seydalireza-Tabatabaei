"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  getCategories,
  getProducts,
  getSubCategories,
} from "@/Api/ProductsApi";
import { Category, Product } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/product-card";
import { AccordionLoader } from "@/components/accordion-loader";
import { Separator } from "@/components/ui/separator";

const LIMIT = 12;

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: subCategories } = useQuery({
    queryKey: ["subcategories"],
    queryFn: getSubCategories,
  });

  const { data: productsData, isLoading, isFetching } = useQuery({
    queryKey: ["products-list", page, LIMIT, selectedCategory, selectedSubcategory, search],
    queryFn: () =>
      getProducts({
        page,
        limit: LIMIT,
        category: selectedCategory,
        subcategory: selectedSubcategory,
        search: search || undefined,
      }),
  });

  const products: Product[] = productsData?.data ?? [];
  const totalPages = productsData?.pages ?? 1;

  const availableSubcategories = useMemo(
    () => (subCategories ?? []).filter((s) => s.category === selectedCategory),
    [subCategories, selectedCategory]
  );

  const handleCategorySelect = (id: number | undefined) => {
    setSelectedCategory(id);
    setSelectedSubcategory(undefined);
    setPage(1);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <AccordionLoader />
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}

          <aside className="w-full lg:w-64 lg:shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Search */}

              <div>
                <h3 className="mb-2 text-sm font-semibold">جستجو</h3>
                <Input
                  placeholder="نام کالا..."
                  value={search}
                  onChange={(event) => handleSearch(event.target.value)}
                />
              </div>

              <Separator />

              {/* Categories */}

              <div>
                <h3 className="mb-2 text-sm font-semibold">دسته‌بندی</h3>
                <div className="flex flex-col gap-1">
                  <Button
                    variant={selectedCategory === undefined ? "default" : "ghost"}
                    className="justify-start"
                    onClick={() => handleCategorySelect(undefined)}
                  >
                    همه
                  </Button>
                  {categories?.map((category: Category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "ghost"}
                      className="justify-start"
                      onClick={() => handleCategorySelect(category.id)}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Subcategories */}

              {selectedCategory && availableSubcategories.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold">زیردسته</h3>
                  <div className="flex flex-col gap-1">
                    {availableSubcategories.map((sub) => (
                      <Button
                        key={sub.id}
                        variant={selectedSubcategory === sub.id ? "default" : "ghost"}
                        className="justify-start text-xs"
                        onClick={() => {
                          setSelectedSubcategory(sub.id);
                          setPage(1);
                        }}
                      >
                        {sub.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Main */}

          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold">محصولات</h1>
              <span className="text-sm text-muted-foreground">
                {products.length} محصول
              </span>
            </div>

            {isFetching && (
              <div className="mb-3 text-sm text-blue-500">
                در حال بارگذاری...
              </div>
            )}

            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-muted-foreground">محصولی یافت نشد</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSelectedCategory(undefined);
                    setSelectedSubcategory(undefined);
                    setSearch("");
                  }}
                >
                  پاک کردن فیلترها
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {products.map((product: Product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={(p) =>
                      (window.location.href = `/application/products/${p.id}`)
                    }
                  />
                ))}
              </div>
            )}

            {/* Pagination */}

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        قبلی
      </Button>
      {pages.map((p) => (
        <Button
          key={p}
          variant={p === page ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(p)}
        >
          {p}
        </Button>
      ))}
      <Button
        variant="outline"
        size="sm"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        بعدی
      </Button>
    </div>
  );
}

