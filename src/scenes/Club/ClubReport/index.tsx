import { UserContext } from "@/context/UserContext";
import dfbServices from "@/services/dfb";
import { Column } from "@ant-design/plots";
import { PageLoading } from "@ant-design/pro-components";
import { Space, notification } from "antd";
import * as React from "react";
import { useTranslation } from "react-i18next";

function ClubReport() {
  const { user } = React.useContext(UserContext);
  const [loading, setLoading] = React.useState(false);
  const [reportData, setReportData] = React.useState<any>(undefined);
  const { t } = useTranslation();

  const initFetch = async () => {
    try {
      setLoading(true);
      const clubId = user.membership_info[0].book_club.id;
      const data = await dfbServices.getReport(clubId);
      setReportData(data);
    } catch (err: any) {
      notification.error({ message: err.message });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    initFetch();
  }, []);

  const ColumnChart = () => {
    const data: any = [];
    for (const order of reportData.order) {
      data.push({
        name: t("Total Order"),
        month: order.month,
        total: order.total_orders,
      });
    }
    for (const book of reportData.books_by_months) {
      data.push({
        name: t("Total Book"),
        month: book.month,
        total: book.total_books,
      });
    }
    for (const member of reportData.new_member) {
      data.push({
        name: t("Total New Member"),
        month: member.month,
        total: member.total_new_members,
      });
    }
    const config = {
      data,
      isGroup: true,
      xField: "month",
      yField: "total",
      seriesField: "name",
      label: {
        position: "middle",
        layout: [
          {
            type: "interval-adjust-position",
          },
          {
            type: "interval-hide-overlap",
          },
          {
            type: "adjust-color",
          },
        ],
      },
    };
    return <Column {...config} />;
  };

  return (
    <>
      {loading || reportData === undefined ? (
        <PageLoading />
      ) : (
        <div>
          <Space></Space>
          <ColumnChart />
        </div>
      )}
    </>
  );
}
export default ClubReport;
