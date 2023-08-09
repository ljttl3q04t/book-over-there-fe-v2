import * as React from "react";
import styled from "styled-components";
import { Button, Col, Form, Input, Row, notification } from "antd";
import { BookClubInfo, CategoryInfos, ClubBookInfos } from "@/services/types";
import userService from "@/services/user";
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
  const [clubBookInfos, setClubBookInfos] = React.useState<ClubBookInfos[]>([]);
  const [club, setClub] = React.useState<BookClubInfo>();
  const [categories, setCategories] = React.useState<CategoryInfos[]>([]);
  const bookClubName = React.useRef<string>("");
  const [open, setOpen] = React.useState(false);
  const [filterData, setFilterData] = React.useState<ClubBookInfos[]>([]);
  const [isFilter, setIsFilter] = React.useState(false);
  const { user } = React.useContext(UserContext);

  const [form] = Form.useForm();

  const { t } = useTranslation();

  const fetchClub = async (): Promise<BookClubInfo> => {
    const clubs: BookClubInfo[] = await userService.getStaffClubs();
    bookClubName.current = clubs[0]?.name;
    setClub(clubs[0]);
    return clubs[0];
  };

  const fetchCategory = async () => {
    const _categories = await dfbServices.getCategoryList();
    setCategories(_categories);
  };

  const fetchBooks = async (_club: BookClubInfo) => {
    const clubBookIds = await dfbServices.getClubBookIds({ clubs: [_club] });
    const infos = await dfbServices.getClubBookInfos(clubBookIds);
    setClubBookInfos(infos);
  };

  const initFetch = async () => {
    try {
      setLoading(true);
      const _club = await fetchClub();
      await fetchCategory();
      await fetchBooks(_club);
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
    console.log(value);
    console.log(clubBookInfos[0]);
    const data = clubBookInfos.filter((b) => {
      if (b.code.toLowerCase().indexOf(value.toLowerCase()) >= 0) return true;
      if (b.book.name.toLowerCase().indexOf(value.toLowerCase()) >= 0) return true;
      return false;
    });
    setIsFilter(true);
    setFilterData(data);
    console.log(data);
  };

  React.useEffect(() => {
    initFetch();
  }, []);

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
        {user?.is_club_admin && (
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
      <TableBook loading={loading} clubBookInfos={isFilter ? filterData : clubBookInfos} />
      <DrawerAddBook
        open={open}
        onClose={() => setOpen(false)}
        categories={categories}
        club={club}
        initFetch={initFetch}
      />
    </StyledClubStaffList>
  );
};

export default ClubStaff;
