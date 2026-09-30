"use client";

import { getProductImageSrc } from "@/Api/ProductsApi";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import { useCart } from "@/app/store/cart-context";

interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const imageSrc = getProductImageSrc(product.image);
  const { addItem } = useCart();

  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1"
      onClick={() => onClick?.(product)}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={imageSrc}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <CardContent className="p-3">
        <h3 className="line-clamp-2 text-sm font-medium leading-tight">
          {product.name}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">{product.brand}</p>
        <p className="mt-2 text-sm font-bold text-primary">
          {product.price.toLocaleString("fa-IR")} تومان
        </p>
        <Button className="mt-3 w-full" size="sm" disabled={product.quantity < 1}
          onClick={(event) => { event.stopPropagation(); addItem(product); }}>
          {product.quantity < 1 ? "ناموجود" : "افزودن به سبد"}
        </Button>
      </CardContent>
    </Card>
  );
}
