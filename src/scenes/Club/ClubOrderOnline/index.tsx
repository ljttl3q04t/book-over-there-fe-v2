import dfbServices from "@/services/dfb";
import { ClubBookInfos, MemberInfos } from "@/services/types";
import { Form, FormInstance, notification } from "antd";
import dayjs from "dayjs";
import * as React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { OnlineOrderTable } from "./OnlineOrderTable";
import { UpdateOnlineOrderModal } from "./UpdateOnlineOrderModal";
import { OnlineOrderTableRow } from "./types";
import { ConfirmModal } from "./ConfirmModal";
import { UserContext } from "@/context/UserContext";

const StyledClubOrder = styled.div`
  border-radius: 12px;
  padding: 30px;
  background: #fff;
  width: 100%;
  margin-top: 30px;
  > .table-extra-content {
    display: flex;
    flex-direction: column;
    /* gap: 32px; */
    padding: 20px 0;
    h1 {
      font-size: 24px;
    }
    a {
      font-size: 18px;
      margin-top: 2px;
    }
  }
`;

const ClubOrderOnline = () => {
  const [loading, setLoading] = React.useState(false);
  const [openUpdateModal, setOpenUpdateModal] = React.useState(false);
  const [openConfirmModal, setOpenConfirmModal] = React.useState(false);
  const [tableData, setTableData] = React.useState<OnlineOrderTableRow[]>([]);
  const [currentOrder, setCurrentOrder] = React.useState<any>(undefined);
  const [clubBookInfos, setClubBookInfos] = React.useState<ClubBookInfos[]>([]);

  const [updateOrderForm] = Form.useForm();
  const updateOrderFormRef = React.useRef<FormInstance>(updateOrderForm);

  const [confirmOrderForm] = Form.useForm();
  const confirmOrderFormRef = React.useRef<FormInstance>(confirmOrderForm);

  const { t } = useTranslation();
  const { currentClubId } = React.useContext(UserContext);

  const handleEditOnClick = (row: any) => {
    setCurrentOrder(row);
    setOpenUpdateModal(true);
  };

  const handleConfirmOnClick = (row: any) => {
    setCurrentOrder(row);
    setOpenConfirmModal(true);
  };

  const handleUpdateModalCancel = () => {
    setOpenUpdateModal(false);
  };

  const handleSubmitUpdateOrder = async () => {
    try {
      const values: any = await updateOrderForm.validateFields();
      if (!currentOrder) return;
      const updateData: any = { draft_order_id: currentOrder.id };
      values.orderDate = dayjs(values.orderDate?.toDate()).format("YYYY-MM-DD");
      values.dueDate = dayjs(values.dueDate?.toDate()).format("YYYY-MM-DD");
      for (const [k, v] of Object.entries(values)) {
        if (v !== currentOrder[k]) {
          updateData[k] = v;
        }
      }
      const options: any = { draft_order_id: updateData.draft_order_id, club_id: currentClubId };
      if (updateData.phoneNumber) options.phone_number = updateData.phoneNumber;
      if (updateData.fullName) options.full_name = updateData.fullName;
      if (updateData.orderDate) options.order_date = updateData.orderDate;
      if (updateData.dueDate) options.due_date = updateData.dueDate;
      if (updateData.address) options.address = updateData.address;
      if (updateData.select_books) options.club_book_ids = updateData.select_books.join(",");
      const message = await dfbServices.updateDraftOrder(options);
      notification.success({ message: message, type: "success" });
    } catch (error: any) {
      const errorMessage = error.message || "An error occurred while updating the member.";
      notification.error({ message: errorMessage });
    }
  };

  const handleSubmitConfirmOrder = async () => {
    try {
      const data: any = {
        draft_id: currentOrder.id,
        order_date: currentOrder.orderDate,
        due_date: currentOrder.dueDate,
        club_book_ids: currentOrder.books.map((b: any) => b.id).join(","),
        club_id: currentClubId,
      };
      if (currentOrder.member) {
        (data.club_id = currentOrder.member.clubId), (data.member_id = currentOrder.member.id);
        const message = await dfbServices.createOrderFromDraft(data);
        notification.success({ message: message, type: "success" });
      } else {
        const values: any = await confirmOrderForm.validateFields();
        data.new_member = {
          code: values.memberCode,
          phone_number: currentOrder.phoneNumber,
          full_name: currentOrder.fullName,
          club_id: currentClubId,
        };
        const message = await dfbServices.createOrderFromDraftForNewMember(data);
        notification.success({ message: message, type: "success" });
      }
    } catch (error: any) {
      console.error(error);
      notification.error({ message: t(error.message) as string });
    }
  };

  const fetchMemberIds = async () => {
    try {
      setLoading(true);
      const memberIds = await dfbServices.getMemberIds(currentClubId ?? 0);
      let memberInfos = [];
      if (memberIds.length > 0) {
        memberInfos = await fetchMemberInfos(memberIds);
      }
      return memberInfos;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMemberInfos = async (memberIds: number[]) => {
    const data: any = [];
    try {
      const memberInfos: MemberInfos[] = await dfbServices.getMemberInfos(currentClubId ?? 0, memberIds);
      for (const member of memberInfos) {
        data.push({
          id: member.id,
          fullName: member.full_name,
          code: member.code,
          phoneNumber: member.phone_number,
          clubId: member.club_id,
          notes: member.notes ?? "",
        });
      }
    } catch (error) {
      console.error(error);
    }
    return data;
  };

  const initFetch = async () => {
    try {
      setLoading(true);
      const clubBookIds = await dfbServices.getClubBookIds(currentClubId ?? 0);
      const clubBookInfos = await dfbServices.getClubBookInfos(clubBookIds);
      setClubBookInfos(clubBookInfos);

      const memberInfos = await fetchMemberIds();
      const mapPhone: any = {};
      for (const memberInfo of memberInfos) {
        mapPhone[memberInfo.phoneNumber] = memberInfo;
      }
      const draftOrderIds = await dfbServices.getDraftOrderIds(currentClubId);
      const data = await dfbServices.getDraftOrderInfos(currentClubId, draftOrderIds);
      const mapBooks: Record<number, ClubBookInfos> = {};
      clubBookInfos.forEach((b) => {
        mapBooks[b.id] = b;
      });
      const _tableData: OnlineOrderTableRow[] = [];
      for (const d of data) {
        _tableData.push({
          id: d.id,
          books: d.club_book_ids.map((id) => mapBooks[id]),
          fullName: d.full_name,
          phoneNumber: d.phone_number,
          address: d.address,
          orderDate: d.order_date,
          dueDate: d.due_date,
          draftStatus: d.draft_status,
          member: mapPhone[d.phone_number],
        });
      }
      const sortedData = [..._tableData].sort((a, b) => {
        const dateComparison = new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
        if (dateComparison === 0) {
          return b.id - a.id;
        }
        return dateComparison;
      });
      setTableData(sortedData);
    } catch (err: any) {
      notification.error({ message: err.message });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    initFetch();
  }, [currentClubId]);

  return (
    <StyledClubOrder>
      <OnlineOrderTable
        tableLoading={loading}
        tableData={tableData}
        handleEditOnClick={handleEditOnClick}
        handleConfirmOnClick={handleConfirmOnClick}
        handleOrderConfirm={() => {
          setOpenConfirmModal(true);
        }}
      />
      <UpdateOnlineOrderModal
        open={openUpdateModal}
        onCancel={handleUpdateModalCancel}
        onRefresh={() => {
          initFetch();
        }}
        currentOrder={currentOrder}
        form={updateOrderForm}
        formRef={updateOrderFormRef}
        handleSubmitUpdateOrder={handleSubmitUpdateOrder}
        clubBookInfos={clubBookInfos}
      />
      <ConfirmModal
        open={openConfirmModal}
        onCancel={() => {
          setOpenConfirmModal(false);
        }}
        currentOrder={currentOrder}
        form={confirmOrderForm}
        formRef={confirmOrderFormRef}
        onRefresh={() => {
          initFetch();
        }}
        handleSubmitConfirmOrder={handleSubmitConfirmOrder}
      />
    </StyledClubOrder>
  );
};

export default ClubOrderOnline;
