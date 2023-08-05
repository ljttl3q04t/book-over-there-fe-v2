import { dateFormatList } from "@/helpers/DateHelper";
import { Button, DatePicker, Form, Select, Space } from "antd";
import { useTranslation } from "react-i18next";
import { ORDER_STATUS_LIST } from "./types";
import { MemberInfos } from "@/services/types";

type FilterOrderProps = {
  loading: boolean;
  handleQuerySubmit: any;
  handleQueryCancel: any;
  form: any;
  members: MemberInfos[];
};

export function FilterOrder(props: FilterOrderProps) {
  const { loading, handleQuerySubmit, handleQueryCancel, form, members } = props;
  const { t } = useTranslation();

  return (
    <Space direction="vertical">
      <Form form={form} name="filter-order-form">
        <Form.Item label={t("Order Status") as string} name="order_status">
          <Select placeholder={t("orderStatus.all") as string} allowClear style={{ width: 136 }}>
            {ORDER_STATUS_LIST.map((v) => (
              <Select.Option key={v} value={v}>
                {t(`orderStatus.${v}`) as string}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label={t("Created Order Date") as string} name="order_date" style={{ minWidth: 300, width: "100%" }}>
          <DatePicker format={dateFormatList} name="order_date" placeholder={t("Select date") as string} />
        </Form.Item>
        <Form.Item label={t("Created order by month") as string} name="order_month" style={{ width: "100%" }}>
          <DatePicker name="order_month" picker="month" placeholder={t("Select month") as string} />
        </Form.Item>

        <Form.Item name="member" label={t("Select Member") as string} style={{ width: "30%" }}>
          <Select
            showSearch
            filterOption={(input, option: any) =>
              (option?.children ?? "").toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {members.map((member: MemberInfos) => (
              <Select.Option key={member.id} value={member.id}>
                {`${member.full_name} - ${member.code} - ${member.phone_number || ""}`}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button onClick={handleQueryCancel} style={{ marginRight: "10px" }}>
            Reset
          </Button>
          <Button type="primary" loading={loading} onClick={handleQuerySubmit}>
            Filter
          </Button>
        </Form.Item>
      </Form>
    </Space>
  );
}
