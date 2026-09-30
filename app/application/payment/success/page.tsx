import PaymentResult from "@/components/payment-result";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;
  const id = Number(orderId);

  if (!orderId || !Number.isInteger(id) || id < 1) {
    return <main dir="rtl" className="mx-auto max-w-xl px-4 py-16 text-center">شناسه‌ی سفارش معتبر نیست.</main>;
  }

  return <PaymentResult orderId={id} result="success" />;
}
