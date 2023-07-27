import { useTranslation } from "react-i18next";
import { Button, Col, Form, Input, Row } from "antd";
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

export function FilteMember(props: FilterOrderProps) {
  const { loading, handleQuerySubmit, handleQueryCancel, form } = props;
  const { t } = useTranslation();

  return (
    <StyledFilterForm>
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
