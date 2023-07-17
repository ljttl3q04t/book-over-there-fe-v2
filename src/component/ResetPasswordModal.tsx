import React, { useState } from "react";
import { Modal, Form, Input, Button, notification } from "antd";
import { UserOutlined } from "@ant-design/icons";
import userService from "@/services/user";

type PasswordResetModalProps = {
  open: boolean;
  onCancel: () => void;
};

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
    } catch (err) {
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
      title="Password Reset"
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
      <Form {...layout} form={form} name="control-ref" width={800}>
        <p>
          Forgotten your password? Enter your username or e-mail address below, and we will send you an e-mail allowing
          you to reset it.
        </p>
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
