import * as React from "react";
import styled from "styled-components";
import ClubService, { ClubStaffBookListParams } from "@/services/club";

import { Button, notification } from "antd";
import TableBook from "@/component/TableBook";
import { BookClubInfo, CategoryInfos } from "@/services/types";
import userService from "@/services/user";
import dfbServices from "@/services/dfb";
import DrawerAddBook from "./DrawerAddBook";

const StyledClubStaffList = styled.div`
  border-radius: 12px;
  padding: 30px;
  background: #fff;
  width: 100%;
  margin-top: 30px;
  > .table-extra-content {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    h1 {
      font-size: 24px;
    }
    a {
      font-size: 18px;
      margin-top: 2px;
    }
  }
`;

interface DataTypeBooks {
  id: number;
  no: number;
  bookName: string;
  categoryName: string;
  authorName: string;
  publisherName: string;
  image: string;
  totalCopyCount: number;
  memberName: string;
  clubName: string;
}

const ClubStaff = () => {
  const [loading, setLoading] = React.useState(false);
  const [clubBookIds, setClubBookIds] = React.useState<number[]>([]);
  const [, setStaffClubs] = React.useState<BookClubInfo[]>([]);
  const [categories, setCategories] = React.useState<CategoryInfos[]>([]);
  const bookClubName = React.useRef<string>("");
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState<any>("Add Book");

  const fetchInit = async () => {
    try {
      setLoading(true);
      const clubs: BookClubInfo[] = await userService.getStaffClubs();
      const _categories = await dfbServices.getCategoryList();
      setCategories(_categories);
      setStaffClubs(clubs);
      const _clubBookIds = await dfbServices.getClubBookIds({ clubs });
      setClubBookIds(_clubBookIds);
      setLoading(false);
    } catch (error: any) {
      notification.error({ message: error.message });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchInit();
  }, []);

  const fetchClubBookList = React.useCallback((searchForm: ClubStaffBookListParams) => {
    setLoading(true);
    ClubService.getClubStaffBookList(searchForm)
      .then((response) => {
        if (response.data) {
          const data = response.data.results.map((item: any, index: any) => {
            const book: DataTypeBooks = {
              id: item.id,
              no: index + 1,
              authorName: item.book_copy?.book?.author?.name,
              bookName: item.book_copy?.book?.name,
              categoryName: item.book_copy?.book?.category?.name,
              publisherName: item.book_copy?.book?.publisher?.name,
              image: item.book_copy?.book?.image,
              memberName: item.membership.member.full_name,
              clubName: item.membership.book_club.name,
              totalCopyCount: 0,
            };
            return book;
          });
          bookClubName.current = data[0].clubName;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <StyledClubStaffList>
      <div className="table-extra-content">
        <h1>{bookClubName.current}</h1>
        <Button
          type="primary"
          onClick={() => {
            setOpen(true);
            setTitle("Add Book");
          }}
        >
          Add Book
        </Button>
      </div>
      <TableBook loading={loading} setLoading={setLoading} clubBookIds={clubBookIds} />
      <DrawerAddBook
        open={open}
        onClose={() => setOpen(false)}
        fetchBookList={fetchClubBookList}
        title={title}
        categories={categories}
      />
    </StyledClubStaffList>
  );
};

export default ClubStaff;
