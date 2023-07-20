import * as React from "react";
import styled from "styled-components";
import { OrderTable } from "./OrderTable";
import { Button, DatePicker, Row, Select, notification } from "antd";
import { CreateOrderModal } from "./CreateOrderModal";
import { ReturnOrderModal } from "./ReturnOrderModal";
import dfbServices from "@/services/dfb";
import { BookClubInfo, ClubBookInfos, MemberInfos, OrderInfos } from "@/services/types";
import userService from "@/services/user";
import { useTranslation } from "react-i18next";
import { DataType, ORDER_STATUS_LIST } from "./types";
import { useState } from "react";
import dayjs from "dayjs";
import { dateFormatList } from "@/helpers/DateHelper";

const { RangePicker } = DatePicker;

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
  const [members, setMembers] = useState<MemberInfos[]>([]);
  const [staffClubs, setStaffClubs] = useState<BookClubInfo[]>([]);
  const [clubBookInfos, setClubBookInfos] = useState<ClubBookInfos[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [tableData, setTableData] = useState<DataType[]>([]);
  const [selectedRows, setSelectedRows] = useState<DataType[]>([]);

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
            memberPhoneNumber: order.member.phone_number,
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

  React.useEffect(() => {
    initFetch();
  }, []);

  return (
    <StyledClubOrder>
      <Row className="table-extra-content">
        <Select
          style={{ width: "12%" }}
          placeholder={t("Order Status") as string}
          filterOption={(input, option: any) =>
            (option?.children ?? "").toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          <Select.Option value="all">{(t("orderStatus.all") as string).toUpperCase()}</Select.Option>
          {ORDER_STATUS_LIST.map((orderStatus: string) => (
            <Select.Option key={orderStatus} value={orderStatus}>
              {(t(`orderStatus.${orderStatus}`) as string).toUpperCase()}
            </Select.Option>
          ))}
        </Select>
        <RangePicker style={{ width: "12%" }} format={dateFormatList} />
      </Row>
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
