"use client";

import type { KeyboardEvent, MouseEvent } from "react";
import { ArrowUpLeft, Eye, ShoppingCart } from "lucide-react";

import { getProductImageSrc } from "@/Api/ProductsApi";
import type { Product } from "@/app/types/types";
import LowStockNotice from "@/components/low-stock-notice";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductRevealCardProps {
  product: Product;
  onAdd: () => void;
  onViewDetails?: () => void;
  className?: string;
}

export function ProductRevealCard({
  product,
  onAdd,
  onViewDetails,
  className,
}: ProductRevealCardProps) {
  const image = getProductImageSrc(product.image);
  const description = product.description?.trim();

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget || !onViewDetails) return;
    if (event.key === "Enter") {
      event.preventDefault();
      onViewDetails();
    }
  };

  const stopCardClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  };

  return (
    <article
      data-slot="product-reveal-card"
      className={cn("product-reveal-card group", onViewDetails && "product-reveal-card--interactive", className)}
      onClick={onViewDetails}
      onKeyDown={handleKeyDown}
      role={onViewDetails ? "link" : undefined}
      tabIndex={onViewDetails ? 0 : undefined}
      aria-label={onViewDetails ? `مشاهده جزئیات ${product.name}` : undefined}
    >
      <div className="product-reveal-card__image-wrap">
        <img src={image} alt={product.name} className="product-reveal-card__image" loading="lazy" />
        <LowStockNotice quantity={product.quantity} compact />
      </div>

      <div className="product-reveal-card__body">
        <p className="product-reveal-card__brand">{product.brand}</p>
        <h3 className="product-reveal-card__name">{product.name}</h3>
        <p className="product-reveal-card__price">
          {product.price.toLocaleString("fa-IR")} تومان
        </p>
        <div className="inventory-readout product-reveal-card__inventory" aria-label={`تعداد موجودی ${product.quantity}`}>
          <span>موجودی انبار</span>
          <span className="inventory-readout__value">
            {product.quantity > 0 ? `${product.quantity.toLocaleString("fa-IR")} عدد` : "ناموجود"}
          </span>
        </div>
      </div>

      <div className="product-reveal-card__overlay" aria-label={`اطلاعات ${product.name}`}>
        {description && (
          <div className="product-reveal-card__description">
            <h4>توضیحات محصول</h4>
            <p>{description}</p>
          </div>
        )}

        <div className="product-reveal-card__actions">
          <Button
            type="button"
            className="w-full"
            disabled={product.quantity < 1}
            onClick={(event) => {
              stopCardClick(event);
              onAdd();
            }}
          >
            <ShoppingCart size={17} aria-hidden="true" />
            {product.quantity < 1 ? "ناموجود" : "افزودن به سبد"}
          </Button>

          {onViewDetails && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={(event) => {
                stopCardClick(event);
                onViewDetails();
              }}
            >
              <Eye size={17} aria-hidden="true" />
              مشاهده جزئیات
              <ArrowUpLeft size={15} aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
