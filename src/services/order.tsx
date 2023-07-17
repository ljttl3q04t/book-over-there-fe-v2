import { ApiDfbAuthor, dfbApi } from "@/http-common";
import { OrderInfos } from "./types";

export async function getOrderIds(): Promise<number[]> {
  try {
    const response = await ApiDfbAuthor.post(`/order/get_ids`);
    const { order_ids } = response.data;
    return order_ids;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export async function getOrderDetailIds(): Promise<number[]> {
  try {
    const response = await dfbApi.post(`/order_detail/get_ids`);
    const { order_detail_ids } = response.data;
    return order_detail_ids;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export async function getOrderInfos(orderIds: number[]): Promise<OrderInfos[]> {
  try {
    const data = {
      order_ids: orderIds.join(","),
    };
    const response = await ApiDfbAuthor.post(`/order/get_infos`, data);
    const { order_infos } = response.data;
    return order_infos;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export async function getOrderDetailInfos(orderDetailIds: number[]): Promise<number[]> {
  try {
    const data = {
      order_detail_ids: orderDetailIds,
    };
    const response = await dfbApi.post(`/order_detail/get_infos`, data);
    const { order_detail_infos } = response.data;
    return order_detail_infos;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

const orderServices = {
  getOrderIds,
  getOrderInfos,
  getOrderDetailIds,
  getOrderDetailInfos,
};

export default orderServices;
