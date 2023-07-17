import { MESSAGE_VALIDATE_BASE } from "@/constants/MessageConstant";
import dfbServices from "@/services/dfb";
import { UpdateMemberRequest } from "@/services/types";
import { Button, Form, Input, Modal, notification } from "antd";
import * as React from "react";
import styled from "styled-components";

type UpdateOrderModalProps = {
  open: boolean;
  onCancel: () => void;
  currentMember: any;
};

const StyledModalContent = styled.div`
  padding: 30px;
`;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

export function UpdateMemberModal(props: UpdateOrderModalProps) {
  const { open, onCancel, currentMember } = props;
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();
      const data: UpdateMemberRequest = {
        member_id: currentMember.id,
        code: values.code,
        phone_number: values.phoneNumber,
        full_name: values.fullName,
      };
      console.log(data);
      const message = await dfbServices.updateMember(data);
      notification.success({ message: message, type: "success" });
      onCancel();
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
        <Form {...layout} id="updateMemberForm" form={form} name="control-ref" style={{ width: 800 }}>
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} full name` }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="code"
            label="Code"
            rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} member code` }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[{ required: false, message: `${MESSAGE_VALIDATE_BASE} phone number` }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </StyledModalContent>
    </Modal>
  );
}
