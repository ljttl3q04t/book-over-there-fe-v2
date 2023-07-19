import { MESSAGE_VALIDATE_BASE } from "@/constants/MessageConstant";
import { validatePhoneNumber } from "@/helpers/fuctionHepler";
import dfbServices from "@/services/dfb";
import { UpdateMemberRequest } from "@/services/types";
import { PhoneOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, notification } from "antd";
import * as React from "react";
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
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [form] = Form.useForm();
  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();      
      const data: UpdateMemberRequest = {
        member_id: currentMember.id,
        code: values.code,
        full_name: values.fullName,
      };
      if (values.phone_number) {
        data.phone_number = values.phone_number;
      }
      const message = await dfbServices.updateMember(data);
      notification.success({ message: message, type: "success" });
      await onRefresh();
      handleCancel();
    } catch (error: any) {
      const errorMessage = error.message || "An error occurred while updating the member.";
      notification.error({ message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  React.useEffect(() => {
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
          {"Cancel"}
        </Button>,
        <Button key="submit" type="primary" loading={isSubmitting} onClick={handleSubmit}>
          {"Submit"}
        </Button>,
      ]}
      centered
    >
      <StyledModalContent>
        <Form {...layout} id="updateMemberForm" form={form} name="control-ref" style={{ width: 800 }}>
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
            name="phone_number"
            label="Phone Number"
            rules={[{ required: false, validator: validatePhoneNumber }]}
          >
            <Input prefix={<PhoneOutlined className="site-form-item-icon" />} placeholder="Phone number..." />
          </Form.Item>
        </Form>
      </StyledModalContent>
    </Modal>
  );
}
