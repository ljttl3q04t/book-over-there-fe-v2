import * as React from "react";
import { Breadcrumb } from "antd";
import { Link, useLocation, matchPath } from "react-router-dom";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

const StyledBreadCrumb = styled.div`
  padding: 10px 30px 10px;
  background: transparent;
  > .page-title {
    padding: 10px 0;
    font-weight: 700;
    font-size: 25px;
    line-height: 20px;
    margin-top: 4px;
  }
`;
const breadcrumbItems = [
  { path: "/", breadcrumbName: "homePage.home" },
  { path: "/checkout", breadcrumbName: "Checkout" },
  { path: "/support", breadcrumbName: "Support" },
  { path: "/book-detail/:id", breadcrumbName: "Book Detail" },
  { path: "/clublist", breadcrumbName: "Club List" },
  { path: "/clubstaff", breadcrumbName: "Club Staff" },
  { path: "/clubbook", breadcrumbName: "Club Book" },
  { path: "/bookclub", breadcrumbName: "Club Book" },
  { path: "/my-profile", breadcrumbName: "My Profile" },
  { path: "/payment", breadcrumbName: "Payment" },
  { path: "/transactionhistory", breadcrumbName: "Transaction History" },
  { path: "/my-book", breadcrumbName: "My Book" },
  { path: "/book-history", breadcrumbName: "Book History" },
  { path: "/book-borrow", breadcrumbName: "Book Borrow" },
];

const BreadcrumbNav = ({ displayPageName }: any) => {
  const { t } = useTranslation();
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const breadcrumbItem = breadcrumbItems.find((item) => {
    const match = matchPath(location.pathname, item.path);
    return match ? true : false;
  });

  const pageName = breadcrumbItem ? t(breadcrumbItem.breadcrumbName) : "";
  return (
    <StyledBreadCrumb>
      <Breadcrumb>
        {!displayPageName &&
          pathSegments.map((segment, index) => {
            const path = `/${pathSegments.slice(1, index + 1).join("/")}`;
            const breadcrumbItem = breadcrumbItems.find((item) => {
              const match = matchPath(path, item.path); // Update this line
              return match ? true : false;
            });

            if (breadcrumbItem) {
              return (
                <Breadcrumb.Item key={path}>
                  <Link to={path}>
                    <>{t(breadcrumbItem.breadcrumbName)}</>
                  </Link>
                </Breadcrumb.Item>
              );
            } else {
              return null;
            }
          })}
      </Breadcrumb>
      {displayPageName && <h1 className="page-title">{pageName}</h1>}
    </StyledBreadCrumb>
  );
};

export default BreadcrumbNav;
