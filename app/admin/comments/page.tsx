"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, ExternalLink, MessageCircle, Star, Trash2, X } from "lucide-react";
import { deleteProductComment, getAdminComments, updateProductCommentStatus } from "@/Api/ProductsApi";
import type { ProductComment, ProductCommentStatus } from "@/app/types/types";
import { AccordionLoader } from "@/components/accordion-loader";
import { Button } from "@/components/ui/button";

type CommentFilter = "all" | ProductCommentStatus;
type CommentAction = "approve" | "reject" | "delete";

const filters: { value: CommentFilter; label: string }[] = [
  { value: "all", label: "همه" },
  { value: "pending", label: "در انتظار بررسی" },
  { value: "approved", label: "منتشرشده" },
  { value: "rejected", label: "ردشده" },
];

const statusLabels: Record<ProductCommentStatus, string> = {
  pending: "در انتظار بررسی",
  approved: "منتشرشده",
  rejected: "ردشده",
};

export default function AdminCommentsPage() {
  const [filter, setFilter] = useState<CommentFilter>("all");
  const queryClient = useQueryClient();
  const { data: comments = [], isLoading, isError } = useQuery({
    queryKey: ["admin-comments"],
    queryFn: () => getAdminComments(),
  });

  const actionMutation = useMutation({
    mutationFn: async ({ comment, action }: { comment: ProductComment; action: CommentAction }) => {
      if (action === "delete") return deleteProductComment(comment.id);
      return updateProductCommentStatus(comment.id, action === "approve" ? "approved" : "rejected");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-comments"] });
    },
  });

  const visibleComments = filter === "all"
    ? comments
    : comments.filter((comment) => comment.status === filter);
  const counts = comments.reduce<Record<CommentFilter, number>>((result, comment) => {
    result.all += 1;
    result[comment.status] += 1;
    return result;
  }, { all: 0, pending: 0, approved: 0, rejected: 0 });

  const formatDate = (timestamp: number) => new Intl.DateTimeFormat("fa-IR", {
    year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(new Date(timestamp));

  return (
    <main dir="rtl" className="mx-auto min-h-[70vh] max-w-7xl px-4 py-8 sm:px-6">
      <header className="mb-7 rounded-[2rem] border border-white/80 bg-gradient-to-l from-[#9dd9d2]/45 via-white/70 to-[#f4d06f]/35 p-6 shadow-[0_20px_55px_rgba(57,47,90,0.08)] backdrop-blur-xl sm:p-8">
        <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#b85c00]"><MessageCircle size={17} /> مدیریت محتوا</p>
        <h1 className="text-2xl font-bold text-[#392f5a] sm:text-3xl">مدیریت دیدگاه‌ها</h1>
        <p className="mt-2 text-sm text-muted-foreground">دیدگاه‌ها را بررسی کنید و مشخص کنید کدام‌یک در صفحه‌ی محصول نمایش داده شوند.</p>
      </header>

      <nav aria-label="فیلتر دیدگاه‌ها" className="mb-6 flex flex-wrap gap-2">
        {filters.map(({ value, label }) => (
          <Button key={value} type="button" variant={filter === value ? "default" : "outline"} onClick={() => setFilter(value)} className={filter === value ? "bg-[#392f5a] text-[#fff8f0] hover:bg-[#ff8811]" : "bg-white/60"}>
            {label}<span className="mr-1 rounded-full bg-white/20 px-2 py-0.5 text-xs">{counts[value]}</span>
          </Button>
        ))}
      </nav>

      {isLoading ? (
        <div className="flex min-h-56 items-center justify-center"><AccordionLoader /></div>
      ) : isError ? (
        <p role="alert" className="rounded-2xl bg-red-50 p-5 text-red-700">دریافت دیدگاه‌ها ناموفق بود. دسترسی ادمین و اتصال به سرور را بررسی کنید.</p>
      ) : visibleComments.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#9dd9d2] bg-white/50 p-12 text-center">
          <MessageCircle size={30} className="mx-auto mb-3 text-[#438f88]" />
          <h2 className="font-semibold text-[#392f5a]">دیدگاهی در این بخش نیست</h2>
          <p className="mt-1 text-sm text-muted-foreground">با ثبت نظرهای جدید، موارد نیازمند بررسی اینجا نمایش داده می‌شوند.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleComments.map((comment) => {
            const isBusy = actionMutation.isPending && actionMutation.variables?.comment.id === comment.id;
            return (
              <article key={comment.id} className="rounded-3xl border border-white/80 bg-white/65 p-5 shadow-[0_12px_35px_rgba(57,47,90,0.07)] backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(57,47,90,0.11)] sm:p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-bold text-[#392f5a]">{comment.name}</h2>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${comment.status === "approved" ? "bg-[#9dd9d2]/40 text-[#285d58]" : comment.status === "rejected" ? "bg-[#ff8811]/15 text-[#984d00]" : "bg-[#f4d06f]/35 text-[#62400d]"}`}>
                        {statusLabels[comment.status]}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{formatDate(comment.createdAt)}</p>
                    <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">{comment.body}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 rounded-full bg-[#f4d06f]/30 px-3 py-1.5 text-sm font-semibold text-[#392f5a]">
                    {comment.rating}<Star size={15} className="fill-[#ff8811] text-[#ff8811]" />
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#392f5a]/10 pt-4">
                  <Link href={`/application/products/${comment.productId}`} target="_blank" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#392f5a] transition-colors hover:text-[#b85c00]">
                    مشاهده‌ی محصول #{comment.productId}<ExternalLink size={14} />
                  </Link>
                  <div className="flex flex-wrap gap-2">
                    {comment.status !== "approved" && (
                      <Button type="button" size="sm" disabled={isBusy} onClick={() => actionMutation.mutate({ comment, action: "approve" })} className="bg-[#326d68] text-white hover:bg-[#285d58]">
                        <Check size={15} /> تأیید و انتشار
                      </Button>
                    )}
                    {comment.status !== "rejected" && (
                      <Button type="button" size="sm" variant="outline" disabled={isBusy} onClick={() => actionMutation.mutate({ comment, action: "reject" })} className="border-[#ff8811]/35 text-[#984d00] hover:bg-[#ff8811]/10">
                        <X size={15} /> رد دیدگاه
                      </Button>
                    )}
                    <Button type="button" size="sm" variant="ghost" disabled={isBusy} onClick={() => actionMutation.mutate({ comment, action: "delete" })} className="text-red-700 hover:bg-red-50">
                      <Trash2 size={15} /> حذف
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
      {actionMutation.isError && <p role="alert" className="mt-4 text-sm text-red-700">تغییر دیدگاه ذخیره نشد. دوباره تلاش کنید.</p>}
    </main>
  );
}
