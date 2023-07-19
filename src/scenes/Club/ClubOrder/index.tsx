import * as React from "react";
import styled from "styled-components";
import { OrderTable } from "./OrderTable";
import { Button, Row, notification } from "antd";
import { CreateOrderModal } from "./CreateOrderModal";
import dfbServices from "@/services/dfb";
import { BookClubInfo, ClubBookInfos, MemberInfos } from "@/services/types";
import userService from "@/services/user";
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
  const [loading, setLoading] = React.useState(false);
  const [orderIds, setOrderIds] = React.useState<number[]>([]);
  const [openCreateOrderModal, setOpenCreateOrderModal] = React.useState(false);
  const [members, setMembers] = React.useState<MemberInfos[]>([]);
  const [staffClubs, setStaffClubs] = React.useState<BookClubInfo[]>([]);
  const [clubBookInfos, setClubBookInfos] = React.useState<ClubBookInfos[]>([]);
  const { t } = useTranslation();

  const fetchOrderIds = async () => {
    try {
      setLoading(true);
      const _orderIds = await dfbServices.getOrderIds();
      setOrderIds(_orderIds);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const initFetch = async () => {
    try {
      setLoading(true);
      const clubs: BookClubInfo[] = await userService.getStaffClubs();
      setStaffClubs(clubs);
      const allMembers = await dfbServices.getAllMembers();
      setMembers(allMembers);
      const clubBookIds = await dfbServices.getClubBookIds({ clubs: clubs });
      const infos = await dfbServices.getClubBookInfos(clubBookIds);
      setClubBookInfos(infos);
      await fetchOrderIds();
    } catch (err: any) {
      notification.error({ message: err.message });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    initFetch();
  }, []);

  return (
    <StyledClubOrder>
      <Row>
        <Button
          type="primary"
          onClick={() => {
            setOpenCreateOrderModal(true);
          }}
        >
          {t("Create New Order") as string}
        </Button>
      </Row>
      <CreateOrderModal
        members={members}
        clubBookInfos={clubBookInfos}
        staffClubs={staffClubs}
        open={openCreateOrderModal}
        onCancel={() => {
          setOpenCreateOrderModal(false);
        }}
      />
      <OrderTable loading={loading} setLoading={setLoading} orderIds={orderIds} />
    </StyledClubOrder>
  );
};

export default ClubOrder;
