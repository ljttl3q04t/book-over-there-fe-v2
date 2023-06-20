import { Avatar, Button, Col, Row, Select } from "antd";
import Table from "antd/es/table";
import React, { useCallback, useEffect, useState } from "react";

import DawerBook from "../../../component/DrawerBook";
import bookService from "../../../services/book";
import { BookCopy, ListView } from "../../../services/types";

const { Option } = Select;

function MyBook() {
    const [books, setBooks] = useState<BookCopy[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [open, setOpen] = useState(false)
    const fetchBookList = useCallback(async () => {
        try {
            setLoading(true);
            const response: ListView<BookCopy> = await bookService.getMyBookList();
            setBooks(response.results);
            setLoading(false);
        } catch (error) {
            console.error("error", error);
            // Handle error
        }
    }, []);

    useEffect(() => {
        fetchBookList();
    }, [fetchBookList]);

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

    return (
        <>
            <Row gutter={8} align="middle">
                <Col>
                    <Select defaultValue={"All"} style={{ width: 120 }}>
                        <Option value="All">ALL</Option>
                        <Option value="newest">Newest</Option>
                        <Option value="oldest">Oldest</Option>
                        <Option value="a-z">A-Z</Option>
                        <Option value="z-a">Z-A</Option>
                    </Select>
                </Col>
                <Col>
                    <Button type="primary" onClick={() => setOpen(true)}>Add Book</Button>
                </Col>
            </Row>
            <Table<BookCopy> columns={columns} dataSource={books} loading={loading} />
            <DawerBook open={open} onClose={() => setOpen(false)} />
        </>
    );
}

export default MyBook;
