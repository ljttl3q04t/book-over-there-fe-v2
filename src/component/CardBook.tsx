import {
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  LikeFilled,
  LikeOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Color } from "@rc-component/color-picker";
import { Button, Card, Modal, Row } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
const { Meta } = Card;
const { confirm } = Modal;

function CardBook({
  width = 300,
  height = 300,
  srcImg = "https://symbols.vn/wp-content/uploads/2021/12/Cap-nhat-them-bo-suu-tap-Anh-nen-dien-thoai-One-Piece-an-tuong.jpg",
  content,
  onEdit,
  onDelete,
  permissionAdmin,
  isLike = false,
  router,
}: any) {
  const navigate = useNavigate();

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
        className="card-book"
        hoverable
        style={{ width: width, height: height }}
        cover={<img alt="example" src={srcImg} style={{ height: "100%" }} />}
      >
        <Meta
          title={content && content.title}
          description={content && content.description}
        />
        <div className="overlay" style={{ width: width, height: height }}></div>
        {permissionAdmin ? (
          <>
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
        ) : (
          <Row>
            <Button
              style={{ marginRight: "10px" }}
              shape="circle"
              icon={<ShoppingCartOutlined />}
              size="large"
            />

            <Button
              style={{ marginRight: "10px" }}
              shape="circle"
              icon={<InfoCircleOutlined />}
              size="large"
              onClick={() => navigate(`${router}`)}
            />

            <Button
              shape="circle"
              icon={isLike ? <LikeFilled /> : <LikeOutlined />}
              style={{ color: isLike && "#1890ff" }}
              size="large"
            />
          </Row>
        )}
      </Card>
    </>
  );
}

export default CardBook;
