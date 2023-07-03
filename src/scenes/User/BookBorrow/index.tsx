import { Avatar, Button, Col, InputRef, Select } from "antd";
import Table from "antd/es/table";
import styled from "styled-components";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { BookCopy } from "@/services/types";
import bookService from "@/services/book";
import { getBookBorrow } from "../MyBook/callService";
import { FilterConfirmProps } from "antd/es/table/interface";
import { getColumnSearchProps } from "@/helpers/CommonTable";
import { formatDate } from "@/helpers/fuctionHepler";

const StyledBookBorrowContainer = styled.div`
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

const { Option } = Select;

const BookBorrow = () => {

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
      dataIndex: ["book_image"],
      key: "avatar",
      render: (image: string) => <Avatar shape="square" size={148} src={image} />,
      
    },
    {
      title: "Name",
      dataIndex: ["book_name"],
      key: "name",
      ...getColumnSearchProps("book_name", searchInput,
        searchText, setSearchText, searchedColumn, setSearchedColumn,
        handleReset, handleSearch),
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
      
    },
    {
      title: "Due Date",
      dataIndex: ["due_date"],
      key: "due_date",
      render: (value:any) => <p>{formatDate(value, 'yyyy-mm-dd, hh:ss')}</p>,
    },
    {
      title: "Overdue Day Count",
      dataIndex: ["overdue_day_count"],
      key: "overdue_day_count",
    },
    {
      title: "Club Name",
      dataIndex: ["club_name"],
      key: "club_name",
      ...getColumnSearchProps("club_name", searchInput,
        searchText, setSearchText, searchedColumn, setSearchedColumn,
        handleReset, handleSearch),
    },
  ];

  const [books, setBooks] = useState<BookCopy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchBookBorrow = useCallback(async () => {
    try {
      setLoading(true);
      const response: any = await getBookBorrow();
      setBooks(response);
      setLoading(false);
    } catch (error) {
      console.error("error", error);
      // Handle error
    }
  }, []);

  useEffect(() => {
    fetchBookBorrow();
  }, [fetchBookBorrow]);

  return (
    <StyledBookBorrowContainer>
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
    </StyledBookBorrowContainer>
  );
};

export default BookBorrow;
