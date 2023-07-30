import * as React from "react";
import styled from "styled-components";
import { OnlineOrderTable } from "./OnlineOrderTable";
import dfbServices from "@/services/dfb";
import { ClubBookInfos } from "@/services/types";
import { notification } from "antd";
import { OnlineOrderTableRow } from "./types";

const StyledClubOrder = styled.div`
  border-radius: 12px;
  padding: 30px;
  background: #fff;
  width: 100%;
  margin-top: 30px;
  > .table-extra-content {
    display: flex;
    flex-direction: column;
    /* gap: 32px; */
    padding: 20px 0;
    h1 {
      font-size: 24px;
    }
    a {
      font-size: 18px;
      margin-top: 2px;
    }
  }
`;

const ClubOrderOnline = () => {
  const [loading, setLoading] = React.useState(false);
  const [tableData, setTableData] = React.useState<OnlineOrderTableRow[]>([]);

  const initFetch = async () => {
    try {
      setLoading(true);
      const draftOrderIds = await dfbServices.getDraftOrderIds();
      const data = await dfbServices.getDraftOrderInfos(draftOrderIds);
      const clubBookIds = data.map((d) => d.club_book_ids).flat();
      const clubBookInfos = await dfbServices.getClubBookInfos(clubBookIds);
      const mapBooks: Record<number, ClubBookInfos> = {};
      clubBookInfos.forEach((b) => {
        mapBooks[b.id] = b;
      });
      const _tableData: OnlineOrderTableRow[] = [];
      for (const d of data) {
        _tableData.push({
          books: d.club_book_ids.map((id) => mapBooks[id]),
          fullName: d.full_name,
          phoneNumber: d.phone_number,
          address: d.address,
          orderDate: d.order_date,
          dueDate: d.due_date,
        });
      }
      setTableData(_tableData);
    } catch (err: any) {
      notification.error({ message: err.message });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    initFetch();
  }, []);

  return (
    <StyledClubOrder>
      <OnlineOrderTable tableLoading={loading} tableData={tableData} />
    </StyledClubOrder>
  );
};

export default ClubOrderOnline;
