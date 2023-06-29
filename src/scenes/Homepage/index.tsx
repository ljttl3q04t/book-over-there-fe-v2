/* eslint-disable react/react-in-jsx-scope */
import { ProFormText, QueryFilter } from "@ant-design/pro-form";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { Button, Col, Row, Typography, MenuProps, Dropdown, Space } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Layout } from "antd";
import { HeartTwoTone, EyeTwoTone, PlusCircleTwoTone, MoreOutlined } from "@ant-design/icons";
import CardBook from "../../component/CardBook";
import { getListBook } from "../../store/bookStore";

import "semantic-ui-css/semantic.min.css";
import "react-multi-carousel/lib/styles.css";
import Carousel from "react-multi-carousel";
import { getDeviceType } from "@/helpers/fuctionHepler";
import Section from "@/component/carousel/Section";
import "./style.scss";
import bookService from "@/services/book";

const { Title } = Typography;

const calculateChunksSize = () => {
  const screenWidth = window.innerWidth - 322; // Get the width of the screen
  const itemWidth = 280; // Width of each carousel item
  const gutter = 16; // Optional gutter between items if any

  const availableWidth = screenWidth - gutter; // Adjust for gutter if needed
  const chunksSize = Math.floor(availableWidth / itemWidth);

  return chunksSize;
};
const Homepage = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const [loading, setLoading] = useState(false);
  const [bookList, setBookList] = useState<any>({});
  const [option, setOption] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const [chunksSize, setChunksSize] = useState(calculateChunksSize());

  // const initFetch = useCallback(async () => {
  //   setLoading(true);
  //   dispatch(getListBook(option))
  //     .then((response) => {
  //       if (response.payload) {
  //         const data = response.payload;
  //         setBookList(data);
  //         console.log('data: ',data);

  //       }
  //     })
  //     .finally(() => setLoading(false));
  // }, [dispatch, option]);

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
    // initFetch();
    getListBookInit();
  }, [option]);

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
      // render: (_values: any) => {
      //   return (
      //     <>
      //       <Button icon={<EyeFilled />} /* onClick={handleOpenJoin*/>View</Button>
      //       <Button
      //         style={{ margin: "0 5px" }}
      //         type="primary"
      //         icon={<PlusCircleFilled />} /* onClick={handleOpenJoin} */
      //       >
      //         Cart
      //       </Button>
      //       <Button type="primary" danger icon={<HeartFilled />} /* onClick={handleOpenJoin} */>
      //         Wishlist
      //       </Button>
      //     </>
      //   );
      // },
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
      <div className="carousel-title">
        <Title level={2} style={{ margin: 0 }}>
          Popular Books
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
          {books.map((book, index) => (
            <CardBook
              key={index}
              height="400px"
              content={{
                title: deviceType,
                description: book.description,
              }}
              router={`/book-detail/:id}`}
            />
          ))}
        </Carousel>
      </Section>

      <div className="carousel-title">
        <Title level={2} style={{ margin: 0 }}>
          Popular Club
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
          {books.map((book, index) => (
            <CardBook
              key={index}
              height="400px"
              content={{
                title: deviceType,
                description: book.description,
              }}
              router={`/book-detail/:id}`}
            />
          ))}
        </Carousel>
      </Section>

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
    </>
  );
};

export default Homepage;
