import PaymentMock from "@/components/payment-mock";

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;
  const parsedId = Number(orderId);

  if (!orderId || !Number.isInteger(parsedId) || parsedId < 1) {
    return (
      <main dir="rtl" className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">سفارش معتبری برای پرداخت پیدا نشد</h1>
        <p className="mt-3 text-muted-foreground">برای شروع پرداخت، ابتدا سفارش خود را ثبت کنید.</p>
      </main>
    );
  }

  return <PaymentMock orderId={parsedId} />;
}
