/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import Table, { ColumnsType } from "antd/es/table";
import { MoreOutlined } from "@ant-design/icons";

import styled from "styled-components";
import ClubService, { ClubStaffBookListParams } from "@/services/club";

import { Button, Form, Input, InputRef, Space, Select, Avatar, Dropdown, MenuProps, notification } from "antd";
import dayjs from "dayjs";
import { FilterConfirmProps } from "antd/es/table/interface";
import { getColumnSearchProps } from "@/helpers/CommonTable";
import { MESSAGE_VALIDATE_BASE } from "@/constants/MessageConstant";
import { disabledDateBefore, dateFormatList } from "@/helpers/DateHelper";
import { ProFormText, QueryFilter } from "@ant-design/pro-components";
import { EditBook } from "@/scenes/User/MyBook/type";
import DrawerBook from "@/component/DrawerBook";
import { getObjectByIdInArray } from "@/helpers/fuctionHepler";
import TableBook from "@/component/TableBook";
import { BookClubInfo, CategoryInfos } from "@/services/types";
import userService from "@/services/user";
import dfbServices from "@/services/dfb";
import DrawerAddBook from "./DrawerAddBook";
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
  total: number;
};
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};
const { TextArea } = Input;

const ClubStaff = () => {
  const [loading, setLoading] = React.useState(false);
  const [clubBookIds, setClubBookIds] = React.useState<number[]>([]);
  const [staffClubs, setStaffClubs] = React.useState<BookClubInfo[]>([]);
  const [categories, setCategories] = React.useState<CategoryInfos[]>([]);
  const [searchText, setSearchText] = React.useState("");
  const [searchedColumn, setSearchedColumn] = React.useState("");
  const searchInput = React.useRef<InputRef>(null);
  const bookClubName = React.useRef<string>("");
  const [activeModal, setActiveModal] = React.useState("");
  const [clubBookTableSource, setClubBookTableSource] = React.useState<ClubBookTableSource>();

  const [form] = Form.useForm();
  const [option, setOption] = React.useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState<any>("Add Book");
  const [bookEdit, setBookEdit] = React.useState<any>(null);
  const [idBook, setIdBook] = React.useState<any>(null);

  const fetchInit = async () => {
    try {
      setLoading(true);
      const clubs: BookClubInfo[] = await userService.getStaffClubs();
      const _categories = await dfbServices.getCategoryList();
      setCategories(_categories);
      setStaffClubs(clubs);
      const _clubBookIds = await dfbServices.getClubBookIds({ clubs });
      setClubBookIds(_clubBookIds);
      setLoading(false);
    } catch (error: any) {
      notification.error({ message: error.message });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchInit();
  }, []);

  const handleTableChange = (pagination: any) => {
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

  React.useEffect(() => {
    const searchForm: ClubStaffBookListParams = {
      page: option.pageIndex,
      pageSize: option.pageSize,
      searchText: option.filter,
    };
    fetchClubBookList(searchForm);
  }, [option]);

  const fetchClubBookList = React.useCallback(
    (searchForm: ClubStaffBookListParams) => {
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
    },
    [option],
  );

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
          <Dropdown menu={menuProps} trigger={["click"]}>
            <a
              onClick={(e) => {
                e.preventDefault();
                setIdBook(_values);
              }}
            >
              <Space>
                <MoreOutlined />
              </Space>
            </a>
          </Dropdown>
        );
      },
      fixed: "right",
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

  const items: MenuProps["items"] = [
    {
      label: "Asign to club",
      key: "0",
      // icon: <UserOutlined />,
    },
    {
      label: "Edit",
      key: "1",
    },
    {
      type: "divider",
    },
    {
      label: "Delete",
      key: "2",
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "1") {
      setOpen(true);
      setBookEdit(bookEdit);
      setTitle("Edit Book");
    }
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <StyledClubStaffList>
      <div className="table-extra-content">
        <h1>{bookClubName.current}</h1>
        {/* <Button type="primary" loading={loading}>
          Club Books
        </Button> */}
        <Button
          type="primary"
          onClick={() => {
            setOpen(true);
            setTitle("Add Book");
          }}
        >
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
      {/* <Table
        scroll={{ x: 1500, y: 700 }}
        onChange={handleTableChange}
        loading={loading}
        columns={columnsBookList}
        dataSource={clubBookTableSource?.data}
      /> */}
      <TableBook loading={loading} setLoading={setLoading} clubBookIds={clubBookIds} />
      <DrawerAddBook
        open={open}
        onClose={() => setOpen(false)}
        fetchBookList={fetchClubBookList}
        bookEdit={bookEdit}
        title={title}
        categories={categories}
      />
      {/* <DrawerBook
        open={open}
        onClose={() => setOpen(false)}
        fetchBookList={fetchClubBookList}
        bookEdit={bookEdit}
        title={title}
      /> */}
    </StyledClubStaffList>
  );
};

export default ClubStaff;
