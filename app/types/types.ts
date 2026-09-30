export type NavigationSection = {
  title: string;
  href: string;
};


export interface Product {
  id: number;
  name: string;
  brand: string;
  image: string[];
  thumbnail: string;
  price: number;
  quantity: number;
  createdAt: number;
  category: number;
  subcategory: number;
  description: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
}

export interface SubCategory {
  id: number;
  name: string;
  category: number;
}

export interface ProductResponse {
  data: Product[];
  pages: number;
  first: number;
  prev: number | null;
  next: number | null;
  last: number;
}

export interface OrderProduct {
  id: number;
  name: string;
  count: string;
  price: string;
  image: string;
}

export interface Order {
  id: number;
  username: string;
  lastname: string;
  address: string;
  phone: string;
  expectAt: number;
  products: OrderProduct[];
  prices: number;
  delivered: "true" | "false";
  paymentStatus?: "pending" | "paid" | "failed";
  createdAt: number;
}

export type ProductCommentStatus = "pending" | "approved" | "rejected";

export interface ProductComment {
  id: number;
  productId: number;
  name: string;
  body: string;
  rating: number;
  status: ProductCommentStatus;
  createdAt: number;
}

export interface OrderResponse {
  data: Order[];
  pages: number;
  first: number;
  prev: number | null;
  next: number | null;
  last: number;
}
