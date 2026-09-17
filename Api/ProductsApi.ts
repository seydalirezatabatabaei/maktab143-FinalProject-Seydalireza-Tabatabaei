import api from "./axios";
import {
  Category,
  SubCategory,
  Product,
} from "@/app/types/types";

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