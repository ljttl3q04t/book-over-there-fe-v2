import React, { useEffect, useState } from "react";
import { Layout, Menu, Typography, MenuProps } from "antd";
import {
    HomeOutlined,
    UserOutlined,
    BookOutlined,
    HistoryOutlined,
    UnorderedListOutlined,
    MessageOutlined,
    CheckCircleOutlined,
    TeamOutlined
} from "@ant-design/icons";

import { useLocation, useNavigate } from "react-router-dom";
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
    type?: "group"
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}

const Sidebar: React.FC<SidebarProps> = ({
    drawerWidth,
    isSidebarOpen,
    setIsSidebarOpen,
    isNonMobile,
}) => {
    const { pathname } = useLocation();
    const [active, setActive] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        setActive(pathname.substring(1));
    }, [pathname]);

    let items: MenuProps["items"] = [
        getItem("Home Page", "", <HomeOutlined />),
        getItem("Checkout", "checkout", <CheckCircleOutlined />),
        getItem("Support", "support", <MessageOutlined />),

    ]

    if (getAccessToken()) {
        items = [...items,
        getItem("Club", "sub1", <TeamOutlined />, [
            getItem("Club list", "clublist"),
            getItem("Club book", "clubbook"),
            getItem("Club staff", "clubstaff"),
        ]),
        getItem("User", "sub0", <UserOutlined />, [
            getItem("My Account", "sub3", <UserOutlined />, [
                getItem("Personal profile", "personalprofile"),
                getItem("Payment", "payment"),
                getItem("Transaction history", "transactionhistory"),
            ]),



            getItem("Book Status", "sub2", <BookOutlined />, [
                getItem("My book", "my-book"),
            ]),
            getItem("Book History", "book-history", <HistoryOutlined />),
            getItem("Wishlist", "book-wishlist", <UnorderedListOutlined />),
        ]),
        ]
    }
    else {
        items = [...items, getItem("Club", "sub1", <TeamOutlined />, [
            getItem("Club list", "clublist"),
        ]),
        ]
    }


    return (
        <Sider
            width={drawerWidth}
            trigger={null}
            collapsible
            collapsed={!isSidebarOpen}
            className={
                !isNonMobile && !isSidebarOpen ? "ant-layout-sider-collapsed" : ""
            }
        >
            <Title
                level={3}
                style={{ textAlign: "center", color: "#fff", marginTop: "30px" }}
            >
                Book over there
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
        </Sider>
    );
};

export default Sidebar;
