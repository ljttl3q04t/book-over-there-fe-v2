/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import {
  Input,
  Dropdown,
  Space,
  Image,
  Typography,
  Badge,
  Modal,
  Menu
} from "antd";
import {
  ProfileOutlined,
  BellOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Link, useNavigate } from "react-router-dom";

interface NavbarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean) => void;
}

const items: MenuProps["items"] = [
  {
    key: "1",
    label: <p>Change password</p>,
  },
  {
    key: "2",
    label: (
      <Link
        onClick={() => {
          localStorage.removeItem("access_token");
          window.location.reload();
        }}
        to="/"
      >
        Logout
      </Link>
    ),
  },
];

const { Search } = Input;
const { Title } = Typography;

const Navbar: React.FC<NavbarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const access = localStorage.getItem("access_token");
  const navigate = useNavigate();
  const [changePW, setChangePW] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem('username'));

  const iconNotifi = () => {
    return (
      <Space size="middle" style={{ marginRight: 15 }}>
        <Badge size="small" count={5}>
          <ShoppingCartOutlined
            style={{ fontSize: "20px", cursor: "pointer" }}
            onClick={() => navigate("/book-wishlist")}
          />
        </Badge>
        <Badge dot={true}>
          <BellOutlined style={{ fontSize: "20px", cursor: "pointer" }} />
        </Badge>
      </Space>
    );
  };

  const handleChangePassword = (e: any) => {
    setChangePW(true);
  };

  const handleLogout = (e: any) => {
    localStorage.removeItem("access_token");
    window.location.reload();
    navigate("/");
  };

  const menu = (
    <Menu>
      <Menu.Item key="item1" onClick={handleChangePassword}>
        Change password
      </Menu.Item>
      <Menu.Item key="item2" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );


  return (
    <div style={{ padding: "10px 40px 10px 400px", marginBottom: "0" }}>
      {/* <Search
                placeholder="Enter book name to search...."
                allowClear
                enterButton="Search"
                size="large"
            onSearch={onSearch}
            /> */}
      <div style={{ float: "right", display: "flex", alignItems: "center" }}>
        {access != null ? (
          <>
            {iconNotifi()}
            <Image
              style={{
                float: "left",
                border: "1px solid #fff",
                borderRadius: "50%",
              }}
              width={25}
              preview={false}
              src="https://cdn.eduncle.com/library/scoop-files/2020/6/image_1593346767460.jpg"
            />
            <Dropdown
              overlay={menu}
              placement="bottomRight"
              trigger={["click"]}
              arrow
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginLeft: 5,
                  }}
                >
                  Hello {username}!
                  <ProfileOutlined />
                </Space>
              </a>
            </Dropdown>
            <Modal open={changePW} onCancel={() => setChangePW(false)}>

            </Modal>
          </>
        ) : (
          <>
            <a
              onClick={(e) => {
                e.preventDefault();
                navigate("/login");
              }}
            >
              <Space
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginLeft: 5,
                }}
              >
                Login
              </Space>
            </a>
            <p>/</p>
            <a
              onClick={(e) => {
                e.preventDefault();
                navigate("/register");
              }}
            >
              <Space
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginLeft: 5,
                }}
              >
                Register
              </Space>
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
