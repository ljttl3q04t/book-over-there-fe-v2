import React, { useCallback, useEffect, useState, useRef } from "react";
import Table, { ColumnType, ColumnsType } from "antd/es/table";
import styled from "styled-components";
import ClubService, { UpdateMemberClubForm } from "@/services/club";
import { SearchOutlined } from "@ant-design/icons";

import { Button, Input, InputRef, Space, Tag, notification } from "antd";
import dayjs from "dayjs";
import { FilterConfirmProps } from "antd/es/table/interface";
import { getColumnSearchProps } from "@/helpers/CommonTable";

const StyledClubStaffList = styled.div`
  border-radius: 12px;
  padding: 30px;
  background: #fff;
  width: 100%;
  margin-top: 70px;
`;
type MemberStatus = "active" | "pending";
const statusColors = {
  active: "green",
  pending: "geekblue",
};
const MEMBER_STATUS = {
  ACTIVE: "active",
  PENDING: "pending",
};
interface DataType {
  no: number;
  bookClubName: string;
  memberName: string;
  memberStatus: string;
  memberEmail: string;
  memberPhone: string;
  memberAvatar: string;
  createdAt: string;
  joinedAt: string;
  leaveAt: string;
  isStaff: boolean;
  membershipId: number;
}
type DataIndex = keyof DataType;

const ClubStaff = () => {
  const [loading, setLoading] = useState(false);
  const [clubMemberList, setClubMemberList] = useState([]);
  const [clubMemberTableSource, setClubMemberTableSource] = useState<DataType[]>([]);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const initFetch = useCallback(async () => {
    setLoading(true);
    ClubService.getClubMemberList()
      .then((response) => {
        if (response.data) {
          setClubMemberList(response.data);
          const data = response.data.map((item: any, index: any) => {
            return {
              no: index + 1,
              bookClubName: item.book_club.name,
              memberName: item.member.full_name,
              memberStatus: item.member_status,
              memberEmail: item.member.email,
              memberPhone: item.member.phone,
              memberAvatar: item.member.avatar_url,
              createdAt: dayjs(item.created_at).format("YYYY-MM-DD"),
              joinedAt: dayjs(item.joined_at).format("YYYY-MM-DD"),
              leaveAt: item.leaved_at && dayjs(item.leaved_at).format("YYYY-MM-DD"),
              isStaff: item.is_staff,
              membershipId: item.id,
            };
          });
          setClubMemberTableSource(data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  const handleApproveMember = useCallback(async (item: DataType) => {
    const updateMemberForm: UpdateMemberClubForm = {
      membership_id: item.membershipId,
      member_status: MEMBER_STATUS.ACTIVE,
    };
    ClubService.updateMemberClub(updateMemberForm)
      .then((response) => {
        notification.success({
          message: "Approve successfully!",
          type: "success",
        });
        initFetch();
      })
      .catch((error) => {
        notification.error({
          message: `Approve failed, please try again!`,
          type: "error",
        });
      })
      .finally(() => {});
  }, []);
  useEffect(() => {
    initFetch();
  }, []);
  const memberStatusMapping = (status: MemberStatus) => {
    return (
      <Tag color={statusColors[status]} key={status}>
        {status.toUpperCase()}
      </Tag>
    );
  };
  const memberStaffMapping = (isStaff: boolean) => {
    const color = isStaff ? "green" : "volcano";
    return <Tag color={color}>{isStaff ? "Yes" : "No"}</Tag>;
  };
  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };
  
  const columns: ColumnsType<DataType> = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
    },
    {
      title: "Club Name",
      dataIndex: "bookClubName",
      key: "bookClubName",
      ...getColumnSearchProps("bookClubName",searchInput,
       searchText,setSearchText, searchedColumn, setSearchedColumn,
        handleReset,handleSearch ),
    },
    {
      title: "Member Name",
      dataIndex: "memberName",
      key: "memberName",
      ...getColumnSearchProps("memberName",searchInput,
      searchText,setSearchText, searchedColumn, setSearchedColumn,
       handleReset,handleSearch),
    },
    {
      title: "Member Status",
      dataIndex: "",
      key: "",
      render: (item: any) => {
        return memberStatusMapping(item.memberStatus);
      },
    },
    {
      title: "Created Date",
      key: "createdAt",
      dataIndex: "createdAt",
    },
    {
      title: "Joined Date",
      key: "joinedAt",
      dataIndex: "joinedAt",
    },
    {
      title: "Leave Date",
      key: "leaveAt",
      dataIndex: "leaveAt",
    },
    {
      title: "Staff",
      key: "",
      dataIndex: "",
      render: (item: any) => {
        return memberStaffMapping(item.isStaff);
      },
    },
    {
      title: "Action",
      key: "",
      dataIndex: "",
      fixed: "right",
      render: (item: DataType) => {
        return (
          <>
            {item.memberStatus === MEMBER_STATUS.PENDING && (
              <Button type="primary" onClick={() => handleApproveMember(item)}>
                Approve
              </Button>
            )}
          </>
        );
      },
    },
  ];
  return (
    <StyledClubStaffList>
      <Table loading={loading} columns={columns} dataSource={clubMemberTableSource} />
    </StyledClubStaffList>
  );
};

export default ClubStaff;
