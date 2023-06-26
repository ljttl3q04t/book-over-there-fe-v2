/* eslint-disable @typescript-eslint/no-unused-vars */
import { BellOutlined, ProfileOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Badge, Dropdown, Image, Modal, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getUser, token } from "../store/userStore";

interface NavbarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ _isSidebarOpen, _setIsSidebarOpen }: any) => {
  const access = localStorage.getItem("access_token");
  const navigate = useNavigate();
  const [changePW, setChangePW] = useState(false);
  const dispatch = useDispatch<any>();
  const username: any = useSelector<any>((state) => state.user.userInfo.username);

  useEffect(() => {
    dispatch(getUser());
    dispatch(token(access));
  }, [dispatch]);

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

  const handleChangePassword = (_e: any) => {
    setChangePW(true);
  };

  const handleLogout = (_e: any) => {
    localStorage.clear();
    navigate("/");
  };

  const items: MenuProps["items"] = [
    {
      label: "Change password",
      key: "1",
      onClick: handleChangePassword,
    },
    {
      label: "Logout",
      key: "2",
      onClick: handleLogout,
    },
  ];

  return (
    <div style={{ padding: "10px 40px 10px 400px", marginBottom: "0", background: "#fff" }}>
      {/* <Search
                placeholder="Enter book name to search...."
                allowClear
                enterButton="Search"
                size="large"
            onSearch={onSearch}
            /> */}
      <div style={{ float: "right", display: "flex", alignItems: "center" }}>
        {access !== null ? (
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
            <Dropdown menu={{ items }} placement="bottomRight" trigger={["click"]} arrow>
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
            <Modal open={changePW} onCancel={() => setChangePW(false)}></Modal>
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
