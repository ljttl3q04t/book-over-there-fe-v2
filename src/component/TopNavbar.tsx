import BreadcrumbNav from "@/component/BreadcrumbNav";
import { UserContext } from "@/context/UserContext";
import { UserOutlined, UserAddOutlined } from "@ant-design/icons";
import { Button, Col, Row, Select, Space } from "antd";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const StyledNavBar = styled.div`
  display: flex;
  padding: 16px;
  justify-content: space-between;
  border-radius: 0.75rem;
  margin-bottom: 0px;
  background: rgb(255, 255, 255);
  margin: 1rem 1rem 1rem 0;
  border-radius: 0.75rem;
  box-shadow: rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem;
`;

export function TopNavbar() {
  const access = localStorage.getItem("access_token");
  const { user, logoutUser, language, changeLanguage } = useContext(UserContext);
  const { t, i18n } = useTranslation();

  const handleChangeLanguage = (e: any) => {
    const language = e;
    i18n.changeLanguage(language);
    changeLanguage(language);
  };

  return (
    <>
      <StyledNavBar>
        <BreadcrumbNav displayPageName={false} />
        <Row>
          <Col>
            <Select
              value={language}
              onChange={handleChangeLanguage}
              style={{ width: 120 }}
              options={[
                { value: "vi", label: t("common.vietnames") },
                { value: "en", label: t("common.english") },
              ]}
            />
          </Col>
          {!access && (
            <>
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
            </>
          )}
        </Row>
        {/* <Menu mode="horizontal">
          {access && (
            <>
              <Menu.Item key="login">
                <Button type="primary">Login</Button>
              </Menu.Item>
              <Menu.Item key="register">
                <Button type="primary">Register</Button>
              </Menu.Item>
            </>
          )}
        </Menu> */}
      </StyledNavBar>
    </>
  );
}
