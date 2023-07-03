import React, { useCallback, useEffect, useState, useRef } from "react";
import Table, { ColumnType, ColumnsType } from "antd/es/table";
import {
  IssuesCloseOutlined,
  PlusCircleFilled,
  UploadOutlined,
  DownloadOutlined,
  LoadingOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

import styled from "styled-components";
import ClubService, {
  UpdateMemberClubForm,
  ClubMemberOrderCreateForm,
  ClubStaffBookListParams,
  ClubMemberBookBorrowingForm,
  ClubMemberBookBorrowingExtendForm,
} from "@/services/club";
import { debounce } from "@/helpers/fuctionHepler";
import {
  Button,
  Form,
  Input,
  InputRef,
  Modal,
  Space,
  Tag,
  notification,
  DatePicker,
  Select,
  Avatar,
  UploadProps,
  Upload,
  UploadFile,
  Drawer,
} from "antd";
import dayjs from "dayjs";
import { FilterConfirmProps } from "antd/es/table/interface";
import { getColumnSearchProps } from "@/helpers/CommonTable";
import { MESSAGE_VALIDATE_BASE } from "@/constants/MessageConstant";
import { disabledDateBefore, dateFormatList } from "@/helpers/DateHelper";
import { RcFile } from "antd/es/upload";

const StyledModalContent = styled.div`
  padding: 30px;
  > .table-extra-content {
    display: flex;
    justify-content: space-between;
    padding-bottom: 15px;
    .table-extra-content-item {
      display: flex;
      gap: 10px;
    }
  }
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
  BORROWING: "borrowing",
};
const DRAWER_CODE = {
  RETURN: "return",
  EXTEND: "extend",
};
const BOOK_COPY_STATUS = {
  sharing_club: "sharing_club",
};
interface ModalContent {
  [key: string]: {
    title: any;
    onOk: (item: DataType) => void;
    content: JSX.Element;
    width: string | number;
  };
}
interface DrawerContent {
  [key: string]: {
    title: any;
    onOk: () => void;
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
interface DataTypeBooks {
  id: number;
  no: number;
  bookName: string;
  categoryName: string;
  authorName: string;
  publisherName: string;
  image: string;
  totalCopyCount: number;
  memberName: string;
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
  memberName: string;
}
interface DataTypeBooksBorrowing {
  no: number;
  order_detail_id: number;
  order_id: number;
  book_name: string;
  book_image: string;
  start_date: string;
  due_date: string;
  overdue_day_count: number;
  club_name: string;
}
type DataIndex = keyof DataType;
type DataIndexBooks = keyof DataTypeBooks;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};
const layoutFormDrawer = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const { TextArea } = Input;

const defaultSearchBooklistForm: ClubStaffBookListParams = {
  searchText: "",
  page: 1,
  pageSize: 10,
};
const ClubStaff = () => {
  const [loading, setLoading] = useState(false);
  const [clubMemberTableSource, setClubMemberTableSource] = useState<DataType[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const modalItem = useRef<DataType | null>();
  const searchInput = useRef<InputRef>(null);
  const bookClubName = useRef<string>("");
  const [activeModal, setActiveModal] = useState("");
  const [activeDrawer, setActiveDrawer] = useState(DRAWER_CODE.EXTEND);
  const [clubBookList, setClubBookList] = useState([]);
  const [memberBookBorrowingList, setMemberBookBorrowingList] = useState([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [fileListPreview, setFileListPreview] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
      setFileListPreview([]);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      setFileListPreview([
        {
          uid: "-xxx",
          percent: 50,
          name: "image.png",
          status: "done",
          url: URL.createObjectURL(file),
        },
      ]);
      return false;
    },
    fileList: fileListPreview,
  };
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
    modalItem.current = null;
    setSelectedRowKeys([]);
    setActiveModal("");
    setFileList([]);
    setFileListPreview([]);
  };
  const handleOpenOrderModal = (item: DataType) => {
    Promise.all([
      (modalItem.current = item),
      fetchClubBookList(true, { ...defaultSearchBooklistForm }),
      setActiveModal(MODAL_CODE.ORDER),
    ])
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

  const handleOpenDepositModal = async (item: DataType) => {
    try {
      const searchForm: ClubStaffBookListParams = {
        ...defaultSearchBooklistForm,
        membership_id: item.membershipId,
        book_copy__book_status: BOOK_COPY_STATUS.sharing_club,
      };

      await fetchClubBookList(true, searchForm);

      modalItem.current = item;

      await setActiveModal(MODAL_CODE.DEPOSIT);

      form.setFieldsValue({
        full_name: item?.memberName,
        phone_number: item?.memberPhone,
      });
    } catch (error) {
      // Handle any errors that occurred during the steps
      console.error(error);
    }
  };

  const handleOpenWithdrawModal = (item: any) => {
    Promise.all([
      (modalItem.current = item),
      fetchClubBookList(true, { ...defaultSearchBooklistForm }),
      setActiveModal(MODAL_CODE.WITHDRAW),
    ])
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
  const handleOpenViewAllModal = () => {
    // fetchClubBookList();
    setActiveModal(MODAL_CODE.VIEW_ALL);
  };
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const onResetRowSelection = () => {
    setSelectedRowKeys([]);
  };
  const [openBorrowingDrawer, setOpenBorrowingDrawer] = useState(false);

  const showBorrowingDrawer = async (drawerCode: string) => {
    await setActiveDrawer(drawerCode);
    await setOpenBorrowingDrawer(true);
    form.setFieldsValue({
      full_name: modalItem?.current.memberName,
      phone_number: modalItem?.current.memberPhone,
    });
  };

  const onCloseBorrowingDrawer = () => {
    setOpenBorrowingDrawer(false);
    setSelectedRowKeys([]);
    form.resetFields();
    setFileList([]);
    setFileListPreview([]);
  };
  const handleOpenBorrowingModal = async (item: DataType) => {
    try {
      const searchForm: ClubMemberBookBorrowingForm = {
        membership_id: item.membershipId,
      };

      await fetchMemberBookBorrowing(searchForm);

      modalItem.current = item;

      await setActiveModal(MODAL_CODE.BORROWING);
    } catch (error) {
      // Handle any errors that occurred during the steps
      console.error(error);
    }
  };
  const handleExtendBorrowingBooks = () => {
    const formData: ClubMemberBookBorrowingExtendForm = {
      membership_order_detail_ids: selectedRowKeys,
      new_due_date: dayjs(form.getFieldValue("new_due_date")).format(dateFormatList[0]),
      note: form.getFieldValue("note"),
      attachment: fileList[0] as RcFile,
    };
    ClubService.clubMemberBookBorrowingExtend(formData)
      .then((response) => {
        notification.success({
          message: "Extend successfully!",
          type: "success",
        });
        onCloseBorrowingDrawer() ;
        setFileList([]);
        setFileListPreview([]);
        const searchForm: ClubMemberBookBorrowingForm = {
          membership_id: modalItem?.current.membershipId,
        };
        fetchMemberBookBorrowing(searchForm);
      })
      .catch((error) => {
        notification.error({
          message: `Extend failed, please try again!`,
          type: "error",
        });
      })
      .finally(() => {});
  };
  const handleSelectBooksChange = debounce((value: string) => {
    const searchForm: ClubStaffBookListParams = {
      ...defaultSearchBooklistForm,
      searchText: value,
      page: 1,
      pageSize: 10,
    };
    fetchClubBookList(true, searchForm);
  }, 1000);
  const fetchClubBookList = (useForSelect = false, searchForm: ClubStaffBookListParams) => {
    !useForSelect && setLoading(true);
    ClubService.getClubStaffBookList(searchForm)
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
              memberName: item.membership.member.full_name,
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
  };
  const fetchMemberBookBorrowing = (searchForm: ClubMemberBookBorrowingForm) => {
    setLoading(true);
    ClubService.getClubMemberBookBorrowing(searchForm)
      .then((response) => {
        if (response.data) {
          setMemberBookBorrowingList(response.data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleDepositBooks = useCallback((item: DataType) => {}, []);
  const handleWithdrawBooks = useCallback((item: DataType) => {}, []);
  const handleOrderBooks = () => {
    form.validateFields()
    if (form.getFieldsError()) return;
    const list_books_id = form.getFieldValue("select_books").map((item: any) => Number(item.split("-")[0]));
    const formData: ClubMemberOrderCreateForm = {
      membership_id: modalItem.current?.membershipId,
      member_book_copy_ids: list_books_id && list_books_id,
      due_date: dayjs(form.getFieldValue("due_date")).format(dateFormatList[0]),
      note: form.getFieldValue("note"),
      attachment: fileList[0] as RcFile,
    };
    ClubService.clubMemberOrderCreate(formData)
      .then((response) => {
        notification.success({
          message: "Order create successfully!",
          type: "success",
        });
        handleCloseModal();
      })
      .catch((error) => {
        notification.error({
          message: `Order create failed, please try again!`,
          type: "error",
        });
      })
      .finally(() => {});
  };
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
          <Button icon={<UnorderedListOutlined />} onClick={() => handleOpenBorrowingModal(item)}>
            Borrowing
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
  const columnsBookBorrowingList: ColumnsType<DataTypeBooksBorrowing> = [
    {
      title: "",
      width: "8%",
      dataIndex: "book_image",
      key: "book_image",
      render: (image: string) => <Avatar shape="square" size={98} src={image} />,
    },
    {
      title: "Name",
      width: "25%",
      dataIndex: "book_name",
      key: "book_name",
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
      render: (start_date: any) => dayjs(start_date).format("YYYY-MM-DD"),
    },
    {
      title: "Due Date",
      dataIndex: "due_date",
      key: "due_date",
      render: (start_date: any) => dayjs(start_date).format("YYYY-MM-DD"),
    },
    {
      title: "Overdue Days",
      dataIndex: "overdue_day_count",
      key: "overdue_day_count",
    },
    {
      title: "Club Name",
      dataIndex: "club_name",
      key: "club_name",
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
  const defaultFormContent = (optionalField?: JSX.Element) => {
    return (
      <>
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
              onSearch={handleSelectBooksChange}
              placeholder="Find books..."
              mode="multiple"
              showArrow
              style={{ width: "100%" }}
            >
              {clubBookList.map((item: DataTypeBooks) => {
                return (
                  <Select.Option value={item.id + "-" + item.bookName}>{`${
                    item.memberName + " - " + item.bookName
                  }`}</Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} attachment` }]}
            name="attachment"
            label="Attachment"
          >
            <Upload multiple={false} accept="image/*" {...props} listType="picture-card">
              {uploadButton}
            </Upload>
          </Form.Item>
          {optionalField}
        </Form>
      </>
    );
  };
  const drawerContent: DrawerContent = {
    extend: {
      title: `Extend Books`,
      onOk: handleExtendBorrowingBooks,
      content: (
        <>
          <Form onFinish={handleExtendBorrowingBooks} layout="vertical" form={form} name="control-ref" style={{ width: "100%" }}>
            <Form.Item
              name="full_name"
              label="Full Name"
              rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} full name` }]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="phone_number"
              label="Phone Number:"
              rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} phone number` }]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="new_due_date"
              label="New Due Date"
              rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} new due date` }]}
            >
              <DatePicker disabledDate={disabledDateBefore} style={{ width: "100%" }} format={dateFormatList} />
            </Form.Item>
            <Form.Item
              rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} attachment` }]}
              name="attachment"
              label="Attachment:"
            >
              <Upload multiple={false} accept="image/*" {...props} listType="picture-card">
                {uploadButton}
              </Upload>
            </Form.Item>
            <Form.Item name="note" label="Note" rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} note` }]}>
              <TextArea rows={4} placeholder="Note..." />
            </Form.Item>
          </Form>
        </>
      ),
    },
    return: {
      title: `Return Books`,
      onOk: () => {},
      content: <></>,
    },
  };
  const modalContent: ModalContent = {
    order: {
      title: "Book Order",
      width: 800,
      onOk: handleOrderBooks,
      content: defaultFormContent(
        <>
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
          ,
        </>,
      ),
    },
    deposit: {
      title: "Deposit Books",
      width: 800,
      onOk: handleDepositBooks,
      content: defaultFormContent(
        <Form.Item name="description" label="Description" rules={[{ required: false }]}>
          <TextArea rows={4} placeholder="Description..." />
        </Form.Item>,
      ),
    },
    withdraw: {
      title: "Withdraw Books",
      width: 800,
      onOk: handleWithdrawBooks,
      content: defaultFormContent(
        <Form.Item name="description" label="Description" rules={[{ required: false }]}>
          <TextArea rows={4} placeholder="Description..." />
        </Form.Item>,
      ),
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
    borrowing: {
      title: `Borrowing Books: ${modalItem.current?.memberName}`,
      width: "60%",
      onOk: () => {},
      content: (
        <>
          <div className="table-extra-content">
            <Button
              type="primary"
              onClick={onResetRowSelection}
              disabled={selectedRowKeys.length === 0}
              loading={loading}
            >
              Reset
            </Button>
            <div className="table-extra-content-item">
              <Button
                onClick={() => showBorrowingDrawer(DRAWER_CODE.EXTEND)}
                disabled={selectedRowKeys.length === 0}
                loading={loading}
              >
                Extend
              </Button>
              <Button
                type="primary"
                onClick={() => showBorrowingDrawer(DRAWER_CODE.RETURN)}
                disabled={selectedRowKeys.length === 0}
                loading={loading}
              >
                Return
              </Button>{" "}
            </div>
          </div>
          <Table
            scroll={{ y: 700 }}
            pagination={{
              total: memberBookBorrowingList.length,
              pageSize: optionTableModal.pageSize,
              current: optionTableModal.pageIndex,
            }}
            rowSelection={rowSelection}
            rowKey="order_detail_id"
            onChange={handleTableModalChange}
            loading={loading}
            columns={columnsBookBorrowingList}
            dataSource={memberBookBorrowingList}
          />
          <Drawer
            title={drawerContent[activeDrawer].title}
            placement="right"
            width="30%"
            closable={false}
            onClose={onCloseBorrowingDrawer}
            open={openBorrowingDrawer}
            getContainer={false}
            extra={
              <Space>
                <Button onClick={onCloseBorrowingDrawer}>Close</Button>
                <Button onClick={()=>form.submit()} type="primary">
                  Submit
                </Button>
              </Space>
            }
          >
            {drawerContent[activeDrawer].content}
          </Drawer>
        </>
      ),
    },
  };

  return (
    <StyledClubStaffList>
      <div className="table-extra-content">
        <h1>{bookClubName.current}</h1>
        {/* <a onClick={handleOpenViewAllModal} href="javascript:void(0)" rel="noopener noreferrer">
          (View all books)
        </a> */}
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
          closable={false}
          width={modalContent[activeModal].width}
          {...layout}
          title={modalContent[activeModal].title}
          open={activeModal !== ""}
          onCancel={handleCloseModal}
          onOk={modalContent[activeModal].onOk}
          destroyOnClose={true}
          maskClosable={false}
        >
          <StyledModalContent>{modalContent[activeModal].content}</StyledModalContent>
        </Modal>
      )}
    </StyledClubStaffList>
  );
};

export default ClubStaff;
