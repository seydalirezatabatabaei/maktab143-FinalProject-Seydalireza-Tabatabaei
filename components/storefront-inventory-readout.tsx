import type { Product } from "@/app/types/types";

export default function StorefrontInventoryReadout({
  products,
}: {
  products: Pick<Product, "quantity">[];
}) {
  const available = products.filter((product) => product.quantity > 0).length;
  const lowStock = products.filter(
    (product) => product.quantity > 0 && product.quantity < 5
  ).length;

  const metrics = [
    { label: "کالا در فهرست", value: products.length },
    { label: "قابل سفارش", value: available },
    { label: "موجودی کمتر از ۵", value: lowStock },
  ];

  return (
    <section
      aria-label="خلاصه موجودی محصولات"
      className="storefront-readout mx-auto grid max-w-7xl grid-cols-1 gap-px border-y border-border bg-border sm:grid-cols-3"
    >
      {metrics.map(({ label, value }) => (
        <div key={label} className="inventory-readout min-h-16 border-0 px-5 py-4">
          <span>{label}</span>
          <span className="inventory-readout__value text-lg">
            {value.toLocaleString("fa-IR")}
          </span>
        </div>
      ))}
    </section>
  );
}
