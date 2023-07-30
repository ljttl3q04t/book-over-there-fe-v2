import {
  BookOutlined,
  HistoryOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu, MenuProps, Typography } from "antd";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "@/context/UserContext";
import { getAccessToken } from "../http-common";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
const { Sider } = Layout;
const { Title } = Typography;
const StyledSidebarDivider = styled.hr`
  flex-shrink: 0;
  border-top: 0px solid rgba(0, 0, 0, 0.08);
  border-right: 0px solid rgba(0, 0, 0, 0.08);
  border-left: 0px solid rgba(0, 0, 0, 0.08);
  height: 0.0625rem;
  margin: 1rem 0px;
  border-bottom: none;
  opacity: 0.25;
  background-color: transparent;
  background-image: linear-gradient(
    to right,
    rgba(255, 255, 255, 0),
    rgb(255, 255, 255),
    rgba(255, 255, 255, 0)
  ) !important;
`;
interface SidebarProps {
  drawerWidth: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean) => void;
  isNonMobile: boolean;
}

type MenuItem = Required<MenuProps>["items"][number];
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group",
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const Sidebar: React.FC<SidebarProps> = ({ drawerWidth, isSidebarOpen, setIsSidebarOpen, isNonMobile }) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [active, setActive] = React.useState("");
  const navigate = useNavigate();
  const { user } = React.useContext(UserContext);
  React.useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  let items: MenuProps["items"] = [getItem(<>{t("sidebar.homePage")}</>, "", <HomeOutlined />)];
  const getClubStaffItem = (isStaff: any): MenuItem => {
    if (isStaff) {
      return getItem(t("Club Staff") as string, "sub4", <UserOutlined />, [
        getItem(t("Club Member") as string, "clubstaff/member-order"),
        getItem(t("Book") as string, "clubstaff/books"),
        getItem(t("Order") as string, "clubstaff/orders"),
        getItem(t("Online Order") as string, "clubstaff/online-orders"),
        getItem(t("Member") as string, "clubstaff/members"),
      ]);
    } else {
      return null; // Return null if the user is not a staff member
    }
  };
  if (getAccessToken()) {
    items = [
      ...items,
      getItem(t("Club") as string, "sub1", <TeamOutlined />, [
        getItem(t("Club List") as string, "clublist"),
        // getItem("Club Book", "clubbook"),
        getClubStaffItem(user?.is_staff),
      ]),
      getItem(t("User") as string, "sub0", <UserOutlined />, [
        getItem(t("My Account") as string, "sub3", <UserOutlined />, [
          getItem(t("Personal Profile") as string, "my-profile"),
        ]),

        getItem("Book Status", "sub2", <BookOutlined />, [
          getItem("My book", "my-book"),
          getItem("Book Borrow", "book-borrow"),
        ]),
        getItem("Book History", "book-history", <HistoryOutlined />),
      ]),
      // getItem("Support", "support", <MessageOutlined />),
    ];
  } else {
    items = [
      ...items,
      getItem(t("Club") as string, "sub1", <TeamOutlined />, [getItem(t("Club List") as string, "clublist")]),
      // getItem("Support", "support", <MessageOutlined />),
    ];
  }

  return (
    <Sider
      width={drawerWidth}
      trigger={null}
      collapsible
      collapsed={!isSidebarOpen}
      className={!isNonMobile && !isSidebarOpen ? "ant-layout-sider-collapsed" : ""}
    >
      <Title level={3} style={{ textAlign: "center", color: "#fff", marginTop: "30px" }}>
        Book Over There
      </Title>
      <StyledSidebarDivider />
      <Menu
        style={{ marginTop: "30px" }}
        theme="dark"
        mode="inline"
        items={items}
        selectedKeys={[active]}
        onClick={({ key }) => {
          navigate(`/${key}`);
          setActive(key);
        }}
      ></Menu>
      <div>
        <div style={{ position: "absolute", right: "27px", bottom: "20px", fontSize: "30px" }}>
          {isSidebarOpen ? (
            <MenuFoldOutlined style={{ color: "white" }} onClick={() => setIsSidebarOpen(false)} />
          ) : (
            <MenuUnfoldOutlined style={{ color: "white" }} onClick={() => setIsSidebarOpen(true)} />
          )}
        </div>
      </div>
    </Sider>
  );
};

export default Sidebar;
