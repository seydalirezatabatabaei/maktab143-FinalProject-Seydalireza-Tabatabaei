import api from "./axios";
import {
  Category,
  SubCategory,
  Product,
} from "@/app/types/types";

export const API_BASE_URL = api.defaults.baseURL || "http://localhost:3002";

type ProductResponseRow = Omit<Product, "image"> & {
  image: string | string[];
};

const normalizeProduct = (product: ProductResponseRow): Product => ({
  ...product,
  image: Array.isArray(product.image)
    ? product.image
    : product.image
      ? [product.image]
      : [],
});

export const getProductImageSrc = (image: string | string[] | undefined) => {
  const value = Array.isArray(image) ? image[0] : image;

  if (!value) return "/ImageProduct/phone.jpg";
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
  const response = await api.get<Product[]>("/products", {
    params: {
      _page: page,
      _limit: limit,
      ...(category && { category }),
      ...(subcategory && { subcategory }),
      ...(search && { name_like: search }),
    },
  });

  const totalCount = Number(response.headers["x-total-count"] || 0);

  return {
    data: response.data,
    pages: Math.ceil(totalCount / limit),
  };
};

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get("/category");
  return response.data;
};

export const getSubCategories = async (): Promise<SubCategory[]> => {
  const response = await api.get("/subcategory");
  return response.data;
};

export const updateProduct = async ({
  id,
  price,
  quantity,
}: {
  id: number;
  price: number;
  quantity: number;
}): Promise<Product> => {
  const response = await api.patch(`/products/${id}`, {
    price,
    quantity,
  });

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

export const uploadProductImage = async (image: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", image);

  const response = await api.post<{ filename: string }>("/upload", formData);
  const filename = response.data.filename;

  if (!filename) {
    throw new Error("تصویر کالا ذخیره نشد");
  }

  const baseUrl = api.defaults.baseURL || "http://localhost:3002";
  return `${baseUrl}/files/${encodeURIComponent(filename)}`;
};

export const createProduct = async (
  product: ProductCreateInput
): Promise<Product> => {
  const response = await api.post<Product>("/products", product);
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

export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`/products/${id}`);
};
