import { LikeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Button, Col, Descriptions, Row } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";
import React from "react";

function BookDetail() {
  const carDetail = (
    <Row justify={"space-between"}>
      <Col span={6}>
        <img
          src="https://symbols.vn/wp-content/uploads/2021/12/Cap-nhat-them-bo-suu-tap-Anh-nen-dien-thoai-One-Piece-an-tuong.jpg"
          alt=""
          width="100%"
          height="250px"
          style={{ borderRadius: "8px" }}
        />
      </Col>

      <Col span={17}>
        <Descriptions title="User Info : Nguyen Van A">
          <Descriptions.Item label="Thể loại" span={4}>
            Zhou Maomao
          </Descriptions.Item>
          <Descriptions.Item label="Tác giả" span={4}>
            1810000000111111111
          </Descriptions.Item>
          <Descriptions.Item label="chủ sách" span={4}>
            Hangzhou, Zhejiang
          </Descriptions.Item>
        </Descriptions>
        <Button icon={<ShoppingCartOutlined />} type="primary">
          Add to cart
        </Button>
        <Button icon={<LikeOutlined />} style={{ marginLeft: "10px" }}>
          Wishlist
        </Button>
      </Col>
    </Row>
  );
  return (
    <Row
      style={{
        flexDirection: "column",
        margin: "0 auto",
        width: "60%",
        padding: 25,
        borderRadius: 5,
        border: "1px solid rgba(0,0,0,0.2)",
        boxShadow: "rgb(0 0 0 / 12%) 0px 5px 5px",
      }}
      justify={"space-between"}
      gutter={[0, 16]}
    >
      <Col>{carDetail}</Col>
      <Col>
        <Title level={2}>Descriptions:</Title>
        <Paragraph
          style={{
            padding: 25,
            borderRadius: 10,
            border: "1px solid rgba(0,0,0,0.2)",
            boxShadow: "rgb(0 0 0 / 12%) 0px 5px 5px",
            margin: 0,
          }}
        >
          To be, or not to be, that is a question: Whether it is nobler in the mind to suffer. The slings and arrows of
          outrageous fortune Or to take arms against a sea of troubles, And by opposing end them? To die: to sleep; No
          more; and by a sleep to say we end The heart-ache and the thousand natural shocks That flesh is heir to, 'tis
          a consummation Devoutly to be wish'd. To die, to sleep To sleep- perchance to dream: ay, there's the rub! For
          in that sleep of death what dreams may come When we have shuffled off this mortal coil, Must give us pause.
          There 's the respect That makes calamity of so long life--William Shakespeare
        </Paragraph>
      </Col>
      <Col>
        <Title level={2}>History:</Title>
      </Col>
    </Row>
  );
}

export default BookDetail;
