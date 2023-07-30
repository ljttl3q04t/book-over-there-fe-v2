import { ClubBookInfos } from "@/services/types";

export type OnlineOrderTableRow = {
  fullName: string;
  phoneNumber: string;
  address: string;
  books: ClubBookInfos[];
  orderDate: string;
  dueDate: string;
};
