import { MESSAGE_VALIDATE_BASE } from "@/constants/MessageConstant";
import { Button, DatePicker, Form, Input, Modal } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import moment from "moment";

type CreateOrderModalProps = {
  open: boolean;
  onCancel: () => void;
};

const StyledModalContent = styled.div`
  padding: 30px;
`;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

export function CreateOrderModal(props: CreateOrderModalProps) {
  const { open, onCancel } = props;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();
  const defaultDueDate = moment().add(35, "days");

  return (
    <Modal
      title={"Create New Order"}
      open={open}
      width={800}
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            onCancel();
          }}
        >
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={isSubmitting} onClick={() => {}}>
          Send Reset Email
        </Button>,
      ]}
      centered
    >
      <StyledModalContent>
        <Form {...layout} form={form} name="control-ref" style={{ width: 800 }}>
          <Form.Item
            name="full_name"
            label="Full Name"
            rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} full name` }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone_number"
            label="Phone Number"
            rules={[{ required: false, message: `${MESSAGE_VALIDATE_BASE} phone number` }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="order_range"
            label="Due Date"
            rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} order time` }]}
            initialValue={defaultDueDate}
          >
            <DatePicker format={["DD/MM/YYYY"]} />
          </Form.Item>
        </Form>
      </StyledModalContent>
    </Modal>
  );
}
