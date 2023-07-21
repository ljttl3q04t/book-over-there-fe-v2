import * as React from "react";
import styled from "styled-components";
import { OrderTable } from "./OrderTable";
import { Button, Form, notification } from "antd";
import { CreateOrderModal } from "./CreateOrderModal";
import { ReturnOrderModal } from "./ReturnOrderModal";
import dfbServices from "@/services/dfb";
import { BookClubInfo, ClubBookInfos, MemberInfos, OrderInfos, getOrderIdsOptions } from "@/services/types";
import userService from "@/services/user";
import { useTranslation } from "react-i18next";
import { DataType } from "./types";
import { useState } from "react";
import dayjs from "dayjs";
import { FilterOrder } from "./FilterOrder";

const StyledClubOrder = styled.div`
  border-radius: 12px;
  padding: 30px;
  background: #fff;
  width: 100%;
  margin-top: 30px;
  > .table-extra-content {
    display: flex;
    gap: 32px;
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
  const [loading, setLoading] = useState(false);
  const [openCreateOrderModal, setOpenCreateOrderModal] = useState(false);
  const [openReturnOrderModal, setOpenReturnOrderModal] = useState(false);
  const [filterData, setFilterData] = useState<getOrderIdsOptions | undefined>(undefined);
  const [members, setMembers] = useState<MemberInfos[]>([]);
  const [staffClubs, setStaffClubs] = useState<BookClubInfo[]>([]);
  const [orderIds, setOrderIds] = useState<number[]>([]);
  const [clubBookInfos, setClubBookInfos] = useState<ClubBookInfos[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [tableData, setTableData] = useState<DataType[]>([]);
  const [selectedRows, setSelectedRows] = useState<DataType[]>([]);

  const [form] = Form.useForm();

  const { t } = useTranslation();

  const fetchOrderIds = async () => {
    try {
      setLoading(true);
      const _orderIds = await dfbServices.getOrderIds();
      setOrderIds(_orderIds);
      if (_orderIds.length > 0) {
        await fetchOrderInfos();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderInfos = async () => {
    try {
      setLoading(true);
      const orderInfos: OrderInfos[] = await dfbServices.getOrderInfos(orderIds);
      const data: DataType[] = [];
      for (const order of orderInfos) {
        for (const orderDetail of order.order_details) {
          if (filterData?.order_status && filterData?.order_status !== orderDetail.order_status) continue;
          data.push({
            orderId: order.id,
            orderDetailId: orderDetail.id,
            bookName: orderDetail.book_name,
            bookCode: orderDetail.book_code,
            memberFullName: order.member.full_name,
            memberCode: order.member.code,
            memberPhoneNumber: order.member.phone_number,
            orderStatus: orderDetail.order_status,
            orderDate: order.order_date,
            returnDate: orderDetail.return_date,
            overdueDay: orderDetail.overdue_day_count ?? 0,
            dueDate: order.due_date,
          });
        }
      }
      const sortedData = [...data].sort((a, b) => {
        const dateComparison = new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
        if (dateComparison === 0) {
          return b.orderDetailId - a.orderDetailId;
        }
        return dateComparison;
      });
      setTableData(sortedData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: any) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(selectedRows);
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

  const handleReturnBooks = async (formData: any) => {
    try {
      setLoading(true);
      const data = {
        order_detail_ids: selectedRowKeys.join(","),
        return_date: dayjs(formData.return_date).format("YYYY-MM-DD"),
      };
      const message = await dfbServices.returnBooks(data);
      notification.success({ message: message, type: "success" });
      await fetchOrderIds();
      setOpenReturnOrderModal(false);
    } catch (error: any) {
      console.error(error);
      notification.error({ message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleQuerySubmit = async () => {
    try {
      setLoading(true);
      const data = await form.validateFields();
      setFilterData(data);
      if (data.order_date) {
        data.order_date = dayjs(data.order_date).format("YYYY-MM-DD");
      }
      const _orderIds = await dfbServices.getOrderIds(data);
      setOrderIds(_orderIds);
    } catch (error: any) {
      notification.error({ message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleQueryCancel = async () => {
    form.resetFields();
  };

  React.useEffect(() => {
    initFetch();
  }, []);

  React.useEffect(() => {
    if (orderIds.length > 0) {
      fetchOrderInfos();
    }
  }, [orderIds]);

  return (
    <StyledClubOrder>
      <FilterOrder
        handleQuerySubmit={handleQuerySubmit}
        handleQueryCancel={handleQueryCancel}
        loading={loading}
        form={form}
      />

      <div className="table-extra-content">
        <Button
          type="primary"
          onClick={() => {
            setOpenCreateOrderModal(true);
          }}
        >
          {t("Create New Order") as string}
        </Button>
        <Button
          onClick={() => setOpenReturnOrderModal(true)}
          type="primary"
          loading={loading}
          disabled={!selectedRowKeys.length}
        >
          {t("Return Book") as string}
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
      <ReturnOrderModal
        open={openReturnOrderModal}
        onCancel={() => setOpenReturnOrderModal(false)}
        handleReturnBooks={handleReturnBooks}
        loading={loading}
        selectedRows={selectedRows}
      ></ReturnOrderModal>
      <OrderTable tableLoading={loading} tableData={tableData} rowSelection={rowSelection} />
    </StyledClubOrder>
  );
};

export default ClubOrder;
