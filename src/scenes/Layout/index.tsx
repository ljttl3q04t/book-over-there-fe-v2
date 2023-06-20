import { Divider, Layout } from "antd";
import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Outlet } from "react-router-dom";

import Navbar from "../../component/Navbar";
import Sidebar from "../../component/Sidebar";

const { Content } = Layout;

const LayoutCustom = () => {
  const isNonMobile = useMediaQuery({ minWidth: 600 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <Layout style={{ height: "100vh" }}>
      <Sidebar
        isNonMobile={isNonMobile}
        drawerWidth="280px"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <Layout>
        <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <Divider style={{ margin: "0", boxShadow: "rgb(0 0 0 / 12%) 0px 3px 4px" }} />
        <Content style={{ padding: "24px", overflow: "auto" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutCustom;
