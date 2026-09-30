import api from "./axios";
import { Order } from "@/app/types/types";

export const getOrders = async ({
  page,
  limit,
  delivered,
}: {
  page: number;
  limit: number;
  delivered?: "true" | "false";
}) => {
  const response = await api.get<Order[]>("/orders", {
    params: {
      _page: page,
      _limit: limit,
      ...(delivered && { delivered }),
    },
  });

  const totalCount = Number(response.headers["x-total-count"] || 0);

  return {
    data: response.data,
    pages: Math.ceil(totalCount / limit),
  };
};

export type CreateOrderInput = Omit<Order, "id" | "createdAt" | "paymentStatus">;

export const createOrder = async (order: CreateOrderInput): Promise<Order> => {
  const response = await api.post<Order>("/orders", {
    ...order,
    paymentStatus: "pending",
  });
  return response.data;
};

export const getOrder = async (id: number): Promise<Order> => {
  const response = await api.get<Order>(`/orders/${id}`);
  return response.data;
};

export const updateOrderPaymentStatus = async (
  id: number,
  paymentStatus: NonNullable<Order["paymentStatus"]>
): Promise<Order> => {
  const response = await api.patch<Order>(`/orders/${id}`, { paymentStatus });
  return response.data;
};
