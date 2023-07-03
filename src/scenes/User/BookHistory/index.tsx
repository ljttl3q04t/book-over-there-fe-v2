import { Avatar, Tag, Col, Row, Select, InputRef } from "antd";
import Table from "antd/es/table";
import styled from "styled-components";
import React, { useCallback, useEffect, useState ,useRef } from "react";
import { BookCopy } from "@/services/types";
import bookService from "@/services/book";
import { getBookHistory } from "../MyBook/callService";
import { FilterConfirmProps } from "antd/es/table/interface";
import { getColumnSearchProps } from "@/helpers/CommonTable";

const StyledMyBookContainer = styled.div`
  border-radius: 12px;
  padding: 30px;
  background: #fff;
  width: 100%;
  margin-top: 30px;
  box-shadow: 0 20px 27px rgb(0 0 0/5%);
  > .table-header {
    display: flex;
    justify-content: space-between;
    padding-bottom: 20px;
  }
`;
const statusColors: any = {
  sharing_club: "green",
  new: "geekblue",
};
const { Option } = Select;

const BookHistory = () => {

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  type DataIndex = keyof BookCopy;
  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const columns = [
    {
      title: "Avatar",
      dataIndex: ["bookImage"],
      key: "bookImage",
      render: (image: string) => <Avatar shape="square" size={148} src={image} />,
    },
    {
      title: "Name",
      dataIndex: ["bookName"],
      key: "bookName",
      ...getColumnSearchProps("bookName", searchInput,
        searchText, setSearchText, searchedColumn, setSearchedColumn,
        handleReset, handleSearch),
    },
    {
      title: "BookStatus",
      dataIndex: ["bookStatus"],
      key: "bookStatus",
      render: (bookStatus: any) => {

        return (
          <Tag color={statusColors[bookStatus]} key={status}>
            {bookStatus}
          </Tag>
        );
      },
    },
    {
      title: "Category",
      dataIndex: ["bookCategory"],
      key: "bookCategory",
      ...getColumnSearchProps("bookCategory", searchInput,
        searchText, setSearchText, searchedColumn, setSearchedColumn,
        handleReset, handleSearch),
    },
    {
      title: "Author",
      dataIndex: ["bookAuthor"],
      key: "bookAuthor",
      ...getColumnSearchProps("bookAuthor", searchInput,
        searchText, setSearchText, searchedColumn, setSearchedColumn,
        handleReset, handleSearch),
    },
    {
      title: "Publisher",
      dataIndex: ["bookPublisher"],
      key: "bookPublisher",
      ...getColumnSearchProps("bookPublisher", searchInput,
        searchText, setSearchText, searchedColumn, setSearchedColumn,
        handleReset, handleSearch),
    },
  ];

  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchBookHistory = useCallback(async () => {
    try {
      setLoading(true);
      const response: any = await getBookHistory();
      setBooks(response);
      setLoading(false);
    } catch (error) {
      console.error("error", error);
      // Handle error
    }
  }, []);

  useEffect(() => {
    fetchBookHistory();
  }, [fetchBookHistory]);

  return (
    <StyledMyBookContainer>
      <div className="table-header">
        <Select defaultValue={"All"} style={{ width: 120 }}>
          <Option value="All">ALL</Option>
          <Option value="newest">Newest</Option>
          <Option value="oldest">Oldest</Option>
          <Option value="a-z">A-Z</Option>
          <Option value="z-a">Z-A</Option>
        </Select>
        {/* <Button type="primary" onClick={() => setOpen(true)}>
          Add Book
        </Button> */}
      </div>
      <Table<any> columns={columns} dataSource={books} loading={loading} />
    </StyledMyBookContainer>
  );
};

export default BookHistory;
