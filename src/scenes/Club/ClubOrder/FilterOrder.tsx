import { ORDER_STATUS_LIST } from "./types";
import { useTranslation } from "react-i18next";
import { Button, Col, DatePicker, Form, Row, Select } from "antd";
import { dateFormatList } from "@/helpers/DateHelper";
import styled from "styled-components";
type FilterOrderProps = {
  loading: boolean;
  handleQuerySubmit: any;
  handleQueryCancel: any;
  form: any;
};
const StyledFilterForm = styled.div`
  flex: 1;
  /* display: flex;
  flex-direction:row; */
`;
export function FilterOrder(props: FilterOrderProps) {
  const { loading, handleQuerySubmit, handleQueryCancel, form } = props;
  const { t } = useTranslation();

  return (
    <StyledFilterForm>
      <Form form={form} name="filter-order-form">
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label={t("Order Status") as string} name="order_status">
              <Select placeholder={t("orderStatus.all") as string} allowClear>
                {ORDER_STATUS_LIST.map((v) => (
                  <Select.Option key={v} value={v}>
                    {t(`orderStatus.${v}`) as string}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={t("Created Order Date") as string} name="order_date">
              <DatePicker format={dateFormatList} name="order_date" />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item>
              <Button onClick={handleQueryCancel} style={{ marginRight: "10px" }}>
                Reset
              </Button>
              <Button type="primary" loading={loading} onClick={handleQuerySubmit}>
                Filter
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </StyledFilterForm>
  );
}
