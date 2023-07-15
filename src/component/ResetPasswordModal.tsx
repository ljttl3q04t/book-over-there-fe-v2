import React, { useState } from "react";
import { Modal, Form, Input, Button, notification } from "antd";
import { UserOutlined } from "@ant-design/icons";
import userService from "@/services/user";
import styled from "styled-components";

type PasswordResetModalProps = {
  open: boolean;
  onCancel: () => void;
};
const StyledTxt = styled.div`
  border-radius: 12px;
  padding: 30px;
  background: #3993ee24;
  maxWidth: 500px;
  margin-top: 10px;
  box-shadow: 0 20px 27px rgb(0 0 0/5%);
  margin-bottom: 20px;
  > p {
    text-align: "center";
    font-size: 14;
    font-weight: 100; 
  }
`;

const PasswordResetModal = (props: PasswordResetModalProps) => {
  const { open, onCancel } = props;
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOk = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();
      const message = await userService.resetPassword(values);
      notification.success({ message: message, type: "success" });
      form.resetFields();
      onCancel();
    } catch (err: any) {
      notification.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 24 },
  };

  return (
    <Modal
      open={open}
      title={
        <div style={{ textAlign: "center", fontSize: 24 }}>
          Forgot your password?
        </div>}
      width={600}
      onCancel={onCancel}
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            form.resetFields();
            onCancel();
          }}
        >
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={isSubmitting} onClick={handleOk}>
          Send Reset Email
        </Button>,
      ]}
      centered
    >
      <Form {...layout} form={form} name="control-ref">
        <StyledTxt>
          <p style={{ }}>
            Please insert your email or username in the input below and we will send an email with the link to reset your password.
          </p>
        </StyledTxt>
        <Form.Item
          name="username_or_email"
          label="Username or Email"
          rules={[{ required: true, message: "Please enter your username or email" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Please enter your username or email"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PasswordResetModal;
