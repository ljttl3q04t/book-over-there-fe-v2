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

const ClubStaff = () => {
  const [loading, setLoading] = useState(false);
  const [clubMemberTableSource, setClubMemberTableSource] = useState<DataType[]>([]);
  const bookClubName = useRef<string>("");
  const { user } = useContext(UserContext);

  const { t } = useTranslation();

  const handleUpdateMember = async (record: any, action: "approve" | "setStaff", isStaff?: boolean) => {
    try {
      setLoading(true);
      const updateMemberForm: UpdateMemberClubForm = {
        membership_id: record.membershipId,
      };
      if (action === "approve") {
        updateMemberForm.member_status = MEMBER_STATUS.ACTIVE;
      } else {
        updateMemberForm.is_staff = isStaff;
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
    setLoading(true);
    ClubService.getClubMemberList()
      .then((response) => {
        if (response.data) {
          const data = response.data.map((item: any, index: any) => {
            return {
              no: index + 1,
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
          bookClubName.current = data[0]?.bookClubName;
          setClubMemberTableSource(data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    initFetch();
  }, []);

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
      title: t("No.") as string,
      dataIndex: "no",
      key: "no",
      width: "10%",
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
            {user?.is_club_admin && record?.memberStatus === MEMBER_STATUS.ACTIVE && record.isStaff == false && (
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
        dataSource={clubMemberTableSource}
        bordered
      />
    </StyledClubStaffList>
  );
};

export default ClubStaff;
