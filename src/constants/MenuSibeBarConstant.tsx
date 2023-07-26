import {
  BookOutlined,
  CheckCircleOutlined,
  HistoryOutlined,
  HomeOutlined,
  MessageOutlined,
  TeamOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { MenuProps } from "antd";
import { getAccessToken } from "../http-common";
import MenuItem from "antd/es/menu/MenuItem";
import React from "react";

const menuStructure = {
  commonItems: [
    {
      label: "Home Page",
      key: "",
      icon: <HomeOutlined />,
    },
    {
      label: "Checkout",
      key: "checkout",
      icon: <CheckCircleOutlined />,
    },
  ],
  userItems: [
    {
      label: "Club",
      key: "sub1",
      icon: <TeamOutlined />,
      children: [
        {
          label: "Club list",
          key: "clublist",
        },
        {
          label: "Club book",
          key: "clubbook",
        },
        {
          label: "Club staff",
          key: "clubstaff",
        },
      ],
    },
    {
      label: "User",
      key: "sub0",
      icon: <UserOutlined />,
      children: [
        {
          label: "My Account",
          key: "sub3",
          icon: <UserOutlined />,
          children: [
            {
              label: "Personal profile",
              key: "my-profile",
            },
            {
              label: "Payment",
              key: "payment",
            },
            {
              label: "Transaction history",
              key: "transactionhistory",
            },
          ],
        },
        {
          label: "Book Status",
          key: "sub2",
          icon: <BookOutlined />,
          children: [
            {
              label: "My book",
              key: "my-book",
            },
            {
              label: "Book borrow",
              key: "book-borrow",
            },
          ],
        },
        {
          label: "Book History",
          key: "book-history",
          icon: <HistoryOutlined />,
        },
      ],
    },
    {
      label: "Support",
      key: "support",
      icon: <MessageOutlined />,
    },
  ],
  guestItems: [
    {
      label: "Club",
      key: "sub1",
      icon: <TeamOutlined />,
      children: [
        {
          label: "Club list",
          key: "clublist",
        },
      ],
    },
    {
      label: "Support",
      key: "support",
      icon: <MessageOutlined />,
    },
  ],
};

export const createMenuItems = (isStaff: any): MenuProps["items"] => {
  const { commonItems, userItems, guestItems } = menuStructure;

  const userMenuItems: MenuItem[] = userItems;
  if (getAccessToken()) {
    if (isStaff) {
      const clubStaffMenuItem: MenuItem = {
        label: "Club staff",
        key: "clubstaff",
      };

      // Add the "Club staff" menu item as a child of the "Club" menu item
      const clubMenuItem = userMenuItems.find((item) => item.key === "sub1");
      if (clubMenuItem && Array.isArray(clubMenuItem.children)) {
        clubMenuItem.children.push(clubStaffMenuItem);
      }
    }
  }

  const items: MenuProps["items"] = [...commonItems, ...(getAccessToken() ? userMenuItems : guestItems)];

  return items;
};
