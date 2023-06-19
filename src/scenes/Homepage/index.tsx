import { useState, useEffect, useCallback } from "react";
import { Col, Row, Typography, Carousel, Button } from "antd";
import { QueryFilter, ProFormText } from "@ant-design/pro-form";
import Table, { ColumnsType } from "antd/es/table";
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from "@reduxjs/toolkit";
import CardBook from "../../component/CardBook";
import { getListBook } from "../../store/bookStore";

const { Title } = Typography;


const Homepage = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const [loading, setLoading] = useState(false);
  const [bookList, setBookList] = useState<any>({});
  const [option, setOption] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const initFetch = useCallback(async () => {
    setLoading(true);
    dispatch(getListBook(option))
      .then((response) => {
        if (response.payload) {
          const data = response.payload
          setBookList(data)
        }
      }).finally(() => setLoading(false))

  }, [dispatch, option]);

  useEffect(() => {
    initFetch()
  }, [option])

  const handleTableChange = (pagination: any) => {
    setOption({
      ...option,
      pageIndex: pagination.current,
      pageSize: pagination.pageSize
      ,
    })


  }
  const columns: ColumnsType<any> = [
    {
      title: '',
      dataIndex: 'https://symbols.vn/wp-content/uploads/2021/12/Cap-nhat-them-bo-suu-tap-Anh-nen-dien-thoai-One-Piece-an-tuong.jpg',
      render: (values:any) => { return (<><img alt="pic" style={{ width: 50, height: 50 }} src={`https://symbols.vn/wp-content/uploads/2021/12/Cap-nhat-them-bo-suu-tap-Anh-nen-dien-thoai-One-Piece-an-tuong.jpg`} /></>) }
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: any) => {
        return category?.name;
      }
    },
    {
      title: 'Author',
      key: 'author',
      dataIndex: 'author',
      render: (category: any) => {
        return category?.name;
      }
    },
    {
      title: 'Publisher',
      key: 'publisher',
      dataIndex: 'publisher',
      render: (category: any) => {
        return category?.name;
      }
    },
    {
      title: 'Action',
      key: '',
      dataIndex: '',
      render: (values: any) => {
        return (<>
          <Button type='primary' /* onClick={handleOpenJoin} */>View book</Button>
          <Button style={{ margin: "0 5px" }} type='primary' /* onClick={handleOpenJoin} */>Add to cart</Button>
          <Button type='primary' /* onClick={handleOpenJoin} */>Add to wishlist</Button>
        </>)
      }
    }
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

  const chunkSize = 5;
  const chunks = books.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / chunkSize);
    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }
    resultArray[chunkIndex].push(item);
    return resultArray;
  }, [] as any[]);

  return (
    <Row style={{ flexDirection: "column" }} gutter={[0, 32]} align="middle">
      <div style={{ textAlign: "center" }}>
        <Title level={2} style={{ margin: 0 }}>
          Popular Books
        </Title>
      </div>
      <Row gutter={[16, 16]} justify="center" style={{ width: "100%" }}>
        <Col span={18}>
          <Carousel autoplay>
            {chunks.map((chunk, index) => (
              <div key={index}>
                <Row gutter={[16, 16]} justify="space-evenly">
                  {chunk.map((book: any, bookIndex: any) => (
                    <Col key={bookIndex}>
                      <CardBook
                        height="290px"
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
        </Col>
      </Row>
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <Title level={2} style={{ margin: 0 }}>
          Popular Club
        </Title>
      </div>
      <Row gutter={[16, 16]} justify="center" style={{ width: "100%" }}>
        <Col span={18}>
          <Carousel autoplay>
            {chunks.map((chunk, index) => (
              <div key={index}>
                <Row gutter={[16, 16]} justify="space-evenly">
                  {chunk.map((book: any, bookIndex: any) => (
                    <Col key={bookIndex}>
                      <CardBook
                        height="290px"
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
        </Col>
      </Row>

      <div style={{ textAlign: "center", marginTop: 30 }}>
        <Title level={2} style={{ margin: 0 }}>
          Book List
        </Title>
      </div>
      <div style={{ width: '100%', padding: 0 }}>
        <QueryFilter
          style={{ padding: 10 }}
          layout="vertical"
          resetText={"RESET"}
          searchText={"SEARCH"}
          className="home-page-search_book"
          onFinish={(data) => {

            setOption({
              pageIndex: 1,
              pageSize: 10,
              ...data
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
            label={"SEARCH"}
            placeholder={"Input name to search"}
          />
        </QueryFilter>

        <Table
          loading={loading}
          scroll={{ x: 'max-content' }}
          columns={columns}
          dataSource={bookList?.results}
          onChange={handleTableChange}
          pagination={{
            total: bookList.count,
            pageSize: option.pageSize,
            current: option.pageIndex,
          }}
        />
      </div>
    </Row>
  );
};

export default Homepage;
