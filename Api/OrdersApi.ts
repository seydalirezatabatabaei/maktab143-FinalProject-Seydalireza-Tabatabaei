import api from "./axios";

import {
  OrderResponse,
} from "@/app/types/types";

export const getOrders = async ({
  page,
  limit,
  delivered,
}: {
  page: number;
  limit: number;
  delivered: "true" | "false";
}): Promise<OrderResponse> => {
  const response = await api.get("/orders", {
    params: {
      _page: page,
      _per_page: limit,
      delivered,
    },
  });

  return response.data;
};