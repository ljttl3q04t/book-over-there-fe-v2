import * as React from "react";
import styled from "styled-components";
import { Button, notification } from "antd";
import { BookClubInfo, CategoryInfos, ClubBookInfos } from "@/services/types";
import userService from "@/services/user";
import dfbServices from "@/services/dfb";
import DrawerAddBook from "./DrawerAddBook";
import { useTranslation } from "react-i18next";
import TableBook from "./TableBook";

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

  const initFetch = async () => {
    try {
      setLoading(true);
      const _club = await fetchClub();
      await fetchCategory();
      const clubBookIds = await dfbServices.getClubBookIds({ clubs: [_club] });
      const infos = await dfbServices.getClubBookInfos(clubBookIds);
      setClubBookInfos(infos);
    } catch (error: any) {
      notification.error({ message: error.message });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    initFetch();
  }, []);

  return (
    <StyledClubStaffList>
      <div className="table-extra-content">
        <h1>{bookClubName.current}</h1>
        <Button
          type="primary"
          style={{ alignSelf: "flex-start" }}
          onClick={() => {
            setOpen(true);
          }}
        >
          {t("Add Book") as string}
        </Button>
      </div>
      <TableBook loading={loading} clubBookInfos={clubBookInfos} />
      <DrawerAddBook open={open} onClose={() => setOpen(false)} categories={categories} club={club} />
    </StyledClubStaffList>
  );
};

export default ClubStaff;
