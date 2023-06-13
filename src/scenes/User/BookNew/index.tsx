import React from "react";
import CardBook from "../../../component/CardBook";
import {  Col, Row, Select } from "antd";

const { Option } = Select;

function BookNew() {
    return (
        <>
            <Select defaultValue={"All"} size="large" style={{ width: 250,marginBottom:30 }}>
                <Option value="All">ALL</Option>
                <Option value="newest">Newest</Option>
                <Option value="oldest">Oldest</Option>
                <Option value="a-z">A-Z</Option>
                <Option value="z-a">Z-A</Option>
            </Select>
            <Row gutter={[32, 32]} style={{ width: "100%" }}>
                {[1, 2, 3, 1, 2, 3, 4].map(() => (
                    <Col>
                        <CardBook width="280px" height="350px" />
                    </Col>
                ))}
            </Row>
        </>
    );
}

export default BookNew;
