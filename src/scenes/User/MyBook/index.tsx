import { Avatar, Tag, InputRef, Button, Select, Dropdown, Space, MenuProps, Form, notification, SelectProps, Modal } from "antd";
import { MoreOutlined } from '@ant-design/icons';
import Table, { ColumnsType } from "antd/es/table";
import React, { useCallback, useEffect, useState, useRef } from "react";
import type { FormInstance } from "antd/es/form";
import styled from "styled-components";

import DawerBook from "@/component/DrawerBook";
import bookService from "@/services/book";
import { BookCopy, Club, ListView } from "@/services/types";
import userService from "@/services/user";
import { FilterConfirmProps } from "antd/lib/table/interface";
import { getColumnSearchProps } from "@/helpers/CommonTable";

const StyledMyBookContainer = styled.div`
  border-radius: 12px;
  padding: 30px;
  background: #fff;
  width: 100%;
  margin-top: 70px;
  box-shadow: 0 20px 27px rgb(0 0 0/5%);
  > .table-header {
    display: flex;
    justify-content: space-between;
    padding-bottom: 20px;
  }
`;
const { Option } = Select;
const options: SelectProps['options'] = [];

for (let i = 10; i < 36; i++) {
  options.push({
    value: i.toString(36) + i,
    label: i.toString(36) + i,
  });
}

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

const statusColors:any = {
  sharing_club: "green",
  new: "geekblue",
};

function MyBook() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  const [modalJoin, setModalJoin] = useState(false);
  const formRef = React.useRef<FormInstance>(null);
  const [idBook, setIdBook] = useState<any>(null);
  const [clubListJoined, setClubListJoined] = useState<Club[]>([]);
  const [bookEdit, setBookEdit] = useState<any>(null);


  const handleCloseJoin = () => {
    formRef.current?.resetFields();
    setModalJoin(false);
  };

  const handleOpenJoin = (_item: any) => {
    // setClubId(_item.id);
    setModalJoin(true);
  };

  const onFinish = (_values: any) => {
    formRef.current
      ?.validateFields()
      .then((formValues) => {
        const data = {
          book_copy_ids: formValues.book_copy_ids,
          club_id: formValues.club_id
        };
        shareBooksToClub(data)

      })
      .catch((_errors) => {
        notification.info({ message: "Please make sure that you enter all field" });
      });
  };

  const fetchBookList = useCallback(async () => {
    try {
      setLoading(true);
      const response: BookCopy[] = await bookService.getMyBookList();
      const data = response.map((item: any, index: any) => {
        return {
          id: item.id,
          bookName: item?.book?.name,
          bookCategory: item?.book?.category?.name,
          bookAuthor: item?.book?.author?.name,
          bookPublisher: item?.book?.publisher?.name,
          bookImage: item?.book?.image,
          createdAt: item?.created_at,
          iupdatedAt: item?.updated_at,
          bookStatus: item?.book_status,
          bookDepositPrice: item?.book_deposit_price,
          bookDepositStatus: item?.book_deposit_status,
          user: item?.user
        }
      })
      setBooks(data)
      setLoading(false);
    } catch (error) {
      console.error("error", error);
      // Handle error
    }
  }, []);

  const fetchClubList = useCallback(async () => {
    try {
      setLoading(true);
      const response: any = await userService.getUserMembership();

      setClubListJoined(response.data);
      setLoading(false);
    } catch (error) {
      console.error("error", error);
      // Handle error
    }
  }, []);

  const shareBooksToClub = useCallback(async (data: any) => {
    try {
      setLoading(true);
      const response: any = await userService.getUserShareClub(data);
      console.log("response getUserShareClub: ", response);
      setLoading(false);
      handleCloseJoin()
      fetchBookList()
      notification.info({ message: response.data.result });
    } catch (error) {
      console.error("error", error);
      notification.error({ message: "System error" });
      // Handle error
    }
  }, []);

  useEffect(() => {
    fetchClubList();
  }, []);

  useEffect(() => {
    fetchBookList();
  }, [fetchBookList]);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  type DataIndex = keyof BookCopy;
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

  const columns: ColumnsType<any> = [
    {
      title: "Avatar",
      dataIndex: "bookImage",
      key: "avatar",
      render: (image: string) => <Avatar shape="square" size={98} src={image} />,
    },
    {
      title: "Name",
      dataIndex: "bookName",
      key: "bookName",
      ...getColumnSearchProps("bookName", searchInput,
        searchText, setSearchText, searchedColumn, setSearchedColumn,
        handleReset, handleSearch),
    },
    {
      title: "BookStatus",
      dataIndex: "bookStatus",
      key: "bookStatus",
      render: (bookStatus: any) => {
        
        return (
          <Tag color={statusColors[bookStatus]} key={status}>
            {bookStatus}
          </Tag>
        );
      },
    },
    {
      title: "Category",
      dataIndex: "bookCategory",
      key: "category",
      ...getColumnSearchProps("bookCategory", searchInput,
        searchText, setSearchText, searchedColumn, setSearchedColumn,
        handleReset, handleSearch),
    },
    {
      title: "Author",
      dataIndex: "bookAuthor",
      key: "author",
      ...getColumnSearchProps("bookAuthor", searchInput,
        searchText, setSearchText, searchedColumn, setSearchedColumn,
        handleReset, handleSearch),
    },
    {
      title: "Publisher",
      dataIndex: "bookPublisher",
      key: "publisher",
      ...getColumnSearchProps("bookPublisher", searchInput,
        searchText, setSearchText, searchedColumn, setSearchedColumn,
        handleReset, handleSearch),
    },
    {
      title: "Action",
      key: "id",
      dataIndex: ["id"],
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
      handleOpenJoin(null)

    } else if (e.key === '1') {
      console.log("11111111");
      setOpen(true)
      const bookEdit = {
        category: 'category book',
        name: 'name Book'
      }
      setBookEdit(bookEdit)

    } else if (e.key === '2') {
      console.log("click Delete");

    }
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const handleChange = (value: string | string[]) => {
    console.log(`Selected: ${value}`);
  };

  return (
    <StyledMyBookContainer>
      <div className="table-header">
        <Button type="primary" onClick={() => setOpen(true)}>
          Add Book
        </Button>
        <Button type="primary" onClick={() => handleOpenJoin(null)}>
          Share my book
        </Button>
      </div>

      <Table
        scroll={{ x: "max-content" }}
        columns={columns}
        dataSource={books}
        loading={loading}
      />
      <DawerBook open={open} onClose={() => setOpen(false)} fetchBookList={fetchBookList} bookEdit={bookEdit} />
      <Modal title="Share to club" width={800} open={modalJoin} onCancel={handleCloseJoin} onOk={onFinish}>
        <Form {...layout} ref={formRef} name="control-ref" style={{ width: 800 }}>
          <Form.Item name="book_copy_ids" label="My books" rules={[{ required: true }]}>
            <Select
              mode="multiple"
              size='middle'
              placeholder="Please select"
              onChange={handleChange}
              style={{ width: '100%' }}
            >{
                books.map((book, index) => {
                  if (book.bookStatus !== 'sharing_club') {
                    return (
                      <Option key={index} value={book.id} label={book.bookName}>
                        <div className="demo-option-label-item">
                          {/* <span role="img" aria-label="China">
                          🇨🇳
                        </span> */}
                          {book.bookName}
                        </div>
                      </Option>
                    )
                  }

                })
              }

            </Select>
          </Form.Item>

          <Form.Item name="club_id" label="Asign to club" rules={[{ required: true }]}>
            <Select
              size='middle'
              placeholder="Please select"
              onChange={handleChange}
              style={{ width: '100%' }}
            >{
                clubListJoined.map((club, index) => (
                  <Option key={index} value={club?.id} label={club.book_club.name}>
                    <div className="demo-option-label-item">
                      {/* <span role="img" aria-label="China">
                        🇨🇳
                      </span> */}
                      {club.book_club.name} {clubListJoined.length}
                    </div>
                  </Option>
                ))
              }

            </Select>
          </Form.Item>

        </Form>
      </Modal>
    </StyledMyBookContainer>
  );
}

export default MyBook;
