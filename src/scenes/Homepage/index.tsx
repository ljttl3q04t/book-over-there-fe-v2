/* eslint-disable react/react-in-jsx-scope */
import { ProFormText, QueryFilter } from "@ant-design/pro-form";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { Button, Carousel, Col, Row, Typography } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { Layout } from "antd";
import { EyeFilled, PlusCircleFilled, HeartFilled } from "@ant-design/icons";
import CardBook from "../../component/CardBook";
import { getListBook } from "../../store/bookStore";
const { Content } = Layout;

const { Title } = Typography;
const StyledBookList = styled.div`
  border-radius: 12px;
  padding: 30px;
  background: #fff;
  width: 100%;
  margin-top: 70px;
`;
const StyledHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const StyledSectionCarousel = styled.section`
  display: flex;
  flex-direction: column;
  padding-bottom: 50px;
  > .carousel-title {
    padding: 20px;
  }
  > .carousel-content {
    padding-left: 20px;
  }
`;
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

  const initFetch = useCallback(async () => {
    setLoading(true);
    dispatch(getListBook(option))
      .then((response) => {
        if (response.payload) {
          const data = response.payload;
          setBookList(data);
        }
      })
      .finally(() => setLoading(false));
  }, [dispatch, option]);

  useEffect(() => {
    initFetch();
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
    setOption({
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
          <>
            <Button icon={<EyeFilled />} /* onClick={handleOpenJoin*/>View</Button>
            <Button
              style={{ margin: "0 5px" }}
              type="primary"
              icon={<PlusCircleFilled />} /* onClick={handleOpenJoin} */
            >
              Cart
            </Button>
            <Button type="primary" danger icon={<HeartFilled />} /* onClick={handleOpenJoin} */>
              Wishlist
            </Button>
          </>
        );
      },
    },
  ];

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

  const chunks = books.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / chunksSize);
    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }
    resultArray[chunkIndex].push(item);
    return resultArray;
  }, [] as any[]);

  return (
    <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
      <div>
        {" "}
        <StyledSectionCarousel>
          <div className="carousel-title">
            <Title level={2} style={{ margin: 0 }}>
              Popular Books
            </Title>
          </div>
          <div className="carousel-content">
            {" "}
            <Carousel autoplay>
              {chunks.map((chunk, index) => (
                <div key={index}>
                  <Row gutter={[16, 16]}>
                    {chunk.map((book: any, bookIndex: any) => (
                      <Col key={bookIndex}>
                        <CardBook
                          height="350px"
                          heightImg="260px"
                          content={{
                            title: book.title,
                            description: book.description,
                          }}
                          router={`/book-detail/:id}`}
                        />
                      </Col>
                    ))}
                  </Row>
                </div>
              ))}
            </Carousel>
          </div>
        </StyledSectionCarousel>
        <StyledSectionCarousel>
          <div className="carousel-title">
            <Title level={2} style={{ margin: 0 }}>
              Popular Club
            </Title>
          </div>
          <div className="carousel-content">
            {" "}
            <Carousel autoplay>
              {chunks.map((chunk, index) => (
                <div key={index}>
                  <Row gutter={[16, 16]}>
                    {chunk.map((book: any, bookIndex: any) => (
                      <Col key={bookIndex}>
                        <CardBook
                          height="350px"
                          heightImg="260px"
                          content={{
                            title: book.title,
                            description: book.description,
                          }}
                          router={`/book-detail/:id}`}
                        />
                      </Col>
                    ))}
                  </Row>
                </div>
              ))}
            </Carousel>
          </div>
        </StyledSectionCarousel>
      </div>
      <StyledBookList>
        <StyledHeader>
          <div style={{ textAlign: "center" }}>
            <Title level={2} style={{ margin: 0 }}>
              Book List
            </Title>
          </div>
        </StyledHeader>
        <QueryFilter
          style={{ padding: 10}}
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
      </StyledBookList>
    </Content>
  );
};

export default Homepage;
