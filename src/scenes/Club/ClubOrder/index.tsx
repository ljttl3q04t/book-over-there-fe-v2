import * as React from "react";
import styled from "styled-components";
import { OrderTable } from "./OrderTable";
import { Button, notification } from "antd";
import { CreateOrderModal } from "./CreateOrderModal";
import dfbServices from "@/services/dfb";
import { BookClubInfo, ClubBookInfos, MemberInfos, OrderInfos } from "@/services/types";
import userService from "@/services/user";
import { useTranslation } from "react-i18next";
import { DataType } from "./types";

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

const ClubOrder = () => {
  const [loading, setLoading] = React.useState(false);
  const [openCreateOrderModal, setOpenCreateOrderModal] = React.useState(false);
  const [members, setMembers] = React.useState<MemberInfos[]>([]);
  const [staffClubs, setStaffClubs] = React.useState<BookClubInfo[]>([]);
  const [clubBookInfos, setClubBookInfos] = React.useState<ClubBookInfos[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);
  const [tableData, setTableData] = React.useState<DataType[]>([]);
  const { t } = useTranslation();

  const fetchOrderIds = async () => {
    try {
      setLoading(true);
      const _orderIds = await dfbServices.getOrderIds();
      if (_orderIds.length > 0) {
        await fetchOrderInfos(_orderIds);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchOrderInfos = async (orderIds: number[]) => {
    try {
      setLoading(true);
      const orderInfos: OrderInfos[] = await dfbServices.getOrderInfos(orderIds);
      const data: DataType[] = [];
      for (const order of orderInfos) {
        for (const orderDetail of order.order_details) {
          data.push({
            orderId: order.id,
            orderDetailId: orderDetail.id,
            bookName: orderDetail.book_name,
            bookCode: orderDetail.book_code,
            memberFullName: order.member.full_name,
            memberCode: order.member.code,
            orderStatus: orderDetail.order_status,
            orderDate: order.order_date,
            returnDate: orderDetail.return_date,
            overdueDay: orderDetail.overdue_day_count ?? 0,
            dueDate: order.due_date,
          });
        }
      }
      setTableData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record: DataType) => ({
      disabled: record.orderStatus === "complete", // Column configuration not to be checked
      name: record.orderStatus,
    }),
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
  const handleReturnBooks = async () => {
    try {
      setLoading(true);
      const data = {
        order_detail_ids: selectedRowKeys.join(","),
      };
      const message = await dfbServices.returnBooks(data);
      notification.success({ message: message, type: "success" });
    } catch (error: any) {
      console.error(error);
      notification.error({ message: error.message });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    initFetch();
  }, []);

  return (
    <StyledClubOrder>
      <div className="table-extra-content">
        <Button
          type="primary"
          onClick={() => {
            setOpenCreateOrderModal(true);
          }}
        >
          {t("Create New Order") as string}
        </Button>
        <Button onClick={handleReturnBooks} type="primary" loading={loading} disabled={!selectedRowKeys.length}>
          Return Book
        </Button>
      </div>
      <CreateOrderModal
        members={members}
        clubBookInfos={clubBookInfos}
        staffClubs={staffClubs}
        open={openCreateOrderModal}
        onCancel={() => {
          setOpenCreateOrderModal(false);
        }}
        onRefresh={async () => {
          await fetchOrderIds();
        }}
      />
      <OrderTable tableLoading={loading} tableData={tableData} rowSelection={rowSelection} />
    </StyledClubOrder>
  );
};

export default ClubOrder;
