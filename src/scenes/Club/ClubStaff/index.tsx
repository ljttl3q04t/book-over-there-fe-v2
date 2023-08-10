import { useCallback, useEffect, useState, useRef, useContext } from "react";
import Table, { ColumnsType } from "antd/es/table";

import styled from "styled-components";
import ClubService, { UpdateMemberClubForm } from "@/services/club";
import dayjs from "dayjs";
import { Button, Tag, notification } from "antd";
import { useTranslation } from "react-i18next";
import { UserContext } from "@/context/UserContext";

const StyledClubStaffList = styled.div`
  border-radius: 12px;
  padding: 30px;
  background: #fff;
  width: 100%;
  margin-top: 30px;
  > .table-extra-content {
    padding: 20px 10px 30px 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    h1 {
      font-size: 24px;
    }
    a {
      font-size: 18px;
      margin-top: 2px;
    }
  }
`;
type MemberStatus = "active" | "pending";
const MEMBER_STATUS = {
  ACTIVE: "active",
  PENDING: "pending",
};
const statusColors = {
  active: "green",
  pending: "geekblue",
};

interface DataType {
  id: number;
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

const ClubStaff = () => {
  const [loading, setLoading] = useState(false);
  const [clubMemberTableSource, setClubMemberTableSource] = useState<DataType[]>([]);
  const bookClubName = useRef<string>("");
  const { isClubAdmin, currentClubId } = useContext(UserContext);

  const { t } = useTranslation();

  const handleUpdateMember = async (record: any, action: "approve" | "setStaff" | "revoke", isStaff?: boolean) => {
    try {
      setLoading(true);
      const updateMemberForm: UpdateMemberClubForm = {
        club_id: currentClubId,
        membership_id: record.membershipId,
      };
      if (action === "approve") {
        updateMemberForm.member_status = MEMBER_STATUS.ACTIVE;
      } else if (action === "setStaff") {
        updateMemberForm.is_staff = isStaff;
      } else {
        updateMemberForm.is_staff = false;
      }
      const message = await ClubService.updateMemberClub(updateMemberForm);
      notification.success({ message: t(message) as string, type: "success" });
      initFetch();
    } catch (error: any) {
      notification.error({ message: t(error.message) as string });
    } finally {
      setLoading(false);
    }
  };

  const initFetch = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ClubService.getClubMemberList(currentClubId ?? 0);
      const tableData = data.map((item: any) => {
        return {
          id: item.id,
          bookClubName: item.book_club.name,
          memberName: item.member.full_name,
          memberStatus: item.member_status,
          memberEmail: item.member.email,
          memberPhone: item.member.phone_number,
          memberAvatar: item.member.avatar_url,
          createdAt: dayjs(item.created_at).format("YYYY-MM-DD"),
          joinedAt: dayjs(item.joined_at).format("YYYY-MM-DD"),
          leaveAt: item.leaved_at && dayjs(item.leaved_at).format("YYYY-MM-DD"),
          isStaff: item.is_staff,
          membershipId: item.id,
        };
      });
      bookClubName.current = tableData[0]?.bookClubName;
      setClubMemberTableSource(tableData);
    } catch (error: any) {
      if (error.values === undefined) {
        const errorMessage = t(error.message || "An error occurred") as string;
        notification.error({ message: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initFetch();
  }, [currentClubId]);

  const memberStatusMapping = (status: MemberStatus) => {
    return (
      <Tag color={statusColors[status]} key={status}>
        {(t(status) as string).toUpperCase()}
      </Tag>
    );
  };

  const memberStaffMapping = (isStaff: boolean) => {
    const color = isStaff ? "green" : "volcano";
    return <Tag color={color}>{isStaff ? "Yes" : "No"}</Tag>;
  };

  const columns: ColumnsType<DataType> = [
    {
      title: t("ID") as string,
      dataIndex: "id",
      key: "id",
      width: "8%",
    },
    {
      title: t("Member Name") as string,
      dataIndex: "memberName",
      key: "memberName",
      width: "20%",
    },
    {
      title: t("Member Status") as string,
      dataIndex: "",
      key: "memberStatus",
      width: "10%",
      render: (item: any) => {
        return memberStatusMapping(item.memberStatus);
      },
    },
    {
      title: t("Joined Date") as string,
      width: "15%",
      key: "joinedAt",
      dataIndex: "joinedAt",
    },
    {
      title: t("Leave Date") as string,
      width: "15%",
      key: "leaveAt",
      dataIndex: "leaveAt",
    },
    {
      title: t("Staff") as string,
      key: "isStaff",
      dataIndex: "isStaff",
      width: "10%",
      render: (item: any) => {
        return memberStaffMapping(item);
      },
    },
    {
      title: t("Action") as string,
      key: "action",
      dataIndex: "action",
      width: "20%",
      render: (_item, record) => {
        return (
          <>
            {record?.memberStatus === MEMBER_STATUS.PENDING && (
              <Button
                type="primary"
                onClick={() => {
                  handleUpdateMember(record, "approve");
                }}
                loading={loading}
              >
                {t("Approve") as string}
              </Button>
            )}
            {isClubAdmin && !record.isStaff && record?.memberStatus === MEMBER_STATUS.ACTIVE && (
              <Button
                type="primary"
                onClick={() => {
                  handleUpdateMember(record, "setStaff", !record.isStaff);
                }}
                loading={loading}
              >
                {t("Staff") as string}
              </Button>
            )}
            {isClubAdmin && record?.memberStatus === MEMBER_STATUS.ACTIVE && record.isStaff == true && (
              <Button
                type="primary"
                onClick={() => {
                  handleUpdateMember(record, "revoke", false);
                }}
                loading={loading}
              >
                {t("Revoke") as string}
              </Button>
            )}
          </>
        );
      },
    },
  ];

  return (
    <StyledClubStaffList>
      <div className="table-extra-content">
        <h1>{bookClubName.current}</h1>
      </div>

      <Table
        scroll={{ x: "max-content" }}
        loading={loading}
        columns={columns}
        dataSource={clubMemberTableSource.sort((a, b) => b.id - a.id)}
        bordered
      />
    </StyledClubStaffList>
  );
};

export default ClubStaff;
