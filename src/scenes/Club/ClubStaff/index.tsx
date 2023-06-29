import React, { useCallback, useEffect, useState, useRef } from "react";
import Table, { ColumnType, ColumnsType } from "antd/es/table";
import { IssuesCloseOutlined, PlusCircleFilled, UploadOutlined, DownloadOutlined } from "@ant-design/icons";

import styled from "styled-components";
import ClubService, { UpdateMemberClubForm } from "@/services/club";

import { Button, Form, Input, InputRef, Modal, Space, Tag, notification, DatePicker, Select } from "antd";
import dayjs from "dayjs";
import { FilterConfirmProps } from "antd/es/table/interface";
import { getColumnSearchProps } from "@/helpers/CommonTable";
import { MESSAGE_VALIDATE_BASE } from "@/constants/MessageConstant";
import { disabledDate, dateFormatList } from "@/helpers/DateHelper";
import type { CustomTagProps } from "rc-select/lib/BaseSelect";

const StyledModalContent = styled.div`
  padding: 30px;
`;
const StyledClubStaffList = styled.div`
  border-radius: 12px;
  padding: 30px;
  background: #fff;
  width: 100%;
  margin-top: 70px;
`;
type MemberStatus = "active" | "pending";
const statusColors = {
  active: "green",
  pending: "geekblue",
};
const MEMBER_STATUS = {
  ACTIVE: "active",
  PENDING: "pending",
};
const MODAL_CODE = {
  ORDER: "order",
  DEPOSIT: "deposit",
  WITHDRAW: "withdraw",
};
interface ModalContent {
  [key: string]: {
    title: string;
    onOk: (item: DataType) => void;
    content: JSX.Element;
  };
}
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

type DataIndex = keyof DataType;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};
const { TextArea } = Input;

const ClubStaff = () => {
  const [loading, setLoading] = useState(false);
  const [clubMemberList, setClubMemberList] = useState([]);
  const [clubMemberTableSource, setClubMemberTableSource] = useState<DataType[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [modalItem, setModalItem] = useState<DataType>();
  const searchInput = useRef<InputRef>(null);
  const [activeModal, setActiveModal] = useState("");
  const [form] = Form.useForm();
  const options = [{ value: "gold" }, { value: "lime" }, { value: "green" }, { value: "cyan" }];

  const initFetch = useCallback(async () => {
    setLoading(true);
    ClubService.getClubMemberList()
      .then((response) => {
        if (response.data) {
          setClubMemberList(response.data);
          const data = response.data.map((item: any, index: any) => {
            return {
              no: index + 1,
              bookClubName: item.book_club.name,
              memberName: item.member.full_name,
              memberStatus: item.member_status,
              memberEmail: item.member.email,
              memberPhone: item.member.phone,
              memberAvatar: item.member.avatar_url,
              createdAt: dayjs(item.created_at).format("YYYY-MM-DD"),
              joinedAt: dayjs(item.joined_at).format("YYYY-MM-DD"),
              leaveAt: item.leaved_at && dayjs(item.leaved_at).format("YYYY-MM-DD"),
              isStaff: item.is_staff,
              membershipId: item.id,
            };
          });
          setClubMemberTableSource(data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  const handleApproveMember = useCallback(async (item: DataType) => {
    const updateMemberForm: UpdateMemberClubForm = {
      membership_id: item.membershipId,
      member_status: MEMBER_STATUS.ACTIVE,
    };
    ClubService.updateMemberClub(updateMemberForm)
      .then((response) => {
        notification.success({
          message: "Approve successfully!",
          type: "success",
        });
        initFetch();
      })
      .catch((error) => {
        notification.error({
          message: `Approve failed, please try again!`,
          type: "error",
        });
      })
      .finally(() => {});
  }, []);
  useEffect(() => {
    initFetch();
  }, []);
  const memberStatusMapping = (status: MemberStatus) => {
    return (
      <Tag color={statusColors[status]} key={status}>
        {status.toUpperCase()}
      </Tag>
    );
  };
  const memberStaffMapping = (isStaff: boolean) => {
    const color = isStaff ? "green" : "volcano";
    return <Tag color={color}>{isStaff ? "Yes" : "No"}</Tag>;
  };
  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };
  const handleCloseOrder = () => {
    form.resetFields();
  };

  const handleCloseModal = () => {
    setActiveModal("");
  };
  const handleOpenOrderModal = (item: any) => {
    setActiveModal(MODAL_CODE.ORDER);
    setModalItem(item);
  };

  const handleOpenDepositModal = (item: any) => {
    setActiveModal(MODAL_CODE.DEPOSIT);
    setModalItem(item);
  };

  const handleOpenWithdrawModal = (item: any) => {
    setActiveModal(MODAL_CODE.WITHDRAW);
    setModalItem(item);
  };
  const handleDepositBooks = useCallback((item: DataType) => {}, []);
  const handleWithdrawBooks = useCallback((item: DataType) => {}, []);
  const handleOrderBooks = useCallback((item: DataType) => {}, []);
  const displayAction = (item: DataType) => {
    if (item.memberStatus === MEMBER_STATUS.PENDING) {
      return (
        <Space size="middle">
          <Button type="primary" icon={<IssuesCloseOutlined />} onClick={() => handleApproveMember(item)}>
            Approve
          </Button>
        </Space>
      );
    } else if (item.memberStatus === MEMBER_STATUS.ACTIVE) {
      return (
        <Space size="middle">
          <Button icon={<PlusCircleFilled />} type="primary" onClick={() => handleOpenOrderModal(item)}>
            Order
          </Button>
          <Button type="primary" icon={<DownloadOutlined />} onClick={() => handleOpenDepositModal(item)}>
            Deposit Books
          </Button>
          <Button icon={<UploadOutlined />} onClick={() => handleOpenWithdrawModal(item)}>
            Withdraw Books
          </Button>
        </Space>
      );
    }
  };
  const columns: ColumnsType<DataType> = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
    },
    {
      title: "Club Name",
      dataIndex: "bookClubName",
      key: "bookClubName",
      ...getColumnSearchProps(
        "bookClubName",
        searchInput,
        searchText,
        setSearchText,
        searchedColumn,
        setSearchedColumn,
        handleReset,
        handleSearch,
      ),
    },
    {
      title: "Member Name",
      dataIndex: "memberName",
      key: "memberName",
      ...getColumnSearchProps(
        "memberName",
        searchInput,
        searchText,
        setSearchText,
        searchedColumn,
        setSearchedColumn,
        handleReset,
        handleSearch,
      ),
    },
    {
      title: "Member Status",
      dataIndex: "",
      key: "",
      render: (item: any) => {
        return memberStatusMapping(item.memberStatus);
      },
    },
    {
      title: "Created Date",
      key: "createdAt",
      dataIndex: "createdAt",
    },
    {
      title: "Joined Date",
      key: "joinedAt",
      dataIndex: "joinedAt",
    },
    {
      title: "Leave Date",
      key: "leaveAt",
      dataIndex: "leaveAt",
    },
    {
      title: "Staff",
      key: "",
      dataIndex: "",
      render: (item: any) => {
        return memberStaffMapping(item.isStaff);
      },
    },
    {
      title: "Action",
      key: "",
      dataIndex: "",
      fixed: "right",
      render: (item: DataType) => {
        return displayAction(item);
      },
    },
  ];
  const modalContent: ModalContent = {
    order: {
      title: "Book Order",
      onOk: handleOrderBooks,
      content: (
        <>
          {
            <Form {...layout} form={form} name="control-ref" style={{ width: 800 }}>
              <Form.Item
                name="full_name"
                label="Full Name"
                rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} full name` }]}
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                name="phone_number"
                label="Phone Number"
                rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} phone number` }]}
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                label="Select Books"
                name="select_books"
                rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} select at least one book` }]}
              >
                <Select
                  placeholder="Find books..."
                  mode="multiple"
                  showArrow
                  defaultValue={["gold", "cyan"]}
                  style={{ width: "100%" }}
                  options={options}
                />
              </Form.Item>
              <Form.Item
                name="due_date"
                label="Due Date"
                rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} due date` }]}
              >
                <DatePicker disabledDate={disabledDate} style={{ width: "100%" }} format={dateFormatList} />
              </Form.Item>
              <Form.Item name="note" label="Note" rules={[{ required: false }]}>
                <TextArea rows={4} placeholder="Note..." />
              </Form.Item>
            </Form>
          }
        </>
      ),
    },
    deposit: {
      title: "Deposit Books",
      onOk: handleDepositBooks,
      content: <>{/* Content for deposit modal */}</>,
    },
    withdraw: {
      title: "Withdraw Books",
      onOk: handleWithdrawBooks,
      content: <>{/* Content for withdraw modal */}</>,
    },
  };

  return (
    <StyledClubStaffList>
      <Table loading={loading} columns={columns} dataSource={clubMemberTableSource} />
      {/* {activeModal === MODAL_CODE.ORDER && (
        <Modal title="Book Order" width={800} visible={true} onCancel={handleCloseModal} onOk={handleOkOrder}>
          <StyledModalContent>
            <Form {...layout} form={form} name="control-ref" style={{ width: 800 }}>
              <Form.Item
                name="full_name"
                label="Full Name"
                rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} full name` }]}
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                name="phone_number"
                label="Phone Number"
                rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} phone number` }]}
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                label="Select Books"
                name="select_books"
                rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} select at least one book` }]}
              >
                <Select
                  placeholder="Find books..."
                  mode="multiple"
                  showArrow
                  defaultValue={["gold", "cyan"]}
                  style={{ width: "100%" }}
                  options={options}
                />
              </Form.Item>
              <Form.Item
                name="due_date"
                label="Due Date"
                rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} due date` }]}
              >
                <DatePicker disabledDate={disabledDate} style={{ width: "100%" }} format={dateFormatList} />
              </Form.Item>
              <Form.Item name="note" label="Note" rules={[{ required: false }]}>
                <TextArea rows={4} placeholder="Note..." />
              </Form.Item>
            </Form>
          </StyledModalContent>
        </Modal>
      )} */}

      {/* {activeModal === MODAL_CODE.DEPOSIT && (
        <Modal title="Deposit Books" visible={true} onCancel={handleCloseModal}>
        </Modal>
      )}

      {activeModal === MODAL_CODE.WITHDRAW && (
        <Modal title="Withdraw Books" visible={true} onCancel={handleCloseModal}>
        </Modal>
      )} */}
      {activeModal && (
        <Modal
          width={800}
          {...layout}
          title={modalContent[activeModal].title}
          visible={true}
          onCancel={handleCloseModal}
          onOk={modalContent[activeModal].onOk}
        >
          <StyledModalContent>{modalContent[activeModal].content}</StyledModalContent>
        </Modal>
      )}
    </StyledClubStaffList>
  );
};

export default ClubStaff;
