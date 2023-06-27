import {
  BookOutlined,
  CheckCircleOutlined,
  HistoryOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MessageOutlined,
  TeamOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu, MenuProps, Typography } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "@/context/UserContext";
import { getAccessToken } from "../http-common";

const { Sider } = Layout;
const { Title } = Typography;

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
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  let items: MenuProps["items"] = [
    getItem("Home Page", "", <HomeOutlined />),
    getItem("Checkout", "checkout", <CheckCircleOutlined />),
  ];
  const getClubStaffItem = (isStaff: any): MenuItem => {
    if (isStaff) {
      return getItem("Club staff", "clubstaff");
    } else {
      return null; // Return null if the user is not a staff member
    }
  };
  if (getAccessToken()) {
    items = [
      ...items,
      getItem("Club", "sub1", <TeamOutlined />, [
        getItem("Club list", "clublist"),
        getItem("Club book", "clubbook"),
        getClubStaffItem(user?.is_staff),
      ]),
      getItem("User", "sub0", <UserOutlined />, [
        getItem("My Account", "sub3", <UserOutlined />, [
          getItem("Personal profile", "my-profile"),
          getItem("Payment", "payment"),
          getItem("Transaction history", "transactionhistory"),
        ]),

        getItem("Book Status", "sub2", <BookOutlined />, [getItem("My book", "my-book")]),
        getItem("Book History", "book-history", <HistoryOutlined />),
        getItem("Wishlist", "book-wishlist", <UnorderedListOutlined />),
      ]),
      getItem("Support", "support", <MessageOutlined />),
    ];
  } else {
    items = [
      ...items,
      getItem("Club", "sub1", <TeamOutlined />, [getItem("Club list", "clublist")]),
      getItem("Support", "support", <MessageOutlined />),
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
