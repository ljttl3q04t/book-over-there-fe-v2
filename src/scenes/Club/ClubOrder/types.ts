export type DataType = {
  orderId: number;
  orderDetailId: number;
  bookName: string;
  bookCode: string;
  memberFullName: string;
  memberCode: string;
  memberPhoneNumber: string;
  orderStatus: string;
  orderDate: string;
  returnDate: string;
  overdueDay: number;
  dueDate: string;
};

export const ORDER_STATUS_LIST = ["created", "complete", "overdue"];
