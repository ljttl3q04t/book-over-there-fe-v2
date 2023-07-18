import * as React from "react";
import styled from "styled-components";
import { OrderTable } from "./OrderTable";
import { Button, notification } from "antd";
import { CreateOrderModal } from "./CreateOrderModal";
import dfbServices from "@/services/dfb";
import { BookClubInfo, ClubBookInfos, MemberInfos } from "@/services/types";
import userService from "@/services/user";

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

const ClubOrder = () => {
  const [openCreateOrderModal, setOpenCreateOrderModal] = React.useState(false);
  const [members, setMembers] = React.useState<MemberInfos[]>([]);
  const [staffClubs, setStaffClubs] = React.useState<BookClubInfo[]>([]);
  const [clubBookInfos, setClubBookInfos] = React.useState<ClubBookInfos[]>([]);

  const initFetch = async () => {
    try {
      const clubs: BookClubInfo[] = await userService.getStaffClubs();
      setStaffClubs(clubs);
      const allMembers = await dfbServices.getAllMembers();
      setMembers(allMembers);
      const clubBookIds = await dfbServices.getClubBookIds({ clubs: clubs });
      const infos = await dfbServices.getClubBookInfos(clubBookIds);
      setClubBookInfos(infos);
    } catch (err: any) {
      notification.error({ message: err.message });
    }
  };

  React.useEffect(() => {
    initFetch();
  }, []);

  return (
    <StyledClubOrder>
      <Button
        type="primary"
        onClick={() => {
          setOpenCreateOrderModal(true);
        }}
      >
        {"Create New Order"}
      </Button>
      <CreateOrderModal
        members={members}
        clubBookInfos={clubBookInfos}
        staffClubs={staffClubs}
        open={openCreateOrderModal}
        onCancel={() => {
          setOpenCreateOrderModal(false);
        }}
      />
      <OrderTable />
    </StyledClubOrder>
  );
};

export default ClubOrder;
