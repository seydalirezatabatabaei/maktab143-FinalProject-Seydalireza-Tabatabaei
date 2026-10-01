import { z } from "zod";

const requiredText = (label: string, min = 2, max = 120) =>
  z.string().trim().min(min, `${label} باید حداقل ${min} کاراکتر باشد.`).max(max, `${label} نمی‌تواند بیشتر از ${max} کاراکتر باشد.`);

export const checkoutSchema = z.object({
  username: requiredText("نام", 2, 70),
  lastname: requiredText("نام خانوادگی", 2, 70),
  phone: z.string().trim().min(1, "شماره تماس را وارد کنید.").refine((value) => {
    const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
    const latin = value
      .replace(/[۰-۹]/g, (digit) => String(persianDigits.indexOf(digit)))
      .replace(/[٠-٩]/g, (digit) => String(arabicDigits.indexOf(digit)))
      .replace(/[\s()-]/g, "");
    return /^(?:(?:\+|00)98|0)?9\d{9}$/.test(latin);
  }, "شماره تماس معتبر وارد کنید."),
  address: requiredText("نشانی", 10, 500),
  expectAt: z.string().min(1, "تاریخ تقریبی تحویل را انتخاب کنید.").refine((value) => {
    const today = new Date();
    const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    return /^\d{4}-\d{2}-\d{2}$/.test(value) && value >= localToday && !Number.isNaN(new Date(`${value}T12:00:00`).getTime());
  }, "تاریخ تحویل باید امروز یا روزهای آینده باشد."),
});

export const productCommentSchema = z.object({
  name: requiredText("نام", 2, 60),
  body: requiredText("دیدگاه", 5, 1000),
  rating: z.number().int("امتیاز معتبر نیست.").min(1, "امتیاز را انتخاب کنید.").max(5, "امتیاز باید بین ۱ تا ۵ باشد."),
});

export const loginSchema = z.object({
  username: z.string().trim().min(1, "نام کاربری را وارد کنید.").max(60, "نام کاربری بیش از حد طولانی است."),
  password: z.string().min(1, "رمز عبور را وارد کنید.").max(128, "رمز عبور بیش از حد طولانی است."),
});

export const productFormSchema = z.object({
  name: requiredText("نام محصول", 2, 120),
  brand: requiredText("برند", 2, 80),
  price: z.string().trim().min(1, "قیمت را وارد کنید.").refine((value) => Number.isFinite(Number(value)) && Number(value) >= 0, "قیمت باید عددی بزرگ‌تر یا مساوی صفر باشد."),
  quantity: z.string().trim().min(1, "موجودی را وارد کنید.").refine((value) => Number.isInteger(Number(value)) && Number(value) >= 0, "موجودی باید عدد صحیح و بزرگ‌تر یا مساوی صفر باشد."),
  category: z.string().min(1, "دسته‌بندی را انتخاب کنید.").refine((value) => Number.isInteger(Number(value)) && Number(value) > 0, "دسته‌بندی معتبر انتخاب کنید."),
  subcategory: z.string().min(1, "زیردسته را انتخاب کنید.").refine((value) => Number.isInteger(Number(value)) && Number(value) > 0, "زیردسته معتبر انتخاب کنید."),
  description: z.string().max(5000, "توضیحات نمی‌تواند بیشتر از ۵۰۰۰ کاراکتر باشد."),
});

const productImageSchema = z.custom<File>(
  (value) => typeof File !== "undefined" && value instanceof File,
  "تصویر محصول را انتخاب کنید."
).refine((file) => file.type === "image/jpeg", "فقط تصویر با فرمت JPG مجاز است.")
  .refine((file) => file.size <= 2 * 1024 * 1024, "حجم تصویر باید کمتر از ۲ مگابایت باشد.");

export const productCreateSchema = productFormSchema.extend({ image: productImageSchema });
export const productEditSchema = productFormSchema.extend({ image: productImageSchema.optional() });

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
export type ProductCommentFormValues = z.infer<typeof productCommentSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type ProductFormValues = z.infer<typeof productFormSchema>;
export type ProductCreateFormValues = z.infer<typeof productCreateSchema>;
export type ProductEditFormValues = z.infer<typeof productEditSchema>;
