import React, { useCallback, useEffect, useState, useRef } from "react";
import Table, { ColumnsType } from "antd/es/table";
import styled from "styled-components";
import ClubService from "@/services/club";
import { Avatar, DatePicker, Form, Input, InputRef, Modal } from "antd";
import { MESSAGE_VALIDATE_BASE } from "@/constants/MessageConstant";

import { getColumnSearchProps } from "@/helpers/CommonTable";
import { FilterConfirmProps } from "antd/es/table/interface";

const { RangePicker } = DatePicker;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

const StyledClubBookList = styled.div`
  border-radius: 12px;
  padding: 30px;
  background: #fff;
  width: 100%;
  margin-top: 30px;
`;
const StyledModalContent = styled.div`
  padding: 30px;
`;
interface DataType {
  no: number;
  bookName: string;
  categoryName: string;
  authorName: string;
  publisherName: string;
  image: string;
  club: string;
  totalCopyCount: number;
}
type DataIndex = keyof DataType;
const { TextArea } = Input;

const ClubBook = () => {
  const [loading, setLoading] = useState(false);
  const [clubBookList, setClubBookList] = useState<DataType[]>([]);
  const [modalOrder, setModalOrder] = useState(false);
  const [form] = Form.useForm();
  const [option, setOption] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const dateFormatList = ["DD/MM/YYYY"];
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
  const handleTableChange = (pagination: any) => {
    setOption({
      ...option,
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    });
  };
  const initFetch = useCallback(async () => {
    setLoading(true);
    ClubService.getClubBookList()
      .then((response) => {
        if (response.data) {
          const data = response.data.map((item: any, index: any) => {
            const book: DataType = {
              no: index + 1,
              authorName: item.author?.name,
              bookName: item.book?.name,
              categoryName: item.book?.category?.name,
              publisherName: item.book?.publisher?.name,
              image: item.book?.image,
              club: item.club,
              totalCopyCount: item.total_copy_count,
            };
            return book;
          });
          setClubBookList(data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    initFetch();
  }, []);

  const handleCloseOrder = () => {
    form.resetFields();
    setModalOrder(false);
  };
  const handleOkOrder = () => {
    form.validateFields();
  };
  const columns: ColumnsType<DataType> = [
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
    // {
    //   title: "Image",
    //   dataIndex: "image",
    //   key: "image",
    //   render: (image: string) => <Avatar shape="square" size={98} src={image} />,
    // },
    {
      title: "Club",
      dataIndex: "club",
      key: "club",
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
  return (
    <StyledClubBookList>
      <Table
        onChange={handleTableChange}
        pagination={{
          total: clubBookList.length,
          pageSize: option.pageSize,
          current: option.pageIndex,
        }}
        loading={loading}
        columns={columns}
        dataSource={clubBookList}
      />
      <Modal title="Book Order" width={800} open={modalOrder} onCancel={handleCloseOrder} onOk={handleOkOrder}>
        <StyledModalContent>
          <Form {...layout} form={form} name="control-ref" style={{ width: 800 }}>
            <Form.Item
              name="full_name"
              label="Full Name"
              rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} full name` }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="phone_number"
              label="Phone Number"
              rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} phone number` }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} email` }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} address` }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="order_range"
              label="Order Time"
              rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} order time` }]}
            >
              <RangePicker format={dateFormatList} />
              {/* <DatePicker disabledDate={disabledDate} style={{ width: "100%" }} format={dateFormatList} /> */}
            </Form.Item>
            <Form.Item name="note" label="Note" rules={[{ required: false }]}>
              <TextArea rows={4} placeholder="Note..." />
            </Form.Item>
          </Form>
        </StyledModalContent>
      </Modal>
    </StyledClubBookList>
  );
};

export default ClubBook;
