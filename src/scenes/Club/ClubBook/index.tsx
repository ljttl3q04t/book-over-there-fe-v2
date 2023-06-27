import React, { useCallback, useEffect, useState } from "react";
import Table, { ColumnsType } from "antd/es/table";
import styled from "styled-components";
import ClubService from "@/services/club";
import { Button } from "antd";
const StyledClubBookList = styled.div`
  border-radius: 12px;
  padding: 30px;
  background: #fff;
  width: 100%;
  margin-top: 70px;
`;

const ClubBook = () => {
  const [loading, setLoading] = useState(false);
  const [clubBookList, setClubBookList] = useState([]);
  const initFetch = useCallback(async () => {
    setLoading(true);
    ClubService.getClubBookList()
      .then((response) => {
        if (response.data) {
          const data = response.data.map((item: any, index: any) => {
            return { no: index + 1, ...item };
          });
          setClubBookList(data);
          console.log(response);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    initFetch();
  }, []);
  const handleOrder = (item: any) => {};
  const columns: ColumnsType<any> = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Created Date",
      key: "created_at",
      dataIndex: "created_at",
      // render: (value: any) => {
      //   return dayjs(value).format("DD-MM-YYYY");
      // },
    },
    {
      title: "Total member",
      key: "total_member_count",
      dataIndex: "total_member_count",
    },
    {
      title: "Total book count",
      key: "total_book_count",
      dataIndex: "total_book_count",
    },
    {
      title: "Action",
      key: "",
      dataIndex: "",
      render: (_values: any) => {
        return (
          <>
            <Button type="primary" onClick={() => handleOrder(_values)}>
              Join Club
            </Button>
          </>
        );
      },
    },
  ];
  return <StyledClubBookList>ClubBook</StyledClubBookList>;
};

export default ClubBook;
