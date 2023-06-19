import { Button, Col, Descriptions, Row } from "antd";
import React from "react";

const CardTransaction = () => (
  <Row
    style={{
      width: "55%",
      margin: "0 auto",
      padding: 25,
      paddingBottom: 0,
      borderRadius: 10,
      border: "1px solid rgba(0,0,0,0.2)",
      boxShadow: "rgb(0 0 0 / 12%) 0px 5px 5px",
    }}
    justify="space-between"
    gutter={16}
  >
    <Col
      xs={{ span: 5 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <img
        src="https://file.hstatic.net/200000122283/article/naruto_91ddf528da9342478d74f2a345adc3b4_1024x1024.png"
        alt=""
        style={{ width: "100%", height: "70%", objectFit: "cover" }}
      />
      <Button type="primary" style={{ marginBottom: "20px" }}>
        Mượn lại
      </Button>
    </Col>
    <Col xs={{ span: 15 }}>
      <Descriptions title="User Info : Nguyen Van A" layout="vertical">
        <Descriptions.Item label="Tên Sách" span={2}>
          Zhou Maomao
        </Descriptions.Item>
        <Descriptions.Item label="Telephone" span={2}>
          1810000000111111111
        </Descriptions.Item>
        <Descriptions.Item label="Live" span={2}>
          Hangzhou, Zhejiang
        </Descriptions.Item>
        <Descriptions.Item label="Address" span={2}>
          ''
        </Descriptions.Item>
      </Descriptions>
    </Col>
    <Col xs={{ span: 3 }}>
      <Button type="primary">View page</Button>
    </Col>
  </Row>
);

const Transaction = () => {
  return (
    <Row gutter={[0, 32]}>
      {[1, 2, 4, 5, 6].map(() => (
        <CardTransaction />
      ))}
    </Row>
  );
};

export default Transaction;
