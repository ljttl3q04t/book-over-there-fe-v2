import { ClubBookInfos } from "@/services/types";

export type OnlineOrderTableRow = {
  id: number;
  fullName: string;
  phoneNumber: string;
  address: string;
  books: ClubBookInfos[];
  orderDate: string;
  dueDate: string;
  draftStatus: string;
  member: any;
};
