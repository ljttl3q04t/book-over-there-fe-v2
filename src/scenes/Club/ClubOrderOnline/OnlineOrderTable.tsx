import defaultImage from "@/image/book-default.png";
import { CheckCircleOutlined, EditOutlined } from "@ant-design/icons";
import { Avatar, Button, List, Space, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { OnlineOrderTableRow } from "./types";
import * as React from "react";

type OnlineOrderTableProps = {
  tableData: any;
  tableLoading: boolean;
  handleEditOnClick: any;
  handleOrderConfirm: any;
};

export function OnlineOrderTable({
  tableData,
  tableLoading,
  handleEditOnClick,
  handleOrderConfirm,
}: OnlineOrderTableProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);

  const onClickConfirm = async (row: any) => {
    setLoading(true);
    await handleOrderConfirm(row);
    setLoading(false);
  };

  const columns: ColumnsType<OnlineOrderTableRow> = [
    {
      title: t("Full Name") as string,
      dataIndex: "fullName",
      key: "fullName",
      width: "12%",
      render: (value, row) => {
        return (
          <Space direction="vertical">
            {value}
            {row.member ? <Tag color="green">{row.member.code}</Tag> : <Tag>{t("New Member") as string}</Tag>}
          </Space>
        );
      },
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
    {
      title: t("Status") as string,
      key: "status",
      dataIndex: "draftStatus",
      render: (value) => {
        if (value === "pending") {
          return <Tag>{(t(`draftStatus.${value}`) as string).toUpperCase()}</Tag>;
        } else {
          return <Tag color="green">{(t(`draftStatus.${value}`) as string).toUpperCase()}</Tag>;
        }
      },
      width: "8%",
    },
    {
      title: t("Action") as string,
      key: "action",
      width: "8%",
      render: (value: any) => {
        if (value.draftStatus !== "pending") {
          return <></>;
        }
        return (
          <Space direction="vertical">
            <Button
              type="default"
              icon={<EditOutlined />}
              onClick={() => {
                handleEditOnClick(value);
              }}
            >
              {t("Edit") as string}
            </Button>
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => {
                onClickConfirm(value);
              }}
              loading={loading}
            >
              {t("Confirm") as string}
            </Button>
          </Space>
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
