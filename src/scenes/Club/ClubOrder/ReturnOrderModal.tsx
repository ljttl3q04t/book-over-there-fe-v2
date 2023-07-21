import { MESSAGE_VALIDATE_BASE } from "@/constants/MessageConstant";
import { dateFormatList } from "@/helpers/DateHelper";
import { Button, Form, Modal, DatePicker, List, Avatar } from "antd";
import styled from "styled-components";
import defaultImage from "@/image/book-default.png";
import { useTranslation } from "react-i18next";

type ReturnOrderModalProps = {
  open: boolean;
  onCancel: () => void;
  handleReturnBooks: (formData: any) => void;
  loading: boolean;
  selectedRows: any;
};

const StyledModalContent = styled.div`
  padding: 30px;
`;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

export function ReturnOrderModal(props: ReturnOrderModalProps) {
  const { open, onCancel, handleReturnBooks, loading, selectedRows } = props;
  const [form] = Form.useForm();
  const handleCancelModal = () => {
    onCancel();
    form.resetFields();
  };
  const handleSubmitForm = async () => {
    handleReturnBooks(form.getFieldsValue());
  };
  const { t } = useTranslation();

  return (
    <Modal
      title={t("Return Book") as string}
      open={open}
      onCancel={handleCancelModal}
      width={800}
      footer={[
        <Button key="cancel" onClick={handleCancelModal}>
          {"Cancel"}
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={form.submit}>
          {"Submit"}
        </Button>,
      ]}
      centered
    >
      <StyledModalContent>
        <Form onFinish={handleSubmitForm} {...layout} form={form} name="control-ref" style={{ width: 800 }}>
          <Form.Item name="list_item" label={t("Selected Books") as string} rules={[{ required: false }]}>
            <List
              itemLayout="horizontal"
              dataSource={selectedRows}
              renderItem={(item: any) => (
                <List.Item>
                  <List.Item.Meta avatar={<Avatar src={defaultImage} />} title={<p>{item.bookName}</p>} />
                </List.Item>
              )}
            />{" "}
          </Form.Item>
          <Form.Item
            name="return_date"
            label={t("Return Date") as string}
            rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} return date` }]}
          >
            <DatePicker style={{ width: "100%" }} format={dateFormatList} />
          </Form.Item>
        </Form>
      </StyledModalContent>
    </Modal>
  );
}