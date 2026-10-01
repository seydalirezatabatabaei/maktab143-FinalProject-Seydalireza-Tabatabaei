import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Laptop, Smartphone } from "lucide-react";

export default function StorefrontHero() {
  return (
    <section className="storefront-hero" aria-labelledby="storefront-hero-title">
      <div className="storefront-hero__copy">
        <p className="storefront-hero__eyebrow">
          <span aria-hidden="true"><Check size={14} /></span>
          فروشگاه کالای دیجیتال
        </p>
        <h1 id="storefront-hero-title">
          ابزارهای خوب،<br />
          <span>برای کارهای بزرگ‌تر</span>
        </h1>
        <p className="storefront-hero__description">
          از لپ‌تاپ تا موبایل، ابزارهای دیجیتال موردنیازت را یک‌جا پیدا کن و با خیال راحت انتخاب کن.
        </p>
        <Link href="/application/products" className="storefront-hero__button">
          مشاهده محصولات <ArrowLeft size={17} aria-hidden="true" />
        </Link>
        <div className="storefront-hero__categories" aria-label="دسته‌های محصولات">
          <span><Laptop size={16} aria-hidden="true" /> لپ‌تاپ</span>
          <span><Smartphone size={16} aria-hidden="true" /> موبایل</span>
        </div>
      </div>

      <div className="storefront-hero__visual" aria-label="تصاویر لپ‌تاپ و موبایل">
        <div className="storefront-hero__shape storefront-hero__shape--back" />
        <div className="storefront-hero__shape storefront-hero__shape--front" />
        <figure className="storefront-hero__laptop">
          <Image
            src="/ImageProduct/lab4.jpg"
            alt="لپ‌تاپ روی میز چوبی"
            fill
            priority
            sizes="(max-width: 768px) 82vw, 520px"
          />
        </figure>
        <figure className="storefront-hero__phone">
          <Image
            src="/ImageProduct/phone.jpg"
            alt="گوشی هوشمند در دست"
            fill
            priority
            sizes="(max-width: 768px) 24vw, 160px"
          />
        </figure>
      </div>
    </section>
  );
}
