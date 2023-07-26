/* eslint-disable @typescript-eslint/no-unused-vars */
import { BellOutlined, ProfileOutlined, HeartTwoTone, UserAddOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Badge, Button, Dropdown, Image, Modal, Select, Space } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "@/context/UserContext";
import BreadcrumbNav from "@/component/BreadcrumbNav";
import { useTranslation } from "react-i18next";

const StyledNavBar = styled.div`
  padding: 10px 20px 10px 0;
  margin-bottom: 0px;
  background: rgb(255, 255, 255);
  margin: 1rem 1rem 1rem 0;
  border-radius: 0.75rem;
  /* border-bottom: 2px; */
  box-shadow: rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem;
  display: flex;
  justify-content: space-between;
`;
const StyledActionLog = styled.div`
  display: flex;
  gap: 8px;
`;
interface NavbarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ _isSidebarOpen, _setIsSidebarOpen }: any) => {
  const access = localStorage.getItem("access_token");
  const navigate = useNavigate();
  const [changePW, setChangePW] = useState(false);
  const { user, logoutUser, language, changeLanguage } = useContext(UserContext);
  const { t, i18n } = useTranslation();

  const handleLogout = (_e: any) => {
    logoutUser();
    localStorage.clear();
    navigate("/");
  };

  const items: MenuProps["items"] = [
    {
      label: t("Logout") as string,
      key: "2",
      onClick: handleLogout,
    },
  ];

  const handleChangeLanguage = (e: any) => {
    const language = e;
    i18n.changeLanguage(language);
    changeLanguage(language);
  };

  return (
    <StyledNavBar>
      <BreadcrumbNav displayPageName={false} />
      <div style={{ float: "right", display: "flex", alignItems: "center" }}>
        <Select
          value={language}
          style={{ width: 120 }}
          onChange={handleChangeLanguage}
          options={[
            { value: "vi", label: t("common.vietnames") },
            { value: "en", label: t("common.english") },
          ]}
        />
        {access !== null ? (
          <>
            <Image
              style={{
                float: "left",
                border: "1px solid #fff",
                borderRadius: "50%",
              }}
              width={25}
              preview={false}
              src={user && user.avatar}
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
                  {user && user.username}!
                  <ProfileOutlined />
                </Space>
              </a>
            </Dropdown>
            <Modal open={changePW} onCancel={() => setChangePW(false)}></Modal>
          </>
        ) : (
          <StyledActionLog>
            <Button
              icon={<UserOutlined />}
              type="primary"
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
                {t("Login") as string}
              </Space>
            </Button>
            <Button
              icon={<UserAddOutlined />}
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
                {t("Register") as string}
              </Space>
            </Button>
          </StyledActionLog>
        )}
      </div>
    </StyledNavBar>
  );
};

export default Navbar;
