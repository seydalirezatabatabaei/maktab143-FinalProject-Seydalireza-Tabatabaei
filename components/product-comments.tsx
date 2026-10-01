"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageCircle, Send, Star } from "lucide-react";
import { createProductComment, getProductComments } from "@/Api/ProductsApi";
import { Button } from "@/components/ui/button";
import { productCommentSchema, type ProductCommentFormValues } from "@/lib/form-schemas";

export default function ProductComments({ productId }: { productId: number }) {
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<ProductCommentFormValues>({ resolver: zodResolver(productCommentSchema), defaultValues: { name: "", body: "", rating: 5 } });
  const rating = watch("rating");
  const [feedback, setFeedback] = useState("");
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading, isError } = useQuery({
    queryKey: ["product-comments", productId],
    queryFn: () => getProductComments(productId),
  });

  const submitMutation = useMutation({
    mutationFn: createProductComment,
    onSuccess: async () => {
      reset({ name: watch("name"), body: "", rating: 5 });
      setFeedback("دیدگاه شما برای بررسی و انتشار ارسال شد.");
      await queryClient.invalidateQueries({ queryKey: ["product-comments", productId] });
    },
    onError: () => setFeedback("ارسال دیدگاه انجام نشد. اتصال به سرور را بررسی کنید."),
  });

  const submitComment = (values: ProductCommentFormValues) => {
    setFeedback("");
    submitMutation.mutate({ productId, ...values });
  };

  const averageRating = comments.length
    ? comments.reduce((sum, comment) => sum + comment.rating, 0) / comments.length
    : 0;

  return (
    <section dir="rtl" aria-labelledby="product-comments-title" className="mt-14 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
      <div className="rounded-[2rem] border border-white/80 bg-white/55 p-5 shadow-[0_20px_55px_rgba(57,47,90,0.07)] backdrop-blur-xl sm:p-7">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-1 flex items-center gap-2 text-xs font-semibold text-[#b85c00]"><MessageCircle size={15} /> تجربه‌ی خریداران</p>
            <h2 id="product-comments-title" className="text-xl font-bold text-[#392f5a] sm:text-2xl">دیدگاه‌ها</h2>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-[#f4d06f]/35 px-3 py-1.5 text-sm font-semibold text-[#392f5a]">
            <Star size={16} className="fill-[#ff8811] text-[#ff8811]" />
            {comments.length ? averageRating.toLocaleString("fa-IR", { maximumFractionDigits: 1 }) : "—"}
            <span className="text-xs font-normal text-muted-foreground">({comments.length} نظر)</span>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3" aria-label="در حال دریافت دیدگاه‌ها">
            {[0, 1].map((item) => <div key={item} className="h-24 animate-pulse rounded-2xl bg-[#9dd9d2]/25" />)}
          </div>
        ) : isError ? (
          <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">دریافت دیدگاه‌ها با خطا روبه‌رو شد.</p>
        ) : comments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#9dd9d2] bg-[#9dd9d2]/15 p-8 text-center">
            <MessageCircle className="mx-auto mb-3 text-[#438f88]" size={27} />
            <p className="font-semibold text-[#392f5a]">هنوز دیدگاهی برای این محصول ثبت نشده</p>
            <p className="mt-1 text-sm text-muted-foreground">اولین نفری باشید که تجربه‌اش را به اشتراک می‌گذارد.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {comments.map((comment) => (
              <li key={comment.id} className="rounded-2xl border border-[#392f5a]/8 bg-white/65 p-4 transition-colors hover:bg-white/90">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[#392f5a]">{comment.name}</p>
                    <time className="mt-1 block text-xs text-muted-foreground" dateTime={new Date(comment.createdAt).toISOString()}>
                      {new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", day: "numeric" }).format(new Date(comment.createdAt))}
                    </time>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#f4d06f]/30 px-2.5 py-1 text-xs font-semibold text-[#392f5a]">
                    {comment.rating} <Star size={13} className="fill-[#ff8811] text-[#ff8811]" />
                  </span>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">{comment.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={handleSubmit(submitComment)} className="h-fit rounded-[2rem] border border-white/80 bg-gradient-to-br from-[#fff8f0]/95 to-[#9dd9d2]/30 p-5 shadow-[0_20px_55px_rgba(57,47,90,0.07)] backdrop-blur-xl sm:p-7">
        <p className="mb-1 text-xs font-semibold text-[#b85c00]">نظر شما ارزشمند است</p>
        <h3 className="text-xl font-bold text-[#392f5a]">دیدگاهت را بنویس</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">پس از بررسی مدیر، دیدگاه شما در صفحه نمایش داده می‌شود.</p>

        <label className="mt-5 block text-sm font-medium text-[#392f5a]">
          نام شما
          <input maxLength={60} {...register("name")} className="mt-2 w-full rounded-xl border border-[#392f5a]/15 bg-white/75 px-4 py-3 outline-none focus:border-[#ff8811]" placeholder="نام خود را وارد کنید" />
          {errors.name && <span role="alert" className="mt-1 block text-xs text-destructive">{errors.name.message}</span>}
        </label>

        <fieldset className="mt-4">
          <legend className="text-sm font-medium text-[#392f5a]">امتیاز شما</legend>
          <div className="mt-2 flex gap-1" role="radiogroup" aria-label="امتیاز محصول">
            {[1, 2, 3, 4, 5].map((value) => (
              <button key={value} type="button" role="radio" aria-checked={rating === value} aria-label={`${value} از ۵`} onClick={() => setValue("rating", value, { shouldValidate: true, shouldDirty: true })} className="rounded-md p-1 text-[#ff8811] transition-transform hover:scale-125">
                <Star size={23} className={value <= rating ? "fill-current" : "text-[#392f5a]/20"} />
              </button>
            ))}
          </div>
        </fieldset>

        <label className="mt-4 block text-sm font-medium text-[#392f5a]">
          دیدگاه
          <textarea maxLength={1000} rows={4} {...register("body")} className="mt-2 w-full resize-y rounded-xl border border-[#392f5a]/15 bg-white/75 px-4 py-3 outline-none focus:border-[#ff8811]" placeholder="تجربه‌تان از این محصول را بنویسید..." />
          {errors.body && <span role="alert" className="mt-1 block text-xs text-destructive">{errors.body.message}</span>}
        </label>
        {feedback && <p role="status" className={`mt-3 text-sm ${submitMutation.isError ? "text-red-700" : "text-[#326d68]"}`}>{feedback}</p>}
        <Button type="submit" disabled={submitMutation.isPending} className="mt-4 w-full gap-2 rounded-xl bg-[#392f5a] text-[#fff8f0] hover:bg-[#ff8811]">
          <Send size={16} />
          {submitMutation.isPending ? "در حال ارسال..." : "ارسال برای بررسی"}
        </Button>
      </form>
    </section>
  );
}
