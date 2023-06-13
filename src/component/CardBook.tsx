import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, Card, Modal, Row } from "antd";
import React from "react";
const { Meta } = Card;
const { confirm } = Modal;

function CardBook({
  width = 300,
  height = 300,
  action,
  heightImg = 150,
  srcImg = "https://symbols.vn/wp-content/uploads/2021/12/Cap-nhat-them-bo-suu-tap-Anh-nen-dien-thoai-One-Piece-an-tuong.jpg",
  content,
  onClick,
  onEdit,
  onDelete,
}: any) {
  const showConfirmDelete = () => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: "Delete this Book!",
      centered: true,
      onOk() {
        onDelete("ok");
      },
      onCancel() {},
    });
  };
  return (
    <>
      <Card
        className={!content ? "card-book card-book-checkbody" : ""}
        hoverable
        style={{ width: width, height: height }}
        cover={
          <img
            alt="example"
            src={srcImg}
            height={!content ? height : heightImg}
            style={{ borderRadius: !content ? "8px" : "" }}
          />
        }
        actions={action ? [<span>Explore</span>] : []}
        onClick={onClick}
      >
        {content ? (
          <Meta title={content.title} description={content.description} />
        ) : (
          <>
            <div
              className="overlay"
              style={{ width: width, height: height }}
            ></div>
            <Row>
              <Button
                type="primary"
                style={{ marginRight: "10px" }}
                onClick={onEdit}
              >
                Edit
              </Button>
              <Button onClick={showConfirmDelete}>Delete</Button>
            </Row>
          </>
        )}
      </Card>
    </>
  );
}

export default CardBook;
