import { Layout } from "antd";
import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Outlet } from "react-router-dom";

import BreadcrumbNav from "@/component/BreadcrumbNav";
import Navbar from "@/component/Navbar";
import Sidebar from "@/component/Sidebar";
import { TopNavbar } from "@/component/TopNavbar";
const { Content } = Layout;

const LayoutCustom = () => {
  const isNonMobile = useMediaQuery({ minWidth: 600 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Layout style={{ height: "100vh" }}>
      <Sidebar
        isNonMobile={isNonMobile}
        drawerWidth="280px"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <Layout>
        <Navbar />
        {/* <TopNavbar /> */}
        <BreadcrumbNav displayPageName={true} />
        <Content style={{ padding: "24px", overflow: "auto" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutCustom;
