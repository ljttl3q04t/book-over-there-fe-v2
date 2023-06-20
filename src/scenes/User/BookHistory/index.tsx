import { useState, useEffect, useCallback } from "react";
import { Col, Row, Typography, Carousel, Button } from "antd";
import { QueryFilter, ProFormText } from "@ant-design/pro-form";
import Table, { ColumnsType } from "antd/es/table";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import CardBook from "../../../component/CardBook";
import { getListBook } from "../../../store/bookStore";

const { Title } = Typography;

const columns: ColumnsType<any> = [
  {
    title: "",
    dataIndex: "image",
    // render: (image: any) => {
    //   return image?.image;
    // },
    render: (image: any) => {
      return (
        <>
          <img
            alt="pic"
            style={{ width: 70, height: 70}}
            src={image}
          />
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
    title: "Author",
    key: "author",
    dataIndex: "author",
    render: (author: any) => {
      return author?.name;
    },
  },
  {
    title: "Borrow Date",
    dataIndex: "borrow_date",
    key: "borrow_date",
  },
  {
    title: "Return Date",
    key: "return_date",
    dataIndex: "return_date",
  },
  {
    title: "Overdue Date(s)",
    key: "overdue_date",
    dataIndex: "overdue_date",
  },
  {
    title: "Action",
    key: "",
    dataIndex: "",
    render: (values: any) => {
      return (
        <>
          <Button type="primary" /* onClick={handleOpenJoin} */>
            View book
          </Button>
          <Button
            style={{ margin: "0 5px" }}
            type="primary" /* onClick={handleOpenJoin} */
          >
            Mượn lại
          </Button>
        </>
      );
    },
  },
];

const BookHistory = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const [loading, setLoading] = useState(false);
  const [bookList, setBookList] = useState([]);
  const [option, setOption] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const [params, setParams] = useState<string>("");

  const initFetch = useCallback(async () => {
    setLoading(true);
    dispatch(getListBook(option))
      .then((response) => {
        if (response.payload) {
          const data = response.payload.results?.map(
            (item: any, index: any) => {
              return {
                ...item,
              };
            }
          );
          setBookList(data);
        }
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    initFetch();
  }, []);
  return (
    <Row style={{ flexDirection: "column" }} gutter={[0, 32]} align="middle">
      {/* <Row gutter={[16, 16]} justify="space-evenly" style={{ width: "100%" }}>
        {[1, 2, 3, 4].map((item) => (
          <Col>
            <CardBook
              content={{ title: "Hot Books", description: "Book available" }}
              router={`/book-detail/${item}`}
            />
          </Col>
        ))}
      </Row> */}

      <div style={{ textAlign: "center", marginTop: 30 }}>
        <Title level={2} style={{ margin: 0 }}>
          Borrow History
        </Title>
      </div>
      <div style={{ width: "100%", padding: 0 }}>
        <QueryFilter
          style={{ padding: 10 }}
          layout="vertical"
          resetText={"Reset"}
          searchText={"Search"}
          onFinish={(data) => {
            let params = new URLSearchParams();
            for (let key in data) {
              params.set(key, data[key]);
            }
            setParams(params.toString());
            // setOption({
            //   pageIndex: 1,
            //   params: "",
            // });

            return Promise.resolve(true);
          }}
          onReset={() => {
            setParams("");
            // setOption({
            //   pageIndex: 1,
            //   params: "",
            // });
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
          scroll={{ x: "max-content" }}
          columns={columns}
          dataSource={bookList}
          // dataSource={companyStore.companyData.data}
          // onChange={handleTableChange}
          // pagination={{
          //   total: companyStore.companyData.totalItems,
          //   pageSize: globalConstant.pageSize,
          //   current: option.pageIndex,
          // }}
        />
      </div>
    </Row>
  );
};

export default BookHistory;
