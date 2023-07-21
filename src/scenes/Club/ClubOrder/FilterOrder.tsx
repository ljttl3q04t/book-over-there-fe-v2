import { ORDER_STATUS_LIST } from "./types";
import { useTranslation } from "react-i18next";
import { Button, Col, DatePicker, Form, Row, Select } from "antd";
import { dateFormatList } from "@/helpers/DateHelper";

type FilterOrderProps = {
  loading: boolean;
  handleQuerySubmit: any;
  handleQueryCancel: any;
  form: any;
};

export function FilterOrder(props: FilterOrderProps) {
  const { loading, handleQuerySubmit, handleQueryCancel, form } = props;
  const { t } = useTranslation();

  return (
    <>
      <Form style={{ padding: 10 }} form={form} name="filter-order-form">
        <Form.Item label={t("Order Status") as string} name="order_status">
          <Select placeholder={t("orderStatus.all") as string} allowClear style={{ width: "20%" }}>
            {ORDER_STATUS_LIST.map((v) => (
              <Select.Option key={v} value={v}>
                {t(`orderStatus.${v}`) as string}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label={t("create order date") as string} name="order_date">
          <DatePicker format={dateFormatList} name="order_date" />
        </Form.Item>
        <Form.Item>
          <Row gutter={32}>
            <Col>
              <Button onClick={handleQueryCancel}>Reset</Button>
            </Col>
            <Col>
              <Button type="primary" loading={loading} onClick={handleQuerySubmit}>
                Filter
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </>
  );
}
