import Table from "antd/es/table";
import Image from "@/component/Image";
import { ClubBookInfos } from "@/services/types";
import { useTranslation } from "react-i18next";

type TableBookProps = {
  loading: boolean;
  clubBookInfos: ClubBookInfos[];
};

function TableBook({ loading, clubBookInfos }: TableBookProps) {
  const { t } = useTranslation();
  const columns = [
    {
      title: "",
      dataIndex: "image",
      key: "",
      width: "10%",
      render: (_values: any) => {
        return (
          <>
            <Image alt="pic" style={{ width: 50, height: 50 }} src={_values} />
          </>
        );
      },
    },
    {
      title: t("Book Name") as string,
      dataIndex: ["book", "name"],
      key: "bookName",
      width: "50%",
    },
    {
      title: t("Category") as string,
      dataIndex: ["book", "category", "name"],
      key: "categoryName",
      width: "15%",
    },
    {
      title: t("Author") as string,
      key: "authorName",
      dataIndex: ["book", "author", "name"],
      width: "15%",
    },
  ];

  return (
    <>
      <Table
        loading={loading}
        columns={columns}
        scroll={{ x: 1500, y: 700 }}
        dataSource={clubBookInfos}
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
