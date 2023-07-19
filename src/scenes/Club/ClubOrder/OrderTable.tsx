import * as React from "react";
import Table, { ColumnsType } from "antd/es/table";
import dfbServices from "@/services/dfb";
import { OrderInfos } from "@/services/types";
import { Button, Tag, notification } from "antd";
import moment from "moment";
import { useTranslation } from "react-i18next";

type DataType = {
  orderId: number;
  orderDetailId: number;
  bookName: string;
  bookCode: string;
  memberFullName: string;
  memberCode: string;
  phoneNumber: string;
  orderStatus: string;
  orderDate: string;
  returnDate: string;
  overdueDay: number;
  dueDate: string;
};

type OrderTableProps = {
  loading: boolean;
  setLoading: any;
  orderIds: number[];
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

export function OrderTable({ loading, setLoading, orderIds }: OrderTableProps) {
  const [tableData, setTableData] = React.useState<DataType[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);

  const { t } = useTranslation();

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleReturnBooks = async () => {
    try {
      setLoading(true);
      const data = {
        order_detail_ids: selectedRowKeys.join(","),
      };
      const message = await dfbServices.returnBooks(data);
      notification.success({ message: message, type: "success" });
    } catch (error: any) {
      console.error(error);
      notification.error({ message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderInfos = async () => {
    try {
      setLoading(true);
      const orderInfos: OrderInfos[] = await dfbServices.getOrderInfos(orderIds);
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
            phoneNumber: order.member.phone_number ?? "",
            orderStatus: orderDetail.order_status,
            orderDate: order.order_date,
            returnDate: orderDetail.return_date,
            overdueDay: orderDetail.overdue_day_count ?? 0,
            dueDate: order.due_date,
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

  React.useEffect(() => {
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
      title: t("Book Name") as string,
      dataIndex: "bookName",
      key: "bookName",
    },
    {
      title: t("Book Code") as string,
      dataIndex: "bookCode",
      key: "bookCode",
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
      <div style={{ padding: "16px" }}>
        <Button onClick={handleReturnBooks} type="primary" loading={loading} disabled={!selectedRowKeys.length}>
          Return Book
        </Button>
      </div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={tableData}
        scroll={{ x: 1000, y: 700 }}
        rowSelection={rowSelection}
        rowKey="orderDetailId"
      ></Table>
    </>
  );
}
