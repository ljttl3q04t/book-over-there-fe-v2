import { MESSAGE_VALIDATE_BASE } from "@/constants/MessageConstant";
import { UserContext } from "@/context/UserContext";
import { validatePhoneNumber } from "@/helpers/fuctionHepler";
import dfbServices from "@/services/dfb";
import { PhoneOutlined } from "@ant-design/icons";
import { Button, Form, FormInstance, Input, Modal, notification } from "antd";
import * as React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

type CreateOrderModalProps = {
  open: boolean;
  onCancel: () => void;
  fetchMemberIds: any;
};

const StyledModalContent = styled.div`
  padding: 30px;
`;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

export function CreateMemberModal(props: CreateOrderModalProps) {
  const { fetchMemberIds, open, onCancel } = props;
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [form] = Form.useForm();
  const formRef = React.useRef<FormInstance>(form);
  const { currentClubId } = React.useContext(UserContext);

  const { t } = useTranslation();

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();
      const { ...data } = values;
      data.club_id = currentClubId;
      const message = await dfbServices.createMember(data);
      notification.success({ message: message, type: "success" });
      form.resetFields();
      onCancel();
      fetchMemberIds();
    } catch (error: any) {
      const errorMessage = t(error.message || "An error occurred") as string;
      notification.error({ message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title={t("Add New Member") as string}
      open={open}
      width={800}
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            form.resetFields();
            onCancel();
          }}
        >
          {"Cancel"}
        </Button>,
        <Button key="submit" type="primary" loading={isSubmitting} onClick={handleSubmit}>
          {"Submit"}
        </Button>,
      ]}
      centered
    >
      <StyledModalContent>
        <Form {...layout} form={form} ref={formRef} name="control-ref" style={{ width: 800 }}>
          <Form.Item
            name="full_name"
            label={t("Full Name") as string}
            rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} full name` }]}
          >
            <Input placeholder="Fullname..." />
          </Form.Item>
          <Form.Item
            name="code"
            label={t("Member Code") as string}
            rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} member code` }]}
          >
            <Input placeholder="Code..." />
          </Form.Item>
          <Form.Item
            name="phone_number"
            label={t("Phone Number") as string}
            rules={[{ required: false, validator: validatePhoneNumber }]}
          >
            <Input prefix={<PhoneOutlined className="site-form-item-icon" />} placeholder="Phone number..." />
          </Form.Item>
        </Form>
      </StyledModalContent>
    </Modal>
  );
}
