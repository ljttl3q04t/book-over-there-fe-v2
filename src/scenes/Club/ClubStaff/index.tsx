import React, { useCallback, useEffect, useState, useRef } from "react";
import Table, { ColumnType, ColumnsType } from "antd/es/table";
import { IssuesCloseOutlined, PlusCircleFilled, UploadOutlined, DownloadOutlined } from "@ant-design/icons";

import styled from "styled-components";
import ClubService, { UpdateMemberClubForm, ClubMemberOrderCreateForm } from "@/services/club";

import { Button, Form, Input, InputRef, Modal, Space, Tag, notification, DatePicker, Select, Avatar } from "antd";
import dayjs from "dayjs";
import { FilterConfirmProps } from "antd/es/table/interface";
import { getColumnSearchProps } from "@/helpers/CommonTable";
import { MESSAGE_VALIDATE_BASE } from "@/constants/MessageConstant";
import { disabledDateBefore, dateFormatList } from "@/helpers/DateHelper";
import { Item } from "semantic-ui-react";
const { Option } = Select;

const StyledModalContent = styled.div`
  padding: 30px;
`;
const StyledClubStaffList = styled.div`
  border-radius: 12px;
  padding: 30px;
  background: #fff;
  width: 100%;
  margin-top: 30px;
  > .table-extra-content {
    padding: 20px 10px 30px 10px;
    display: flex;
    align-items: center;
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
  VIEW_ALL: "view_all",
};
interface ModalContent {
  [key: string]: {
    title: any;
    onOk: (item: DataType) => void;
    content: JSX.Element;
    width: string | number;
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
interface DataTypeBooks {
  id: number;
  no: number;
  bookName: string;
  categoryName: string;
  authorName: string;
  publisherName: string;
  image: string;
  totalCopyCount: number;
}
type DataIndex = keyof DataType;
type DataIndexBooks = keyof DataTypeBooks;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};
const { TextArea } = Input;

const ClubStaff = () => {
  const [loading, setLoading] = useState(false);
  const [clubMemberTableSource, setClubMemberTableSource] = useState<DataType[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [modalItem, setModalItem] = useState<DataType>();
  const searchInput = useRef<InputRef>(null);
  const bookClubName = useRef<string>("");
  const [activeModal, setActiveModal] = useState("");
  const [clubBookList, setClubBookList] = useState([]);
  const [form] = Form.useForm();
  const [option, setOption] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const [optionTableModal, setOptionTableModal] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const handleTableChange = (pagination: any) => {
    setOption({
      ...option,
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    });
  };
  const handleTableModalChange = (pagination: any) => {
    setOptionTableModal({
      ...optionTableModal,
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    });
  };
  const initFetch = useCallback(async () => {
    setLoading(true);
    ClubService.getClubMemberList()
      .then((response) => {
        if (response.data) {
          const data = response.data.map((item: any, index: any) => {
            return {
              no: index + 1,
              bookClubName: item.book_club.name,
              memberName: item.member.full_name,
              memberStatus: item.member_status,
              memberEmail: item.member.email,
              memberPhone: item.member.phone_number,
              memberAvatar: item.member.avatar_url,
              createdAt: dayjs(item.created_at).format("YYYY-MM-DD"),
              joinedAt: dayjs(item.joined_at).format("YYYY-MM-DD"),
              leaveAt: item.leaved_at && dayjs(item.leaved_at).format("YYYY-MM-DD"),
              isStaff: item.is_staff,
              membershipId: item.id,
            };
          });
          bookClubName.current = data[0]?.bookClubName;
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
    dataIndex: DataIndex | DataIndexBooks,
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
    form.resetFields();
    setActiveModal("");
  };
  const handleOpenOrderModal = (item: any) => {
    Promise.all([setModalItem(item),fetchClubBookList(true), setActiveModal(MODAL_CODE.ORDER)])
      .then(() => {
        form.setFieldsValue({
          full_name: item?.memberName,
          phone_number: item?.memberPhone,
        });
      })
      .catch((error) => {
        // Handle any errors that occurred during concurrent execution
        console.error(error);
      });
  };

  const handleOpenDepositModal = (item: any) => {
    setModalItem(item);
    setActiveModal(MODAL_CODE.DEPOSIT);
  };

  const handleOpenWithdrawModal = (item: any) => {
    setActiveModal(MODAL_CODE.WITHDRAW);
    setModalItem(item);
  };
  const handleOpenViewAllModal = () => {
    fetchClubBookList();
    setActiveModal(MODAL_CODE.VIEW_ALL);
  };
  const fetchClubBookList = useCallback((useForSelect = false) => {
    !useForSelect && setLoading(true);
    ClubService.getClubStaffBookList()
      .then((response) => {
        if (response.data) {
          const data = response.data.results.map((item: any, index: any) => {
            const book: DataTypeBooks = {
              id: item.id,
              no: index + 1,
              authorName: item.book_copy?.book?.author?.name,
              bookName: item.book_copy?.book?.name,
              categoryName: item.book_copy?.book?.category?.name,
              publisherName: item.book_copy?.book?.publisher?.name,
              image: item.book_copy?.book?.image,
              totalCopyCount: 0,
            };
            return book;
          });
          setClubBookList(data);
        }
      })
      .finally(() => {
        !useForSelect && setLoading(false);
      });
  }, []);

  const handleDepositBooks = useCallback((item: DataType) => {}, []);
  const handleWithdrawBooks = useCallback((item: DataType) => {}, []);
  const handleOrderBooks = useCallback(() => {
    const list_books_id = form.getFieldValue("select_books").map((item: any) => item.split("-")[0]);
    const formData: ClubMemberOrderCreateForm = {
      membership_id: modalItem?.membershipId,
      member_book_copy_ids: list_books_id && list_books_id,
      due_date: form.getFieldValue("due_date"),
      note: form.getFieldValue("note"),
    };
    ClubService.clubMemberOrderCreate(formData)
      .then((response) => {
        notification.success({
          message: "Order create successfully!",
          type: "success",
        });
        handleCloseModal()
      })
      .catch((error) => {
        notification.error({
          message: `Order create failed, please try again!`,
          type: "error",
        });
      })
      .finally(() => {});
  }, []);
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
  const columnsBookList: ColumnsType<DataTypeBooks> = [
    {
      title: "",
      dataIndex: "image",
      key: "image",
      render: (image: string) => <Avatar shape="square" size={98} src={image} />,
    },
    {
      title: "Name",
      dataIndex: "bookName",
      key: "bookName",
      ...getColumnSearchProps(
        "bookName",
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
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Author",
      dataIndex: "authorName",
      key: "authorName",
    },
    {
      title: "Publisher",
      dataIndex: "publisherName",
      key: "publisherName",
    },
    {
      title: "Total Copy Count",
      dataIndex: "totalCopyCount",
      key: "totalCopyCount",
    },
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_values: DataType) => (
    //     <Button icon={<PlusCircleFilled />} type="primary" onClick={() => handleOpenOrder(_values)}>
    //       Order
    //     </Button>
    //   ),
    // },
  ];
  const columns: ColumnsType<DataType> = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
    },
    // {
    //   title: "Club Name",
    //   dataIndex: "bookClubName",
    //   key: "bookClubName",
    //   ...getColumnSearchProps(
    //     "bookClubName",
    //     searchInput,
    //     searchText,
    //     setSearchText,
    //     searchedColumn,
    //     setSearchedColumn,
    //     handleReset,
    //     handleSearch,
    //   ),
    // },
    {
      title: "Member Name",
      dataIndex: "memberName",
      key: "memberName",
      width: "25%",
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
      width: "120px",
      dataIndex: "createdAt",
    },
    {
      title: "Joined Date",
      width: "120px",
      key: "joinedAt",
      dataIndex: "joinedAt",
    },
    {
      title: "Leave Date",
      width: "120px",
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
      width: 800,
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
                <Select placeholder="Find books..." mode="multiple" showArrow style={{ width: "100%" }}>
                  {clubBookList.map((item: DataTypeBooks) => {
                    return <Select.Option value={item.id + "-" + item.bookName}>{item.bookName}</Select.Option>;
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                name="due_date"
                label="Due Date"
                rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} due date` }]}
              >
                <DatePicker disabledDate={disabledDateBefore} style={{ width: "100%" }} format={dateFormatList} />
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
      width: 800,
      onOk: handleDepositBooks,
      content: <>{/* Content for deposit modal */}</>,
    },
    withdraw: {
      title: "Withdraw Books",
      width: 800,
      onOk: handleWithdrawBooks,
      content: <>{/* Content for withdraw modal */}</>,
    },
    view_all: {
      title: `${bookClubName.current}`,
      width: "60%",
      onOk: handleWithdrawBooks,
      content: (
        <>
          <Table
            scroll={{ x: 1500, y: 700 }}
            pagination={{
              total: clubBookList.length,
              pageSize: optionTableModal.pageSize,
              current: optionTableModal.pageIndex,
            }}
            onChange={handleTableModalChange}
            loading={loading}
            columns={columnsBookList}
            dataSource={clubBookList}
          />
        </>
      ),
    },
  };

  return (
    <StyledClubStaffList>
      <div className="table-extra-content">
        <h1>{bookClubName.current}</h1>
        <a onClick={handleOpenViewAllModal} href="javascript:void(0)" rel="noopener noreferrer">
          (View all books)
        </a>
        {/* <Button type="primary" loading={loading}>
          Club Books
        </Button> */}
      </div>

      <Table
        scroll={{ x: "max-content" }}
        pagination={{
          total: clubMemberTableSource.length,
          pageSize: option.pageSize,
          current: option.pageIndex,
        }}
        onChange={handleTableChange}
        loading={loading}
        columns={columns}
        dataSource={clubMemberTableSource}
      />
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
          width={modalContent[activeModal].width}
          {...layout}
          title={modalContent[activeModal].title}
          open={activeModal !==""}
          onCancel={handleCloseModal}
          onOk={modalContent[activeModal].onOk}
          destroyOnClose={true}
        >
          <StyledModalContent>{modalContent[activeModal].content}</StyledModalContent>
        </Modal>
      )}
    </StyledClubStaffList>
  );
};

export default ClubStaff;
