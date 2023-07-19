import React, { useEffect, useState } from "react";
import Table, { ColumnsType } from "antd/es/table";
import dfbServices from "@/services/dfb";
import { OrderInfos } from "@/services/types";
import { Button, Tag, notification } from "antd";
import moment from "moment";
import styled from "styled-components";

type DataType = {
  orderId: number;
  orderDetailId: number;
  bookName: string;
  bookCode: string;
  memberFullName: string;
  memberCode: string;
  orderStatus: string;
  orderDate: string;
  returnDate: string;
  overdueDay: number;
  dueDate: string;
};
type OrderTableProps = {
  rowSelection: object;
  tableData: DataType[];
  tableLoading: boolean;
};
const StyledTable = styled(Table)`
  .disabled-row {
    background-color: #f5f5f5; /* Example background color for disabled rows */
    pointer-events: none; /* Disable pointer events on the row */
    opacity: 0.5; /* Example opacity for disabled rows */
  }
`;
function OrderStatus(orderStatus: string) {
  const STATUS_COLORS: Record<string, string> = {
    created: "green",
    overdue: "red",
  };
  const color = STATUS_COLORS[orderStatus] ?? "geekblue";
  return (
    <Tag color={color} key={orderStatus}>
      {orderStatus.toUpperCase()}
    </Tag>
  );
}

export function OrderTable({ rowSelection, tableData, tableLoading }: OrderTableProps) {
  const rowClassName = (record: DataType) => {
    return record.orderStatus === "complete" ? "disabled-row" : "";
  };
  const columns: ColumnsType<DataType> = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      width: "5%",
    },
    {
      title: "Book Name",
      dataIndex: "bookName",
      key: "bookName",
      width: "15%",
    },
    {
      title: "Book Code",
      dataIndex: "bookCode",
      key: "bookCode",
      width: "7%",
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
    {
      title: "Return Date",
      dataIndex: "returnDate",
      key: "returnDate",
      render: (v) => {
        return v ? moment(v).format("YYYY-MM-DD") : "";
      },
    },
    {
      title: "Overdue Day",
      dataIndex: "overdueDay",
      key: "overdueDay",
      render: (v, record) => {
        const today = moment().startOf("day");
        const dueDateObj = moment(record.dueDate, "YYYY-MM-DD").startOf("day");
        const overdueDay = today.diff(dueDateObj, "days");
        return overdueDay < 0 ? v : overdueDay;
      },
    },
  ];
  return (
    <>
      <Table
        loading={tableLoading}
        columns={columns}
        dataSource={tableData}
        scroll={{ x: 1000, y: 700 }}
        rowSelection={rowSelection}
        rowClassName={rowClassName}
        rowKey="orderDetailId"
      ></Table>
    </>
  );
}
