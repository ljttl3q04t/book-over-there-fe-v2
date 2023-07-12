/* eslint-disable react/react-in-jsx-scope */
import { ProFormText, QueryFilter } from "@ant-design/pro-form";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { Button, Col, Row, Typography, MenuProps, Dropdown, Space, Affix } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Layout } from "antd";
import {
  HeartTwoTone,
  EyeTwoTone,
  PlusCircleTwoTone,
  MoreOutlined,
  RightOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import CardBook from "../../component/CardBook";
import { getListBook } from "../../store/bookStore";
import { useNavigate } from "react-router-dom";

import "semantic-ui-css/semantic.min.css";
import "react-multi-carousel/lib/styles.css";
import Carousel from "react-multi-carousel";
import { getDeviceType } from "@/helpers/fuctionHepler";
import Section from "@/component/carousel/Section";
import "./style.scss";
import bookService from "@/services/book";
import styled from "styled-components";
import ClubService from "@/services/club";
const { Title } = Typography;

const StyledHomeContainer = styled.div`
  border-radius: 12px;
  padding: 30px;
  background: #fff;
  width: 100%;
  margin-top: 30px;
  box-shadow: 0 20px 27px rgb(0 0 0/5%);
  > .table-header {
    display: flex;
    justify-content: space-between;
    padding-bottom: 20px;
  }
`;
interface DataTypeClubBook {
  no: number;
  bookName: string;
  categoryName: string;
  authorName: string;
  publisherName: string;
  image: string;
  club: string;
  totalCopyCount: number;
}
const calculateChunksSize = () => {
  const screenWidth = window.innerWidth - 322; // Get the width of the screen
  const itemWidth = 280; // Width of each carousel item
  const gutter = 16; // Optional gutter between items if any

  const availableWidth = screenWidth - gutter; // Adjust for gutter if needed
  const chunksSize = Math.floor(availableWidth / itemWidth);

  return chunksSize;
};
const Homepage = () => {
  const [loading, setLoading] = useState(false);
  const [bookList, setBookList] = useState<any>({});
  const [option, setOption] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const [clubList, setClubList] = useState([]);
  const [clubBookList, setClubBookList] = useState([]);

  const [chunksSize, setChunksSize] = useState(calculateChunksSize());
  const navigate = useNavigate();
  const tableBookRef = useRef(null);
  const executeScroll = () => tableBookRef.current.scrollIntoView({ behavior: "smooth", block: "start" }); // run this function from an event handler or pass it to useEffect to execute scroll

  const fetchCLubList = useCallback(async () => {
    setLoading(true);
    ClubService.getListClub()
      .then((response) => {
        if (response.data) {
          const data = response.data.map((item: any, index: any) => {
            return { no: index + 1, ...item };
          });
          setClubList(data);
          fetchClubBookList();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  const fetchClubBookList = () => {
    ClubService.getClubBookList()
      .then((response) => {
        if (response.data) {
          const data = response.data
            .map((item: any, index: any) => {
              const book: DataTypeClubBook = {
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
            })
            .slice(0, 6);
          setClubBookList(data);
        }
      })
      .finally(() => {});
  };
  const getListBookInit = useCallback(async () => {
    try {
      setLoading(true);
      const response: any = await bookService.getListBook(option.pageIndex, option.pageSize, "");
      console.log("getListBookInit: ", response);
      setBookList(response.data);
      setLoading(false);
    } catch (error) {
      console.error("error", error);
      // Handle error
    }
  }, []);

  useEffect(() => {
    getListBookInit();
  }, [option]);

  useEffect(() => {
    fetchCLubList();
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
    console.log("pagination: ", pagination);

    setOption({
      ...option,
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    });
    console.log(".................: ", {
      ...option,
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
    });
  };
  const columns: ColumnsType<any> = [
    {
      title: "",
      dataIndex: "image",
      render: (_values: any) => {
        return (
          <>
            <img alt="pic" style={{ width: 50, height: 50 }} src={_values} />
          </>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category: any) => {
        return category?.name;
      },
    },
    {
      title: "Author",
      key: "author",
      dataIndex: "author",
      render: (category: any) => {
        return category?.name;
      },
    },
    {
      title: "Publisher",
      key: "publisher",
      dataIndex: "publisher",
      render: (category: any) => {
        return category?.name;
      },
    },
    {
      title: "Action",
      key: "",
      dataIndex: "",
      fixed: "right",
      render: (_values: any) => {
        return (
          <Dropdown menu={menuProps} trigger={["click"]}>
            <a
              onClick={(e) => {
                e.preventDefault();
                console.log("_values", _values);
              }}
            >
              <Space>
                <MoreOutlined />
              </Space>
            </a>
          </Dropdown>
        );
      },
    },
  ];

  const items: MenuProps["items"] = [
    {
      label: "View",
      key: "0",
      icon: <EyeTwoTone />,
    },
    {
      label: "Cart",
      key: "1",
      icon: <PlusCircleTwoTone />,
    },
    {
      label: "Wishlist",
      key: "2",
      icon: <HeartTwoTone twoToneColor="#eb2f96" />,
    },
    {
      type: "divider",
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    console.log("click", e);
    if (e.key === "0") {
      console.log("000000");
    } else if (e.key === "1") {
      console.log("11111111");
    } else if (e.key === "2") {
      console.log("click Delete");
    }
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const books = [
    { title: "Book 1", description: "Description 1" },
    { title: "Book 2", description: "Description 2" },
    { title: "Book 3", description: "Description 3" },
    { title: "Book 4", description: "Description 4" },
    { title: "Book 5", description: "Description 5" },
    { title: "Book 6", description: "Description 6" },
    { title: "Book 7", description: "Description 7" },
    { title: "Book 8", description: "Description 8" },
    { title: "Book 9", description: "Description 9" },
    { title: "Book 10", description: "Description 10" },
    { title: "Book 11", description: "Description 11" },
    { title: "Book 12", description: "Description 12" },
    { title: "Book 13", description: "Description 13" },
    { title: "Book 14", description: "Description 14" },
    { title: "Book 15", description: "Description 15" },
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

  return (
    <>
      <StyledHomeContainer>
        {clubList &&
          clubList.map((item: any) => (
            <div className="club">
              <div className="carousel-title">
                <Title level={2} style={{ margin: 0 }}>
                  <a style={{ textDecoration: "none" }} onClick={() => executeScroll()} rel="noopener noreferrer">
                    {item.name}
                  </a>
                  <span onClick={() => executeScroll()} className="extra-title">
                    See all <RightOutlined style={{ fontSize: "18px" }} />
                  </span>
                </Title>
              </div>
              <Section>
                <Carousel
                  swipeable={true}
                  draggable={true}
                  showDots={false}
                  responsive={responsive}
                  ssr={true} // means to render carousel on server-side.
                  infinite={true}
                  autoPlay={deviceType !== "mobile" ? true : false}
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
                  {clubBookList.map((book: DataTypeClubBook, index) => (
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
          loading={loading}
          scroll={{ x: "max-content" }}
          columns={columns}
          dataSource={bookList?.results}
          onChange={handleTableChange}
          pagination={{
            total: bookList.count,
            pageSize: option.pageSize,
            current: option.pageIndex,
          }}
        />
      </StyledHomeContainer>
      <Affix style={{ position: "absolute", bottom: 30, right: 40, zIndex: 999 }}>
        <Button icon={<PlusCircleOutlined />} type="primary" onClick={() => executeScroll()}>
          Go to order
        </Button>
      </Affix>
    </>
  );
};

export default Homepage;
