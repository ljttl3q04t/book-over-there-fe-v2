import { DraftOrderInfos } from "@/services/types";
import { Avatar, List, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import defaultImage from "@/image/book-default.png";
import moment from "moment";

type OnlineOrderTableProps = {
  tableData: any;
  tableLoading: boolean;
};

export function OnlineOrderTable({ tableData, tableLoading }: OnlineOrderTableProps) {
  const { t } = useTranslation();

  const columns: ColumnsType<DraftOrderInfos> = [
    {
      title: t("Full Name") as string,
      dataIndex: "fullName",
      key: "fullName",
      width: "12%",
    },
    {
      title: t("Phone Number") as string,
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: "12%",
    },
    {
      title: t("Address") as string,
      dataIndex: "address",
      key: "address",
      width: "18%",
    },
    {
      title: t("Order Date") as string,
      dataIndex: "orderDate",
      key: "orderDate",
      width: "8%",
    },
    {
      title: t("Due Date") as string,
      dataIndex: "dueDate",
      key: "dueDate",
      render: (v) => {
        return v ? moment(v).format("YYYY-MM-DD") : "";
      },
      width: "8%",
    },
    {
      title: t("Selected Books") as string,
      key: "books",
      dataIndex: "books",
      render: (value) => {
        return (
          <>
            <List
              itemLayout="horizontal"
              dataSource={value}
              renderItem={(item: any) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.book.image ? item.book.image : defaultImage} />}
                    title={<p>{item.book.name}</p>}
                  />
                </List.Item>
              )}
            />
          </>
        );
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
        rowKey="onlineOrderDetailId"
        pagination={{
          defaultPageSize: 50, // Set the default pageSize to 50
          showSizeChanger: true, // Optional: To allow users to change pageSize
          pageSizeOptions: ["10", "20", "50", "100"], // Optional: Specify other pageSize options
        }}
      ></Table>
    </>
  );
}
