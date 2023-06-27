import { Avatar, Button, Select, Dropdown, Space, MenuProps, Form, SelectProps, Modal } from "antd";
import { MoreOutlined } from '@ant-design/icons';
import Table, { ColumnsType } from "antd/es/table";
import React, { useCallback, useEffect, useState } from "react";
import type { FormInstance } from "antd/es/form";
import styled from "styled-components";

import DawerBook from "../../../component/DrawerBook";
import bookService from "../../../services/book";
import { BookCopy, Club, ListView } from "../../../services/types";
import clubService from "@/services/club";
import userService from "@/services/user";

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

function MyBook() {
  const [books, setBooks] = useState<BookCopy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  const [modalJoin, setModalJoin] = useState(false);
  const formRef = React.useRef<FormInstance>(null);
  const [idBook, setIdBook] = useState<any>(null);
  const [clubListJoined, setClubListJoined] = useState<Club[]>([]);


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
        console.log("formValues: ",formValues);
        
        // const data = {
        //   // club_id: clubId,
        //   full_name: formValues.full_name,
        //   phone_number: formValues.phone_number,
        //   email: formValues.email,
        //   address: formValues.address,
        //   reason: formValues.reason,
        // };

      })
      .catch((_errors) => {
        // notification.info({ message: "Please make sure that you enter all field" });
      });
  };

  const fetchBookList = useCallback(async () => {
    try {
      setLoading(true);
      const response: BookCopy[] = await bookService.getMyBookList();
      setBooks(response);
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
      console.log("response club joined list: ", response);

      setClubListJoined(response.data);
      setLoading(false);
    } catch (error) {
      console.error("error", error);
      // Handle error
    }
  }, []);

  useEffect(() => {
    fetchClubList();
  }, []);

  useEffect(() => {
    fetchBookList();
  }, [fetchBookList]);

  const columns: ColumnsType<any> = [
    {
      title: "Avatar",
      dataIndex: ["book", "image"],
      key: "avatar",
      render: (image: string) => <Avatar shape="square" size={98} src={image} />,
    },
    {
      title: "Name",
      dataIndex: ["book", "name"],
      key: "name",
    },
    {
      title: "BookStatus",
      dataIndex: "book_status",
      key: "book_status",
    },
    {
      title: "Category",
      dataIndex: ["book", "category", "name"],
      key: "category",
    },
    {
      title: "Author",
      dataIndex: ["book", "author", "name"],
      key: "author",
    },
    {
      title: "Publisher",
      dataIndex: ["book", "publisher", "name"],
      key: "publisher",
    },

    {
      title: "Stauts",
      dataIndex: ["book_status"],
      key: "book_status",
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
    // {
    //   label: "Add to cart",
    //   key: '1',
    // },
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
      <DawerBook open={open} onClose={() => setOpen(false)} />
      <Modal width={800} open={modalJoin} onCancel={handleCloseJoin} onOk={onFinish}>
        <Form {...layout} ref={formRef} name="control-ref" style={{ width: 800 }}>
          <Form.Item name="book_copy_ids" label="My books" rules={[{ required: true }]}>
            <Select
              mode="multiple"
              size='middle'
              placeholder="Please select"
              // defaultValue={['a10', 'c12']}
              onChange={handleChange}
              style={{ width: '100%' }}
            // options={books}
            >{
                books.map((book, index) => {
                  if (book.book_status !== 'sharing_club') {
                    return (
                      <Option key={index} value={book.id} label={book.book.name}>
                        <div className="demo-option-label-item">
                          {/* <span role="img" aria-label="China">
                          🇨🇳
                        </span> */}
                          {book.book.name}
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
              // defaultValue={['a10', 'c12']}
              onChange={handleChange}
              style={{ width: '100%' }}
            // options={books}
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
