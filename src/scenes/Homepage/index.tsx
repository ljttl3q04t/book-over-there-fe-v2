import { ProFormText, QueryFilter } from "@ant-design/pro-form";
import {
  Button,
  Typography,
  Affix,
  Modal,
  Form,
  Input,
  List,
  Avatar,
  DatePicker,
  notification,
  Space,
  Card,
} from "antd";
import Table, { ColumnsType } from "antd/es/table";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { RightOutlined, PlusCircleOutlined } from "@ant-design/icons";
import CardBook from "../../component/CardBook";
import { UserContext } from "@/context/UserContext";

import "semantic-ui-css/semantic.min.css";
import "react-multi-carousel/lib/styles.css";
import Carousel from "react-multi-carousel";
import { getDeviceType } from "@/helpers/fuctionHepler";
import Section from "@/component/carousel/Section";
import "./style.scss";
import bookService from "@/services/book";
import styled from "styled-components";
import ClubService from "@/services/club";
import BookService from "@/services/book";
import Image from "@/component/Image";
import defaultImage from "@/image/book-default.png";
import { MESSAGE_VALIDATE_BASE } from "@/constants/MessageConstant";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import dfbServices from "@/services/dfb";
import { DataTypeClubBook, DataTypeClubSlide } from "./types";
import { CreateOrderDraftOptions } from "@/services/types";
const { Title } = Typography;

const StyledHomeContainer = styled.div`
  border-radius: 12px;
  padding: 30px;
  background: #fff;
  width: 100%;
  margin-top: 30px;
  box-shadow: 0 20px 27px rgb(0 0 0/5%);
  > .table-header {
    align-items: end;
    grid-template-columns: 1fr 100px;
    grid-column: 50% 200px;
    display: grid;
    /* -webkit-box-pack: justify; */
    /* justify-content: space-between; */
    padding-bottom: 20px;
  }
`;
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
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};
interface ModalContent {
  [key: string]: {
    title: any;
    onOk: () => void;
    content: JSX.Element;
    width: string | number;
  };
}
const { TextArea } = Input;
const calculateChunksSize = () => {
  const screenWidth = window.innerWidth - 322; // Get the width of the screen
  const itemWidth = 280; // Width of each carousel item
  const gutter = 16; // Optional gutter between items if any

  const availableWidth = screenWidth - gutter; // Adjust for gutter if needed
  const chunksSize = Math.floor(availableWidth / itemWidth);

  return chunksSize;
};
const MODAL_CODE = {
  ORDER: "order",
};
const initialValues = {
  order_date: dayjs(),
  due_date: dayjs().add(35, "day"),
};
const Homepage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [bookList, setBookList] = useState<any>([]);
  const [option, setOption] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const [clubList, setClubList] = useState<DataTypeClubSlide[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<[]>([]);

  const [clubId, setClubId] = useState(0);
  const [activeModal, setActiveModal] = useState("");
  const [form] = Form.useForm();

  const [, setChunksSize] = useState(calculateChunksSize());
  const tableBookRef = useRef(null);
  const executeScroll = () => tableBookRef.current.scrollIntoView({ behavior: "smooth", block: "start" }); // run this function from an event handler or pass it to useEffect to execute scroll
  const { user } = useContext(UserContext);
  const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: any) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(selectedRows);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const handleOpenOrderModal = async () => {
    if (user?.is_verify !== true) {
      notification.warning({
        message: t("You need to verify your phone number first!") as string,
      });
      return;
    }
    setActiveModal(MODAL_CODE.ORDER);
    form.setFieldsValue({
      full_name: user?.full_name,
      phone_number: user?.phone_number,
      address: user?.address,
    });
  };
  const handleCloseModal = async () => {
    form.resetFields();
    setActiveModal("");
  };
  const disableOrder = () => {
    if (selectedRows.length === 0 || !user) {
      return true;
    }
    return false;
  };
  const handleCreateOrder = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const data: CreateOrderDraftOptions = {
        user_id: user?.user_id ?? 0,
        club_id: clubId,
        order_date: dayjs(values.order_date?.toDate()).format("YYYY-MM-DD"),
        due_date: dayjs(values.due_date?.toDate()).format("YYYY-MM-DD"),
        club_book_ids: selectedRows.map((d) => d.id).join(","),
        notes: values.note,
        full_name: values.full_name,
        phone_number: values.phone_number,
        address: values.address,
      };
      const message = await dfbServices.createDraftOrder(data);
      notification.success({ message: message, type: "success" });
      form.resetFields();
    } catch (error: any) {
      console.error(error);
      notification.error({ message: error.message });
    } finally {
      setActiveModal("");
      setLoading(false);
    }
  };
  const fetchClubList = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ClubService.getListClub();
      const clubs = response.data;
      const clubList = await Promise.all(
        clubs.map(async (item: any) => {
          try {
            const clubBookIds = await BookService.getClubBookIds({ club_id: item.id });
            const clubBookInfos = await BookService.getClubBookInfos(clubBookIds.slice(0, 10));
            const clubBookInfor = Object.values(clubBookInfos)
              .map((item, index) => {
                const book: DataTypeClubBook = {
                  no: index + 1,
                  authorName: item.book.author?.name ?? "",
                  bookName: item.book?.name,
                  categoryName: item.book.category?.name ?? "",
                  publisherName: "",
                  image: item.book?.image ?? "",
                  club: item.club_id.toString(),
                  totalCopyCount: item.current_count,
                };
                return book;
              })
              .slice(0, 6);

            const clubSlide: DataTypeClubSlide = {
              clubName: item.name,
              clubId: item.id,
              clubBookIds,
              clubBookInfor,
              clubCode: item.code,
              details: item.details,
            };
            return clubSlide;
          } catch (error) {
            return null;
          }
        }),
      );

      const filteredClubList: DataTypeClubSlide[] = clubList.filter(
        (item) => item && item.clubCode && item.clubCode.startsWith("dfb"),
      );
      setClubList(filteredClubList);
      setClubId(filteredClubList[0].clubId);
      await handleViewAllClubBooks(filteredClubList[0].clubBookIds, clubId);
    } catch (error) {
      // Handle error here
    } finally {
      setLoading(false);
    }
  }, []);
  const handleViewAllClubBooks = async (clubBookIds: number[], clubId?: any) => {
    try {
      setLoading(true);
      if (clubId) setClubId(clubId);
      if (!clubBookIds.length) {
        setBookList([]);
      } else {
        const clubBookInfos = await BookService.getClubBookInfos(clubBookIds.slice(0, 200));
        setBookList(clubBookInfos);
      }
      setLoading(false);
    } catch (error) {
      console.error("error", error);
      // Handle error
    }
  };
  const handleSearchTable = async (data: any) => {
    const { book_name, book_category } = data;
    const _clubBookIds = await bookService.getClubBookIds({ club_id: clubId, book_name, book_category });
    handleViewAllClubBooks(_clubBookIds);
  };
  useEffect(() => {
    fetchClubList();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setChunksSize(calculateChunksSize());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleTableChange = (pagination: any) => {
    setOption({
      ...option,
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    });
  };
  const columns: ColumnsType<any> = [
    {
      title: "",
      dataIndex: ["book", "image"],
      key: "",
      render: (_values: any) => {
        return (
          <>
            <Image alt="pic" style={{ width: 50, height: 50 }} src={_values} />
          </>
        );
      },
    },
    {
      title: "Name",
      dataIndex: ["book", "name"],
      key: "name",
    },
    {
      title: t("Category") as string,
      dataIndex: ["book", "category"],
      key: "category",
      render: (category: any) => {
        return category?.name;
      },
    },
    {
      title: t("Author") as string,
      dataIndex: ["book", "author"],
      key: "author",
      render: (author: any) => {
        return author?.name;
      },
    },
  ];

  const [deviceType, setDeviceType] = useState("");

  useEffect(() => {
    const handleResize = () => {
      const newDeviceType = getDeviceType();
      setDeviceType(newDeviceType);
    };
    handleResize(); // Initial check
    // Attach event listener for window resize
    window.addEventListener("resize", handleResize);
    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1550 },
      items: 5,
      paritialVisibilityGutter: 60,
    },
    desktop1: {
      breakpoint: { max: 1550, min: 1024 },
      items: 4,
      paritialVisibilityGutter: 50,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      paritialVisibilityGutter: 40,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      paritialVisibilityGutter: 30,
    },
  };
  const defaultFormContent = (onFinish: any, optionalField?: JSX.Element) => {
    return (
      <>
        <Form
          initialValues={initialValues}
          onFinish={onFinish}
          {...layout}
          form={form}
          name="control-ref"
          style={{ width: 800 }}
        >
          <Form.Item
            name="full_name"
            label={t("Full Name") as string}
            rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} full name` }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="phone_number"
            label={t("Phone Number") as string}
            rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} phone number` }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="address"
            label={t("Address") as string}
            rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} address` }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="order_date"
            label={t("Order Date") as string}
            rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} order time` }]}
          >
            <DatePicker disabled format={["DD/MM/YYYY"]} />
          </Form.Item>

          <Form.Item
            name="due_date"
            label={t("Due Date") as string}
            rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} order time` }]}
          >
            <DatePicker disabled format={["DD/MM/YYYY"]} />
          </Form.Item>
          {optionalField}
        </Form>
      </>
    );
  };
  const modalContent: ModalContent = {
    order: {
      title: "Book Order",
      width: 800,
      onOk: () => {},
      content: defaultFormContent(
        handleCreateOrder,
        <>
          <Form.Item name="selected_book" label={t("Selected Books") as string} rules={[{ required: false }]}>
            <List
              itemLayout="horizontal"
              dataSource={selectedRows}
              renderItem={(item: any) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.book.image ? item.book.image : defaultImage} />}
                    title={<p>{item.book.name}</p>}
                  />
                </List.Item>
              )}
            />{" "}
          </Form.Item>
          <Form.Item name="note" label={t("Notes") as string} rules={[{ required: false }]}>
            <TextArea rows={4} />
          </Form.Item>
        </>,
      ),
    },
  };
  return (
    <>
      <StyledHomeContainer>
        {clubList &&
          clubList.map((item: DataTypeClubSlide) => (
            <div className="club">
              <div onClick={() => handleViewAllClubBooks(item.clubBookIds, item.clubId)} className="carousel-title">
                <Title level={2} style={{ margin: 0 }}>
                  <a style={{ textDecoration: "none" }} onClick={() => executeScroll()} rel="noopener noreferrer">
                    {item.clubName}
                  </a>
                  <span onClick={() => executeScroll()} className="extra-title">
                    <>{t("homePage.seeAll")}</> <RightOutlined style={{ fontSize: "18px" }} />
                  </span>
                </Title>
              </div>
              <Space direction="vertical" size="large" style={{ display: "flex" }}>
                <Card title={t("Introduce") as string} size="default">
                  <p>{item.details.description}</p>
                  {item.details.address && <p>{`${t("Address") as string}: ${item.details.address}`}</p>}
                  {item.details.time_open && <p>{`${t("Open time") as string}: ${item.details.time_open}`}</p>}
                  {item.details.phone_number && <p>{`${t("Contact") as string}: ${item.details.phone_number}`}</p>}
                  {item.details.facebook && (
                    <a href={item.details.facebook} target="_blank" rel="noopener noreferrer">
                      {item.details.facebook}
                    </a>
                  )}
                </Card>
              </Space>
              <Section>
                <Carousel
                  swipeable={true}
                  draggable={true}
                  showDots={false}
                  responsive={responsive}
                  ssr={true} // means to render carousel on server-side.
                  infinite={true}
                  // autoPlay={deviceType !== "mobile" ? true : false}
                  // autoPlay={false}
                  autoPlaySpeed={3000}
                  keyBoardControl={true}
                  // customTransition="linear 1"
                  transitionDuration={300}
                  containerClass="carousel-container"
                  removeArrowOnDeviceType={["tablet", "mobile"]}
                  deviceType={deviceType}
                  dotListClass="custom-dot-list-style"
                  itemClass="image-item"
                >
                  {item.clubBookInfor.map((book: DataTypeClubBook, index) => (
                    <CardBook
                      srcImg={book.image}
                      key={index}
                      height="400px"
                      content={{
                        title: book.bookName,
                        description: book.publisherName,
                      }}
                      router={`/book-detail/:id}`}
                    />
                  ))}
                </Carousel>
              </Section>
            </div>
          ))}
      </StyledHomeContainer>
      <StyledHomeContainer ref={tableBookRef}>
        <div className="table-header">
          {" "}
          <QueryFilter
            style={{ padding: 0 }}
            layout="vertical"
            resetText={"Reset"}
            searchText={"Search"}
            className="home-page-search_book"
            onFinish={async (data) => handleSearchTable(data)}
            onReset={() => {
              handleSearchTable({});
            }}
          >
            <ProFormText
              labelAlign="right"
              style={{ display: "flex" }}
              name="book_name"
              label={"Search"}
              placeholder={"Input book name to search"}
            />
          </QueryFilter>
          <Button
            disabled={disableOrder()}
            icon={<PlusCircleOutlined />}
            onClick={() => handleOpenOrderModal()}
            type="primary"
          >
            {t("Order") as string}
          </Button>
        </div>

        <Table
          loading={loading}
          scroll={{ x: "max-content" }}
          columns={columns}
          dataSource={bookList}
          onChange={handleTableChange}
          rowSelection={rowSelection}
          rowKey="id"
          pagination={{
            total: bookList.length,
            pageSize: option.pageSize,
            current: option.pageIndex,
          }}
        />
      </StyledHomeContainer>
      <Affix style={{ position: "absolute", bottom: 30, right: 40, zIndex: 999 }}>
        <Button icon={<PlusCircleOutlined />} type="primary" onClick={() => executeScroll()}>
          {t("Go to order") as string}
        </Button>
      </Affix>
      {activeModal && (
        <Modal
          // closable={false}
          width={modalContent[activeModal].width}
          {...layout}
          title={modalContent[activeModal].title}
          open={activeModal !== ""}
          onCancel={handleCloseModal}
          onOk={() => form.submit()}
          destroyOnClose={true}
          maskClosable={false}
          footer={[
            <Button key="back" onClick={handleCloseModal}>
              {t("Cancel") as string}
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
              {t("Submit") as string}
            </Button>,
          ]}
        >
          <StyledModalContent>{modalContent[activeModal].content}</StyledModalContent>
        </Modal>
      )}
    </>
  );
};

export default Homepage;
