
import api from "./axios";
import {
  Category,
  SubCategory,
  Product,
} from "@/app/types/types";

export const API_BASE_URL =
  api.defaults.baseURL || process.env.NEXT_PUBLIC_API_BASE_URL;

type ProductResponseRow = Omit<Product, "image"> & {
  image: string | string[];
};

const normalizeProduct = (
  product: ProductResponseRow
): Product => ({
  ...product,
  image: Array.isArray(product.image)
    ? product.image
    : product.image
      ? [product.image]
      : [],
});

export type ProductUpdateInput = {
  id: number;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  category: number;
  subcategory: number;
  description: string;
};

export const getProductImageSrc = (
  image: string | string[] | undefined
) => {
  const value = Array.isArray(image) ? image[0] : image;

  if (!value) {
    return "/ImageProduct/phone.jpg";
  }

  if (value.startsWith("/files/")) {
    return `${API_BASE_URL}${value}`;
  }

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("/")
  ) {
    return value;
  }

  return `/ImageProduct/${value}.jpg`;
};

export const getProducts = async ({
  page,
  limit,
  category,
  subcategory,
  search,
}: {
  page: number;
  limit: number;
  category?: number;
  subcategory?: number;
  search?: string;
}) => {
  const response = await api.get<ProductResponseRow[]>(
    "/products",
    {
      params: {
        _page: page,
        _limit: limit,
        ...(category !== undefined && { category }),
        ...(subcategory !== undefined && { subcategory }),
        ...(search && { name_like: search }),
      },
    }
  );

  const totalCount = Number(
    response.headers["x-total-count"] || 0
  );

  return {
    data: response.data.map(normalizeProduct),
    pages: Math.ceil(totalCount / limit),
  };
};

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get<Category[]>("/category");

  return response.data;
};

export const getSubCategories =
  async (): Promise<SubCategory[]> => {
    const response =
      await api.get<SubCategory[]>("/subcategory");

    return response.data;
  };

export const updateProduct = async ({
  id,
  name,
  brand,
  price,
  quantity,
  category,
  subcategory,
  description,
}: ProductUpdateInput): Promise<Product> => {
  const response = await api.patch<Product>(
    `/products/${id}`,
    {
      name,
      brand,
      price,
      quantity,
      category,
      subcategory,
      description,
    }
  );

  return response.data;
};

export type ProductCreateInput = {
  name: string;
  brand: string;
  image: string;
  thumbnail: string;
  price: number;
  quantity: number;
  category: number;
  subcategory: number;
  description: string;
};

export type ProductCreateFormInput = Omit<
  ProductCreateInput,
  "image" | "thumbnail"
> & {
  image: File;
};

export const uploadProductImage = async (
  image: File
): Promise<string> => {
  const formData = new FormData();

  formData.append("image", image);

  const response = await api.post<{ filename: string }>(
    "/upload",
    formData
  );

  const filename = response.data.filename;

  if (!filename) {
    throw new Error("تصویر کالا ذخیره نشد");
  }

  return `${API_BASE_URL}/files/${encodeURIComponent(
    filename
  )}`;
};

export const createProduct = async (
  product: ProductCreateInput
): Promise<Product> => {
  const response = await api.post<Product>(
    "/products",
    product
  );

  return response.data;
};

export const createProductWithImage = async (
  product: ProductCreateFormInput
): Promise<Product> => {
  const imageUrl = await uploadProductImage(product.image);

  return createProduct({
    ...product,
    image: imageUrl,
    thumbnail: imageUrl,
  });
};

export const deleteProduct = async (
  id: number
): Promise<void> => {
  await api.delete(`/products/${id}`);
};

