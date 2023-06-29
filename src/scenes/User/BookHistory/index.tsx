import { Avatar, Button, Col, Row, Select } from "antd";
import Table from "antd/es/table";
import styled from "styled-components";
import React, { useCallback, useEffect, useState } from "react";
import { BookCopy } from "@/services/types";
import bookService from "@/services/book";

const StyledMyBookContainer = styled.div`
  border-radius: 12px;
  padding: 30px;
  background: #fff;
  width: 100%;
  margin-top: 70px;
  box-shadow: 0 20px 27px rgb(0 0 0/5%);
  > .table-header {
    display: flex;
    justify-content: space-between;
    padding-bottom: 20px;
  }
`;

const { Option } = Select;

const BookHistory = () => {
  const columns = [
    {
      title: "Avatar",
      dataIndex: ["book", "image"],
      key: "avatar",
      render: (image: string) => <Avatar shape="square" size={148} src={image} />,
    },
    {
      title: "Name",
      dataIndex: ["book", "name"],
      key: "name",
    },
    {
      title: "BookStatus",
      dataIndex: "book_status",
      key: "book_status",
    },
    {
      title: "Category",
      dataIndex: ["book", "category", "name"],
      key: "category",
    },
    {
      title: "Author",
      dataIndex: ["book", "author", "name"],
      key: "author",
    },
    {
      title: "Publisher",
      dataIndex: ["book", "publisher", "name"],
      key: "publisher",
    },
  ];

  const [books, setBooks] = useState<BookCopy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchBookList = useCallback(async () => {
    try {
      setLoading(true);
      const response: BookCopy[] = await bookService.getMyBookList();
      setBooks(response);
      setLoading(false);
    } catch (error) {
      console.error("error", error);
      // Handle error
    }
  }, []);

  useEffect(() => {
    fetchBookList();
  }, [fetchBookList]);

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
      <Table<BookCopy> columns={columns} dataSource={books} loading={loading} />
    </StyledMyBookContainer>
  );
};

export default BookHistory;
