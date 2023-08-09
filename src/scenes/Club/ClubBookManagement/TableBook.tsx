import Table from "antd/es/table";
import Image from "@/component/Image";
import { ClubBookInfos } from "@/services/types";
import { useTranslation } from "react-i18next";
import { EditOutlined } from "@ant-design/icons";
import { Space, Button } from "antd";

type TableBookProps = {
  loading: boolean;
  clubBookInfos: ClubBookInfos[];
};

function TableBook({ loading, clubBookInfos }: TableBookProps) {
  const { t } = useTranslation();
  const columns = [
    {
      title: "",
      dataIndex: ["book", "image"],
      key: "",
      width: "8%",
      render: (_values: any) => {
        return (
          <>
            <Image alt="pic" style={{ width: 50, height: 50 }} src={_values} />
          </>
        );
      },
    },
    {
      title: t("Book Code") as string,
      dataIndex: ["code"],
      key: "bookCode",
      width: "8%",
    },
    {
      title: t("Book Name") as string,
      dataIndex: ["book", "name"],
      key: "bookName",
      width: "40%",
    },
    {
      title: t("Author") as string,
      key: "authorName",
      dataIndex: ["book", "author", "name"],
      width: "16%",
    },
    {
      title: t("Category") as string,
      dataIndex: ["book", "category", "name"],
      key: "categoryName",
      width: "16%",
    },
    {
      title: t("Initial Count") as string,
      key: "init_count",
      dataIndex: "init_count",
      width: "8%",
    },
    {
      title: t("Current Count") as string,
      key: "current_count",
      dataIndex: "current_count",
      width: "8%",
    },
    {
      title: t("Action") as string,
      key: "action",
      width: "10%",
      render: (v: any) => (
        <Space>
          <Button type="primary" icon={<EditOutlined />} onClick={() => {}}>
            {t("Edit") as string}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        loading={loading}
        columns={columns}
        scroll={{ x: 1500, y: 700 }}
        dataSource={clubBookInfos.sort((a, b) => b.id - a.id)}
        pagination={{
          defaultPageSize: 50, // Set the default pageSize to 50
          showSizeChanger: true, // Optional: To allow users to change pageSize
          pageSizeOptions: ["10", "20", "50", "100"], // Optional: Specify other pageSize options
        }}
      />
    </>
  );
}

export default TableBook;
