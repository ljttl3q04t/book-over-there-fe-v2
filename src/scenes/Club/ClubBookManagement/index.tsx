import * as React from "react";
import styled from "styled-components";
import { Button, Col, Form, Input, Row, notification } from "antd";
import { CategoryInfos, ClubBookInfos } from "@/services/types";
import dfbServices from "@/services/dfb";
import DrawerAddBook from "./DrawerAddBook";
import { useTranslation } from "react-i18next";
import TableBook from "./TableBook";
import { PlusCircleOutlined } from "@ant-design/icons";
import { UserContext } from "@/context/UserContext";

const StyledClubStaffList = styled.div`
  border-radius: 12px;
  padding: 30px;
  background: #fff;
  width: 100%;
  margin-top: 30px;
  > .table-extra-content {
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    h1 {
      font-size: 24px;
    }
    a {
      font-size: 18px;
      margin-top: 2px;
    }
  }
`;

const ClubStaff = () => {
  const [loading, setLoading] = React.useState(false);
  const [editRow, setEditRow] = React.useState<ClubBookInfos | undefined>(undefined);
  const [clubBookInfos, setClubBookInfos] = React.useState<ClubBookInfos[]>([]);
  const [categories, setCategories] = React.useState<CategoryInfos[]>([]);
  const bookClubName = React.useRef<string>("");
  const [open, setOpen] = React.useState(false);
  const [filterData, setFilterData] = React.useState<ClubBookInfos[]>([]);
  const [isFilter, setIsFilter] = React.useState(false);
  const { currentClubId } = React.useContext(UserContext);

  const [form] = Form.useForm();

  const { t } = useTranslation();

  const fetchCategory = async () => {
    const _categories = await dfbServices.getCategoryList();
    setCategories(_categories);
  };

  const fetchBooks = async () => {
    const clubBookIds = await dfbServices.getClubBookIds(currentClubId ?? 0);
    const infos = await dfbServices.getClubBookInfos(clubBookIds);
    setClubBookInfos(infos);
  };

  const initFetch = async () => {
    try {
      setLoading(true);
      await fetchCategory();
      await fetchBooks();
    } catch (error: any) {
      notification.error({ message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleQueryCancel = async () => {
    form.resetFields();
    setIsFilter(false);
    setFilterData([]);
  };

  const handleQuerySearch = async () => {
    const { value } = await form.validateFields();
    const data = clubBookInfos.filter((b) => {
      if (b.code.toLowerCase().indexOf(value.toLowerCase()) >= 0) return true;
      if (b.book.name.toLowerCase().indexOf(value.toLowerCase()) >= 0) return true;
      return false;
    });
    setIsFilter(true);
    setFilterData(data);
  };

  const handleEdit = (row: ClubBookInfos) => {
    setEditRow(row);
    setOpen(true);
  };

  React.useEffect(() => {
    initFetch();
  }, [currentClubId]);

  return (
    <StyledClubStaffList>
      <div className="table-extra-content">
        <h1>{bookClubName.current}</h1>
        <Form form={form} name="filter-member-form">
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item name="value">
                <Input placeholder={t("Search") as string} />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item>
                <Button onClick={handleQueryCancel} style={{ marginRight: "10px" }}>
                  {t("Reset") as string}
                </Button>
                <Button type="primary" loading={loading} onClick={handleQuerySearch}>
                  {t("Search") as string}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        {currentClubId && (
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            style={{ alignSelf: "flex-start" }}
            onClick={() => {
              setOpen(true);
            }}
          >
            {t("Add Book") as string}
          </Button>
        )}
      </div>
      <TableBook loading={loading} clubBookInfos={isFilter ? filterData : clubBookInfos} handleEdit={handleEdit} />
      <DrawerAddBook
        open={open}
        onClose={() => {
          setOpen(false);
          setEditRow(undefined);
        }}
        categories={categories}
        initFetch={initFetch}
        editRow={editRow}
      />
    </StyledClubStaffList>
  );
};

export default ClubStaff;
