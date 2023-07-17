import { ApiDfbAuthor, dfbApi } from "@/http-common";
import { CreateMemberRequest, MemberInfos, OrderInfos, UpdateMemberRequest } from "./types";

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
      order_detail_ids: orderDetailIds.join(","),
    };
    const response = await dfbApi.post(`/order_detail/get_infos`, data);
    const { order_detail_infos } = response.data;
    return order_detail_infos;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export async function getMemberIds(): Promise<number[]> {
  try {
    const response = await ApiDfbAuthor.post(`/member/get_ids`);
    const { member_ids } = response.data;
    return member_ids;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export async function getMemberInfos(memberIds: number[]): Promise<MemberInfos[]> {
  try {
    const data = {
      member_ids: memberIds.join(","),
    };
    const response = await ApiDfbAuthor.post(`/member/get_infos`, data);
    const { member_infos } = response.data;
    return member_infos;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export async function createMember(member: CreateMemberRequest): Promise<string> {
  try {
    const response = await ApiDfbAuthor.post(`/member/add`, member);
    if (response.data.message) {
      return response.data.message;
    } else {
      throw new Error(response.data.error);
    }
  } catch (error) {
    const errorMessage = error.response?.data?.error || "An error occurred while creating the member.";
    throw new Error(errorMessage);
  }
}

export async function updateMember(member: UpdateMemberRequest): Promise<string> {
  try {
    const response = await ApiDfbAuthor.post(`/member/update`, member);
    if (response.data.message) {
      return response.data.message;
    } else {
      throw new Error(response.data.error);
    }
  } catch (error) {
    const errorMessage = error.response?.data?.error || "An error occurred while creating the member.";
    throw new Error(errorMessage);
  }
}

const dfbServices = {
  getOrderIds,
  getOrderInfos,
  getOrderDetailIds,
  getOrderDetailInfos,
  getMemberIds,
  getMemberInfos,
  createMember,
  updateMember,
};

export default dfbServices;
