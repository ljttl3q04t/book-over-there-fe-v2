import * as React from "react";
import styled from "styled-components";
import { OrderTable } from "./OrderTable";
import { Button, Form, notification } from "antd";
import { CreateOrderModal } from "./CreateOrderModal";
import { ReturnOrderModal } from "./ReturnOrderModal";
import dfbServices from "@/services/dfb";
import { ClubBookInfos, MemberInfos, OrderInfos } from "@/services/types";
import { useTranslation } from "react-i18next";
import { DataType } from "./types";
import { useState } from "react";
import dayjs from "dayjs";
import { FilterOrder } from "./FilterOrder";
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

const ClubOrder = () => {
  const [loading, setLoading] = useState(false);
  const [openCreateOrderModal, setOpenCreateOrderModal] = useState(false);
  const [openReturnOrderModal, setOpenReturnOrderModal] = useState(false);
  const [members, setMembers] = useState<MemberInfos[]>([]);
  const [clubBookInfos, setClubBookInfos] = useState<ClubBookInfos[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [tableData, setTableData] = useState<DataType[]>([]);
  const [selectedRows, setSelectedRows] = useState<DataType[]>([]);
  const { currentClubId } = React.useContext(UserContext);

  const [form] = Form.useForm();

  const { t } = useTranslation();

  const fetchOrders = async (data?: any) => {
    try {
      setLoading(true);
      const orderIds = await dfbServices.getOrderIds({ club_id: currentClubId, ...data });
      if (orderIds.length > 0) {
        const orderInfos: OrderInfos[] = await dfbServices.getOrderInfos(currentClubId, orderIds);
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
        const sortedData = [...data].sort((a, b) => {
          const dateComparison = new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
          if (dateComparison === 0) {
            return b.orderDetailId - a.orderDetailId;
          }
          return dateComparison;
        });
        setTableData(sortedData);
      } else {
        setTableData([]);
      }
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
      const allMembers = await dfbServices.getAllMembers(currentClubId ?? 0);
      setMembers(allMembers);
      const clubBookIds = await dfbServices.getClubBookIds(currentClubId ?? 0);
      const infos = await dfbServices.getClubBookInfos(clubBookIds);
      setClubBookInfos(infos);
      await fetchOrders();
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
        club_id: currentClubId,
      };
      const message = await dfbServices.returnBooks(data);
      notification.success({ message: message, type: "success" });
      await fetchOrders();
      setOpenReturnOrderModal(false);
      setSelectedRowKeys([]);
      setSelectedRows([]);
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
      if (data.order_date) {
        data.order_date = dayjs(data.order_date).format("YYYY-MM-DD");
      }
      if (data.order_month) {
        data.order_month = dayjs(data.order_month).format("YYYY-MM-DD");
      }
      await fetchOrders(data);
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
  }, [currentClubId]);

  return (
    <StyledClubOrder>
      <div className="table-extra-content">
        <FilterOrder
          handleQuerySubmit={handleQuerySubmit}
          handleQueryCancel={handleQueryCancel}
          loading={loading}
          form={form}
          members={members}
        />
        <div>
          {" "}
          <Button
            type="primary"
            onClick={() => {
              setOpenCreateOrderModal(true);
            }}
            style={{ marginRight: "10px" }}
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
      </div>
      <CreateOrderModal
        members={members}
        clubBookInfos={clubBookInfos}
        open={openCreateOrderModal}
        onCancel={() => {
          setOpenCreateOrderModal(false);
        }}
        onRefresh={async () => {
          await fetchOrders();
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
