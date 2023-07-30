import { ApiDfbAuthor, dfbApi, axiosApi } from "@/http-common";
import {
  CategoryInfos,
  ClubBookInfos,
  CreateMemberRequest,
  CreateOrderDraftOptions,
  DraftOrderInfos,
  GetClubBookIdsOptions,
  MemberInfos,
  OrderInfos,
  UpdateMemberRequest,
  getOrderIdsOptions,
} from "./types";

export async function getOrderIds(data?: getOrderIdsOptions): Promise<number[]> {
  try {
    const response = await ApiDfbAuthor.post(`/order/get_ids`, data);
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
  if (!orderIds.length) return [];
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

export async function getAllMembers(): Promise<MemberInfos[]> {
  try {
    const memberIds = await getMemberIds();
    const memberInfos = await getMemberInfos(memberIds);
    return memberInfos;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "An error occurred while creating the member.";
    throw new Error(errorMessage);
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
  } catch (error: any) {
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
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "An error occurred while update the member.";
    throw new Error(errorMessage);
  }
}

async function getClubBookIds(options: GetClubBookIdsOptions): Promise<number[]> {
  try {
    const { clubs } = options;
    const data: any = {};
    if (clubs) {
      data["club_ids"] = clubs.map((c) => c.id).join(",");
    }
    const response = await dfbApi.post(`/club_book/get_ids`, data);
    if (response.data.club_book_ids !== undefined) {
      return response.data.club_book_ids;
    } else {
      throw new Error(response.data.error);
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "An error occurred";
    throw new Error(errorMessage);
  }
}

async function getClubBookInfos(clubBookIds: number[]): Promise<ClubBookInfos[]> {
  if (!clubBookIds.length) {
    return [];
  }
  const data = {
    club_book_ids: clubBookIds.join(","),
  };
  try {
    const response = await dfbApi.post(`/club_book/get_infos`, data);
    if (response.data.club_book_infos !== undefined) {
      return response.data.club_book_infos;
    } else {
      throw new Error(response.data.error);
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "An error occurred while get books";
    throw new Error(errorMessage);
  }
}

async function createBook(data: any): Promise<string> {
  try {
    const response = await ApiDfbAuthor.post(`/club_book/add`, data);
    if (response.data.result) {
      return response.data.result;
    } else {
      throw new Error(response.data.error);
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "An error occurred while add books";
    throw new Error(errorMessage);
  }
}

async function getCategoryList(): Promise<CategoryInfos[]> {
  try {
    const response = await axiosApi.get(`/category/list/dfb`);
    if (response.data.result) {
      return response.data.result;
    } else {
      throw new Error(response.data.error);
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "An error occurred";
    throw new Error(errorMessage);
  }
}

async function createOrder(data: any): Promise<string> {
  try {
    const response = await ApiDfbAuthor.post(`/order/create`, data);
    if (response.data.message) {
      return response.data.message;
    } else {
      throw new Error(response.data.error);
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "An error occurred";
    throw new Error(errorMessage);
  }
}

async function createOrderNewMember(data: any): Promise<string> {
  try {
    const response = await ApiDfbAuthor.post(`/order/create/new_member`, data);
    if (response.data.message) {
      return response.data.message;
    } else {
      throw new Error(response.data.error);
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "An error occurred";
    throw new Error(errorMessage);
  }
}

async function returnBooks(data: any): Promise<string> {
  try {
    const response = await ApiDfbAuthor.post(`/order/return_books`, data);
    if (response.data.message) {
      return response.data.message;
    } else {
      throw new Error(response.data.error);
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "An error occurred";
    throw new Error(errorMessage);
  }
}

async function createDraftOrder(data: CreateOrderDraftOptions): Promise<string> {
  try {
    const response = await ApiDfbAuthor.post(`/order/draft/create`, data);
    if (response.data.message) {
      return response.data.message;
    } else {
      throw new Error(response.data.error);
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "An error occurred";
    throw new Error(errorMessage);
  }
}

async function getDraftOrderIds(): Promise<number[]> {
  try {
    const response = await ApiDfbAuthor.post(`/order/draft/get_ids`);
    if (response.data.draft_order_ids) {
      return response.data.draft_order_ids;
    } else {
      throw new Error(response.data.error);
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "An error occurred";
    throw new Error(errorMessage);
  }
}

async function getDraftOrderInfos(draftOrderIds: number[]): Promise<DraftOrderInfos[]> {
  if (!draftOrderIds.length) {
    return [];
  }
  const data = {
    draft_order_ids: draftOrderIds.join(","),
  };
  try {
    const response = await ApiDfbAuthor.post(`/order/draft/get_infos`, data);
    if (response.data.draft_order_infos) {
      return response.data.draft_order_infos;
    } else {
      throw new Error(response.data.error);
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "An error occurred";
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
  getClubBookInfos,
  getClubBookIds,
  createBook,
  getCategoryList,
  getAllMembers,
  createOrder,
  createOrderNewMember,
  returnBooks,
  createDraftOrder,
  getDraftOrderIds,
  getDraftOrderInfos,
};

export default dfbServices;
