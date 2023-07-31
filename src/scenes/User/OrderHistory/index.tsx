import dfbServices from "@/services/dfb";
import * as React from "react";
import { OrderHistoryTable } from "./OrderHistoryTable";
import { notification } from "antd";
import { DataType } from "./types";
import { OrderInfos } from "@/services/types";

const UserOrderHistory = () => {
  const [loading, setLoading] = React.useState(false);
  const [tableData, setTableData] = React.useState<DataType[]>([]);

  const initFetch = async () => {
    try {
      setLoading(true);
      const orderInfos: OrderInfos[] = await dfbServices.getUserOrderHistory();
      const data: DataType[] = [];
      for (const order of orderInfos) {
        for (const orderDetail of order.order_details) {
          data.push({
            orderId: order.id,
            orderDetailId: orderDetail.id,
            bookName: orderDetail.book_name,
            bookCode: orderDetail.book_code,
            memberFullName: order.member.full_name,
            memberCode: order.member.code,
            memberPhoneNumber: order.member.phone_number,
            orderStatus: orderDetail.order_status,
            orderDate: order.order_date,
            returnDate: orderDetail.return_date,
            overdueDay: orderDetail.overdue_day_count ?? 0,
            dueDate: order.due_date,
          });
        }
      }
      const sortedData = [...data].sort((a, b) => {
        const dateComparison = new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
        if (dateComparison === 0) {
          return b.orderDetailId - a.orderDetailId;
        }
        return dateComparison;
      });
      setTableData(sortedData);
    } catch (err: any) {
      notification.error({ message: err.message });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    initFetch();
  }, []);

  return (
    <>
      <OrderHistoryTable tableData={tableData} tableLoading={loading} />
    </>
  );
};

export default UserOrderHistory;
