import * as React from "react";
import Table, { ColumnsType } from "antd/es/table";
import Image from "@/component/Image";
import dfbServices from "@/services/dfb";
import { ClubBookInfos } from "@/services/types";
import { notification } from "antd";

type TableBookProps = {
  loading: boolean;
  setLoading: any;
  clubBookIds: number[];
};

interface DataTypeClubBook {
  no: number;
  bookName: string;
  categoryName: string;
  authorName: string;
  image: string;
  club: string;
  totalCopyCount: number;
}

const columns: ColumnsType<DataTypeClubBook> = [
  {
    title: "",
    dataIndex: "image",
    key: "",
    render: (_values: any) => {
      return (
        <>
          <Image alt="pic" style={{ width: 50, height: 50 }} src={_values} />
        </>
      );
    },
  },
  {
    title: "Name",
    dataIndex: "bookName",
    key: "bookName",
  },
  {
    title: "Category",
    dataIndex: "categoryName",
    key: "categoryName",
  },
  {
    title: "Author",
    key: "authorName",
    dataIndex: "authorName",
  },
];

function TableBook({ loading, setLoading, clubBookIds }: TableBookProps) {
  const [dataTable, setDataTable] = React.useState<DataTypeClubBook[]>([]);

  const fetchClubBookInfos = async () => {
    try {
      setLoading(true);
      const clubBookInfos: ClubBookInfos[] = await dfbServices.getClubBookInfos(clubBookIds);
      const data = clubBookInfos.map((item, index) => {
        const book: DataTypeClubBook = {
          no: index + 1,
          authorName: item.book.author?.name ?? "",
          bookName: item.book?.name,
          categoryName: item.book.category?.name ?? "",
          image: item.book?.image ?? "",
          club: item.club_id.toString(),
          totalCopyCount: item.current_count,
        };
        return book;
      });
      setDataTable(data);
    } catch (error: any) {
      const errorMessage = error.message || "An error occurred while get books";
      notification.error({ message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (clubBookIds.length > 0) {
      fetchClubBookInfos();
    }
  }, [clubBookIds]);

  return (
    <>
      <Table loading={loading} columns={columns} scroll={{ x: 1500, y: 700 }} dataSource={dataTable} />
    </>
  );
}

export default TableBook;
