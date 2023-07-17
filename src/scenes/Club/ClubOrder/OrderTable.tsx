import React, { useEffect, useState } from "react";
import Table, { ColumnsType } from "antd/es/table";
import orderServices from "@/services/order";
import { OrderInfos } from "@/services/types";
import { Tag } from "antd";

type DataType = {
  orderId: number;
  bookName: string;
  bookCode: string;
  memberFullName: string;
  memberCode: string;
  orderStatus: string;
  orderDate: string;
};

function OrderStatus(orderStatus: string) {
  const STATUS_COLORS: Record<string, string> = {
    Confirmed: "green",
  };
  const color = STATUS_COLORS[orderStatus] ?? "geekblue";
  return (
    <Tag color={color} key={orderStatus}>
      {orderStatus.toUpperCase()}
    </Tag>
  );
}

export function OrderTable() {
  const [loading, setLoading] = useState(false);
  const [orderIds, setOrderIds] = useState<number[]>([]);
  const [tableData, setTableData] = useState<DataType[]>([]);

  const fetchOrderIds = async () => {
    try {
      setLoading(true);
      const _orderIds = await orderServices.getOrderIds();
      setOrderIds(_orderIds);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchOrderInfos = async () => {
    try {
      setLoading(true);
      const orderInfos: OrderInfos[] = await orderServices.getOrderInfos(orderIds);
      const data: DataType[] = [];
      for (const order of orderInfos) {
        for (const orderDetail of order.order_details) {
          data.push({
            orderId: order.id,
            bookName: orderDetail.book_name,
            bookCode: orderDetail.book_code,
            memberFullName: order.member.full_name,
            memberCode: order.member.code,
            orderStatus: order.order_status,
            orderDate: order.order_date,
          });
        }
      }
      setTableData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderIds();
  }, []);

  useEffect(() => {
    if (orderIds.length > 0) {
      fetchOrderInfos();
    }
  }, [orderIds]);

  const columns: ColumnsType<DataType> = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Book Name",
      dataIndex: "bookName",
      key: "bookName",
    },
    {
      title: "Book Code",
      dataIndex: "bookCode",
      key: "bookCode",
    },
    {
      title: "Member Full Name",
      dataIndex: "memberFullName",
      key: "memberFullName",
    },
    {
      title: "Member Code",
      dataIndex: "memberCode",
      key: "memberCode",
    },
    {
      title: "Order Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: OrderStatus,
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      key: "orderDate",
    },
  ];
  return <Table loading={loading} columns={columns} dataSource={tableData}></Table>;
}
