import * as React from "react";
import styled from "styled-components";
import { MemberTable } from "./MemberTable";
import { Button, notification } from "antd";
import { CreateMemberModal } from "./CreateMemberModal";
import userService from "@/services/user";
import { BookClubInfo } from "@/services/types";

const StyledClubOrder = styled.div`
  border-radius: 12px;
  padding: 30px;
  background: #fff;
  width: 100%;
  margin-top: 30px;
  > .table-extra-content {
    display: flex;
    justify-content: space-between;
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

const ClubMember = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = React.useState(false);
  const [openCreateModal, setOpenCreateMOdal] = React.useState(false);
  const [staffClubs, setStaffClubs] = React.useState<BookClubInfo[]>([]);

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

  React.useEffect(() => {
    fetchInit();
  }, []);

  return (
    <StyledClubOrder>
      <Button
        type="primary"
        onClick={() => {
          setOpenCreateMOdal(true);
        }}
      >
        {"Create New Member"}
      </Button>
      <CreateMemberModal
        {...{
          open: openCreateModal,
          staffClubs,
          onCancel: () => {
            setOpenCreateMOdal(false);
          },
        }}
      />
      <MemberTable />
    </StyledClubOrder>
  );
};

export default ClubMember;
