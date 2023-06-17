import React from "react";
import CardBook from "../../../component/CardBook";
import { Col, Row, Select } from "antd";
import Table, { ColumnsType } from "antd/es/table";

const { Option } = Select;

function MyBook() {


    const columns: ColumnsType<any> = [
        {
            title: 'Cover',
            dataIndex: 'cover',
            key: 'author',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            render: (_, { tags }) => (
                ""
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                ""
            ),
        },
    ];

    const data: any = [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
            tags: ['nice', 'developer'],
        },
        {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
            tags: ['loser'],
        },
        {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sydney No. 1 Lake Park',
            tags: ['cool', 'teacher'],
        },
    ];
    return (
        <>
            <Select defaultValue={"All"} size="large" style={{ width: 250, marginBottom: 30 }}>
                <Option value="All">ALL</Option>
                <Option value="newest">Newest</Option>
                <Option value="oldest">Oldest</Option>
                <Option value="a-z">A-Z</Option>
                <Option value="z-a">Z-A</Option>
            </Select>
            <Table columns={columns} dataSource={data} />;
        </>
    );
}

export default MyBook
