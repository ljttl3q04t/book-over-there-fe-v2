import styled from "styled-components";
import { MemberTable } from "./MemberTable";
import { Button, notification } from "antd";
import { CreateMemberModal } from "./CreateMemberModal";
import userService from "@/services/user";
import { BookClubInfo, MemberInfos } from "@/services/types";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import dfbServices from "@/services/dfb";
import { useTranslation } from "react-i18next";

const StyledClubOrder = styled.div`
  border-radius: 12px;
  padding: 30px;
  background: #fff;
  width: 100%;
  margin-top: 30px;
  > .table-extra-content {
    display: flex;
    justify-content: space-between;
    padding: 20px 0;
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
type DataType = {
  id: number;
  fullName: string;
  code: string;
  phoneNumber: string;
};

const ClubMember = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [openCreateModal, setOpenCreateMOdal] = useState(false);
  const [staffClubs, setStaffClubs] = useState<BookClubInfo[]>([]);
  const [tableData, setTableData] = useState<DataType[]>([]);

  const fetchInit = async () => {
    try {
      setLoading(true);
      const clubs: BookClubInfo[] = await userService.getStaffClubs();
      setStaffClubs(clubs);
    } catch (error: any) {
      notification.error({ message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const fetchMemberIds = async () => {
    try {
      setTableLoading(true);
      const memberIds = await dfbServices.getMemberIds();
      if (memberIds.length > 0) {
        await fetchMemberInfos(memberIds);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setTableLoading(false);
    }
  };

  const fetchMemberInfos = async (memberIds: number[]) => {
    try {
      const memberInfos: MemberInfos[] = await dfbServices.getMemberInfos(memberIds);
      const data: DataType[] = [];
      for (const member of memberInfos) {
        data.push({
          id: member.id,
          fullName: member.full_name,
          code: member.code,
          phoneNumber: member.phone_number,
        });
      }
      setTableData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMemberIds();
  }, []);

  useEffect(() => {
    fetchInit();
  }, []);

  return (
    <StyledClubOrder>
      <div className="table-extra-content">
        <Button
          type="primary"
          icon={<PlusCircleOutlined />}
          onClick={() => {
            setOpenCreateMOdal(true);
          }}
        >
          {t("Add New Member") as string}
        </Button>
      </div>

      <CreateMemberModal
        fetchMemberIds={fetchMemberIds}
        open={openCreateModal}
        staffClubs={staffClubs}
        onCancel={() => {
          setOpenCreateMOdal(false);
        }}
      />
      <MemberTable onRefresh={fetchMemberIds} tableData={tableData} tableLoading={loading && tableLoading} />
    </StyledClubOrder>
  );
};

export default ClubMember;
