import * as React from "react";
import Table, { ColumnsType } from "antd/es/table";
import { Tag } from "antd";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { DataType } from "./types";

type OrderTableProps = {
  rowSelection: object;
  tableData: DataType[];
  tableLoading: boolean;
};
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
  const { t } = useTranslation();
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
      title: t("Book Name") as string,
      dataIndex: "bookName",
      key: "bookName",
      width: "20%",
    },
    {
      title: t("Book Code") as string,
      dataIndex: "bookCode",
      key: "bookCode",
      width: "7%",
    },
    {
      title: t("Reader Full Name") as string,
      dataIndex: "memberFullName",
      key: "memberFullName",
    },
    {
      title: t("Member Code") as string,
      dataIndex: "memberCode",
      key: "memberCode",
    },
    {
      title: t("Phone Number") as string,
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: t("Order Status") as string,
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: OrderStatus,
    },
    {
      title: t("Order Date") as string,
      dataIndex: "orderDate",
      key: "orderDate",
    },
    {
      title: t("Return Date") as string,
      dataIndex: "returnDate",
      key: "returnDate",
      render: (v) => {
        return v ? moment(v).format("YYYY-MM-DD") : "";
      },
    },
    {
      title: t("Overdue Day") as string,
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
