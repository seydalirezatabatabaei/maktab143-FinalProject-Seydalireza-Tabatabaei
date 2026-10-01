"use client";

import type { Product } from "@/app/types/types";
import { useCart } from "@/app/store/cart-context";
import { ProductRevealCard } from "@/components/ui/product-reveal-card";

interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <ProductRevealCard
      product={product}
      onAdd={() => addItem(product)}
      onViewDetails={onClick ? () => onClick(product) : undefined}
    />
  );
}
