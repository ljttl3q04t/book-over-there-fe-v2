import Table, { ColumnsType } from "antd/es/table";
import { Tag } from "antd";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { DataType } from "./types";

type OrderHistoryTableProps = {
  tableData: DataType[];
  tableLoading: boolean;
};
function OrderStatus(orderStatus: string, value: string) {
  const STATUS_COLORS: Record<string, string> = {
    created: "green",
    overdue: "volcano",
  };
  const color = STATUS_COLORS[orderStatus] ?? "geekblue";
  return (
    <Tag color={color} key={orderStatus}>
      {value.toUpperCase()}
    </Tag>
  );
}

export function OrderHistoryTable({ tableData, tableLoading }: OrderHistoryTableProps) {
  const { t } = useTranslation();
  const columns: ColumnsType<DataType> = [
    {
      title: "ID",
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
      dataIndex: "memberPhoneNumber",
      key: "memberPhoneNumber",
    },
    {
      title: t("Order Status") as string,
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (v) => OrderStatus(v, t(`orderStatus.${v}`)),
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
        let result = v;
        if (record.orderStatus === "complete" && record.returnDate) {
          const dueDateObj = moment(record.dueDate, "YYYY-MM-DD").startOf("day");
          const overdueDayCount = moment(record.returnDate).startOf("day").diff(dueDateObj, "days");
          result = overdueDayCount < 0 ? v : overdueDayCount;
        }
        if (!result) return "";
        return <Tag color={"volcano"}>{`${result} ${t("days") as string}`}</Tag>;
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
        rowKey="orderDetailId"
        pagination={{
          defaultPageSize: 50, // Set the default pageSize to 50
          showSizeChanger: true, // Optional: To allow users to change pageSize
          pageSizeOptions: ["10", "20", "50", "100"], // Optional: Specify other pageSize options
        }}
      ></Table>
    </>
  );
}
