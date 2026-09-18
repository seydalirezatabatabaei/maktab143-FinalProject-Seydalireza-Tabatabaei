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