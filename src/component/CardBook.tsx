/* eslint-disable @typescript-eslint/no-empty-function */
import {
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  LikeFilled,
  LikeOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Button, Card, Modal, Row } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
const { Meta } = Card;
const { confirm } = Modal;

function CardBook({
  width = 290,
  height = 200,
  srcImg = "https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-1---g_u-tr_c-l_n-v_-r_ng-t_-hon---copy.jpg",
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
        cover={
          <img
            alt="example"
            src={srcImg}
            style={{
              width: width,
              height: 260,
              objectFit: "cover",
            }}
          />
        }
      >
        <Meta title={content && content.title} description={content && content.description} />
        {/* <div className="overlay" style={{ maxWidth: width, height: height }}></div> */}
        {permissionAdmin ? (
          <>
            <Row>
              <Button type="primary" style={{ marginRight: "10px" }} onClick={onEdit}>
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
            />

            <Button
              type="primary"
              style={{ marginRight: "10px" }}
              shape="circle"
              icon={<InfoCircleOutlined />}
              onClick={() => navigate(`${router}`)}
            />

            <Button
              type="primary"
              danger
              className="carousel-btn"
              shape="circle"
              icon={isLike ? <LikeFilled /> : <LikeOutlined />}
              style={{ color: isLike && "gray" }}
            />
          </Row>
        )}
      </Card>
    </>
  );
}

export default CardBook;
