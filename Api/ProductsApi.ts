import api from "./axios";

import {
  Category,
  SubCategory,
  Product,
  ProductResponse,
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
}): Promise<ProductResponse> => {
  const response = await api.get("/products", {
    params: {
      _page: page,
      _per_page: limit,

      ...(category && {
        category,
      }),

      ...(subcategory && {
        subcategory,
      }),

      ...(search && {
        name: search,
      }),
    },
  });

  return response.data;
};

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get("/category");

  return response.data;
};

export const getSubCategories = async (): Promise<SubCategory[]> => {
  const response = await api.get("/subcategory");

  return response.data;
};


// ---------------------------------------------
// Update Product
// ---------------------------------------------

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