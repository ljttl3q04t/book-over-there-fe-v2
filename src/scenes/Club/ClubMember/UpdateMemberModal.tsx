import { MESSAGE_VALIDATE_BASE } from "@/constants/MessageConstant";
import { validatePhoneNumber } from "@/helpers/fuctionHepler";
import dfbServices from "@/services/dfb";
import { UpdateMemberRequest } from "@/services/types";
import { PhoneOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, notification } from "antd";
import TextArea from "antd/es/input/TextArea";
import * as React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

type UpdateOrderModalProps = {
  open: boolean;
  onCancel: () => void;
  currentMember: any;
  onRefresh: () => void;
};

const StyledModalContent = styled.div`
  padding: 30px;
`;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

export function UpdateMemberModal(props: UpdateOrderModalProps) {
  const { open, onCancel, currentMember, onRefresh } = props;
  const [loading, setLoading] = React.useState(false);
  const [hasChange, setHasChange] = React.useState(false);

  const [form] = Form.useForm();
  const { t } = useTranslation();

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleFormValuesChange = (changedValues: any) => {
    const isDiff = Object.keys(changedValues).some((field) => {
      return changedValues[field] != currentMember[field];
    });
    setHasChange(isDiff);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const data: UpdateMemberRequest = {
        member_id: currentMember.id,
        code: values.code,
        full_name: values.fullName,
        notes: values.notes,
        club_id: currentMember.clubId,
      };
      if (values.phoneNumber) {
        data.phone_number = values.phoneNumber;
      }
      const message = await dfbServices.updateMember(data);
      notification.success({ message: message, type: "success" });
      onRefresh();
      handleCancel();
    } catch (error: any) {
      const errorMessage = error.message || "An error occurred while updating the member.";
      notification.error({ message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    setHasChange(false);
    form.setFieldsValue(currentMember);
  }, [currentMember, form]);

  return (
    <Modal
      title={"Update Member"}
      open={open}
      width={800}
      onCancel={handleCancel}
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            handleCancel();
          }}
        >
          {t("Cancel") as string}
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit} disabled={!hasChange}>
          {t("Submit") as string}
        </Button>,
      ]}
      centered
    >
      <StyledModalContent>
        <Form
          {...layout}
          id="updateMemberForm"
          form={form}
          name="control-ref"
          style={{ width: 800 }}
          onValuesChange={handleFormValuesChange}
        >
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} full name` }]}
          >
            <Input placeholder="Full Name..." />
          </Form.Item>
          <Form.Item
            name="code"
            label="Code"
            rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} member code` }]}
          >
            <Input placeholder="Code..." />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[{ required: false, validator: validatePhoneNumber }]}
          >
            <Input prefix={<PhoneOutlined className="site-form-item-icon" />} placeholder="Phone number..." />
          </Form.Item>
          <Form.Item name="notes" label={t("Notes") as string} rules={[{ required: false }]}>
            <TextArea rows={4} placeholder="Note..." />
          </Form.Item>
        </Form>
      </StyledModalContent>
    </Modal>
  );
}
