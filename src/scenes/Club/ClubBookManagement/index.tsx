import React, { useCallback, useEffect, useState, useRef } from "react";
import Table, { ColumnsType } from "antd/es/table";
import { MoreOutlined, IssuesCloseOutlined, PlusCircleFilled, UploadOutlined, DownloadOutlined } from "@ant-design/icons";

import styled from "styled-components";
import ClubService, { ClubStaffBookListParams} from "@/services/club";

import { Button, Form, Input, InputRef, Modal, Space, Tag, notification, DatePicker, Select, Avatar, Dropdown, MenuProps } from "antd";
import dayjs from "dayjs";
import { FilterConfirmProps } from "antd/es/table/interface";
import { getColumnSearchProps } from "@/helpers/CommonTable";
import { MESSAGE_VALIDATE_BASE } from "@/constants/MessageConstant";
import { disabledDateBefore, dateFormatList } from "@/helpers/DateHelper";
import { ProFormText, QueryFilter } from "@ant-design/pro-components";
import { EditBook } from "@/scenes/User/MyBook/type";
import DawerBook from "@/component/DrawerBook";
import { getObjectByIdInArray } from "@/helpers/fuctionHepler";
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
    onOk: (item: any) => void;
    content: JSX.Element;
    width: string | number;
  };
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
  clubName: string;
}
type DataIndexBooks = keyof DataTypeBooks;
type ClubBookTableSource = {
  data: Array<DataTypeBooks>;
  total:number;
}
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};
const { TextArea } = Input;

const ClubStaff = () => {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const bookClubName = useRef<string>("");
  const [activeModal, setActiveModal] = useState("");
  const [clubBookTableSource, setClubBookTableSource] = useState<ClubBookTableSource>();

  const [form] = Form.useForm();
  const [option, setOption] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState<any>("Add Book");
  const [bookEdit, setBookEdit] = useState<any>(null);
  const [idBook, setIdBook] = useState<any>(null);

  const handleTableChange = (pagination: any) => {
    console.log(pagination,"pagination");
    
    setOption({
      ...option,
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndexBooks,
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

  const handleOpenViewAllModal = () => {
    // fetchClubBookList();
    setActiveModal(MODAL_CODE.VIEW_ALL);
  };
  useEffect(() => {
    const searchForm: ClubStaffBookListParams = {
      page: option.pageIndex,
      pageSize: option.pageSize,
      searchText: option.filter,
    }
    fetchClubBookList(searchForm);
  }, [option]);
  const fetchClubBookList = useCallback((searchForm: ClubStaffBookListParams) => {
    setLoading(true);
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
              clubName: item.membership.book_club.name,
              totalCopyCount: 0,
            };
            return book;
          });
          setClubBookTableSource({
            data,
            total: response.data.count,
          });
          bookClubName.current = data[0].clubName;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [option]);

  const columnsBookList: ColumnsType<DataTypeBooks> = [

   
    {
      title: "",
      width: "8%",
      dataIndex: "image",
      key: "image",
      render: (image: string) => <Avatar shape="square" size={98} src={image} />,
    },
    {
      title: "Name",
      dataIndex: "bookName",
      width: "25%",
      key: "bookName",
    },
    {
      title: "Member Name",
      dataIndex: "memberName",
      key: "memberName",
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
    {
      title: "Action",
      key: "id",
      dataIndex: ["id"],
      width: "5%",
      render: (_values: any) => {

        return (
          <Dropdown menu={menuProps} trigger={['click']}>
            <a onClick={(e) => {
              e.preventDefault()
              setIdBook(_values)
              console.log("_values", _values)
            }
            }>
              <Space>
                <MoreOutlined />
              </Space>
            </a>
          </Dropdown>
        );
      },
      fixed: 'right',
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

  const items: MenuProps['items'] = [
    {
      label: "Asign to club",
      key: '0',
      // icon: <UserOutlined />,
    },
    {
      label: "Edit",
      key: '1',
    },
    {
      type: 'divider',
    },
    {
      label: 'Delete',
      key: '2',
    },
  ];

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    console.log('click', e);
    if (e.key === '0') {
      console.log("000000");
      // handleOpenShareBook(null)

    } else if (e.key === '1') {
      console.log("11111111");
      setOpen(true)

      const tempBookEdit = getObjectByIdInArray(clubBookTableSource?.data, idBook)

      // const bookEdit: EditBook = {
      //   id: tempBookEdit.id,
      //   bookName: tempBookEdit.bookName,
      //   bookCategory: tempBookEdit.bookCategory,
      //   bookAuthor:
      //   bookPublisher: 
      //   bookImage: 
      //   createdAt: 
      //   updatedAt: 
      //   bookStatus: 
      //   bookDepositPrice: 
      //   bookDepositStatus: 
      //   user: 
      // }
      
      setBookEdit(bookEdit)
      setTitle("Edit Book")

    } else if (e.key === '2') {
      console.log("click Delete");

    }
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  


  // const modalContent: ModalContent = {
  //   order: {
  //     title: "Book Order",
  //     width: 800,
  //     onOk: handleOrderBooks,
  //     content: (
  //       <>
  //         {
  //           <Form {...layout} form={form} name="control-ref" style={{ width: 800 }}>
  //             <Form.Item
  //               name="full_name"
  //               label="Full Name"
  //               rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} full name` }]}
  //             >
  //               <Input disabled />
  //             </Form.Item>
  //             <Form.Item
  //               name="phone_number"
  //               label="Phone Number"
  //               rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} phone number` }]}
  //             >
  //               <Input disabled />
  //             </Form.Item>
  //             <Form.Item
  //               label="Select Books"
  //               name="select_books"
  //               rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} select at least one book` }]}
  //             >
  //               <Select placeholder="Find books..." mode="multiple" showArrow style={{ width: "100%" }}>
  //                 {clubBookList.map((item: DataTypeBooks) => {
  //                   return (
  //                     <Select.Option value={item.id + "-" + item.bookName}>{`${
  //                       item.memberName + " - " + item.bookName
  //                     }`}</Select.Option>
  //                   );
  //                 })}
  //               </Select>
  //             </Form.Item>
  //             <Form.Item
  //               name="due_date"
  //               label="Due Date"
  //               rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} due date` }]}
  //             >
  //               <DatePicker disabledDate={disabledDateBefore} style={{ width: "100%" }} format={dateFormatList} />
  //             </Form.Item>
  //             <Form.Item name="note" label="Note" rules={[{ required: false }]}>
  //               <TextArea rows={4} placeholder="Note..." />
  //             </Form.Item>
  //           </Form>
  //         }
  //       </>
  //     ),
  //   },
  //   deposit: {
  //     title: "Deposit Books",
  //     width: 800,
  //     onOk: handleDepositBooks,
  //     content: <>{/* Content for deposit modal */}</>,
  //   },
  //   withdraw: {
  //     title: "Withdraw Books",
  //     width: 800,
  //     onOk: handleWithdrawBooks,
  //     content: <>{/* Content for withdraw modal */}</>,
  //   },
  //   view_all: {
  //     title: `${bookClubName.current}`,
  //     width: "60%",
  //     onOk: handleWithdrawBooks,
  //     content: (
  //       <>
  //         <Table
  //           scroll={{ x: 1500, y: 700 }}
  //           pagination={{
  //             total: clubBookList.length,
  //             pageSize: option.pageSize,
  //             current: option.pageIndex,
  //           }}
  //           onChange={handleTableChange}
  //           loading={loading}
  //           columns={columnsBookList}
  //           dataSource={clubBookList}
  //         />
  //       </>
  //     ),
  //   },
  // };

  return (
    <StyledClubStaffList>
      <div className="table-extra-content">
        <h1>{bookClubName.current}</h1>
        {/* <Button type="primary" loading={loading}>
          Club Books
        </Button> */}
        <Button type="primary" onClick={() => {
          setOpen(true)
          setTitle("Add Book")
        }}>
          Add Book
        </Button>
      </div>
      <QueryFilter
        style={{ padding: 10 }}
        layout="vertical"
        resetText={"Reset"}
        searchText={"Search"}
        className="home-page-search_book"
        onFinish={(data) => {
          setOption({
            pageIndex: 1,
            pageSize: 10,
            ...data,
          });

          return Promise.resolve(true);
        }}
        onReset={() => {
          setOption({
            pageIndex: 1,
            pageSize: 10,
          });
        }}
      >
        <ProFormText
          labelAlign="right"
          style={{ display: "flex" }}
          name="filter"
          label={"Search"}
          placeholder={"Input name to search"}
        />
      </QueryFilter>
      <Table
        scroll={{ x: 1500, y: 700 }}
        pagination={{
          total: clubBookTableSource?.total,
          pageSize: option.pageSize,
          current: option.pageIndex,
        }}
        onChange={handleTableChange}
        loading={loading}
        columns={columnsBookList}
        dataSource={clubBookTableSource?.data}
      />
      <DawerBook open={open} onClose={() => setOpen(false)} fetchBookList={fetchClubBookList} bookEdit={bookEdit} title={title} />
      {/* {activeModal && (
        <Modal
          width={modalContent[activeModal].width}
          {...layout}
          title={modalContent[activeModal].title}
          open={activeModal !== ""}
          onCancel={handleCloseModal}
          onOk={modalContent[activeModal].onOk}
          destroyOnClose={true}
        >
          <StyledModalContent>{modalContent[activeModal].content}</StyledModalContent>
        </Modal>
      )} */}
    </StyledClubStaffList>
  );
};

export default ClubStaff;
