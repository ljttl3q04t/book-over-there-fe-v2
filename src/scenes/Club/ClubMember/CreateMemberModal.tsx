import { MESSAGE_VALIDATE_BASE } from "@/constants/MessageConstant";
import { validatePhoneNumber } from "@/helpers/fuctionHepler";
import dfbServices from "@/services/dfb";
import { BookClubInfo } from "@/services/types";
import { PhoneOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Select, notification } from "antd";
import * as React from "react";
import styled from "styled-components";

type CreateOrderModalProps = {
  open: boolean;
  onCancel: () => void;
  staffClubs: BookClubInfo[];
};

const StyledModalContent = styled.div`
  padding: 30px;
`;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

export function CreateMemberModal(props: CreateOrderModalProps) {
  const { open, staffClubs, onCancel } = props;
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();
      const message = await dfbServices.createMember(values);
      notification.success({ message: message, type: "success" });
      form.resetFields();
      onCancel();
    } catch (error: any) {
      const errorMessage = error.message || "An error occurred while creating the member.";
      notification.error({ message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title={"Create New Member"}
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
        <Form {...layout} form={form} name="control-ref" style={{ width: 800 }}>
          <Form.Item name="club_id" label="Club" rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} club` }]}>
            <Select placeholder="Choose club..." value={staffClubs[0]?.id}>
              {staffClubs.map((club) => (
                <Select.Option key={club.id} value={club.id}>
                  {club.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="full_name"
            label="Full Name"
            rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} full name` }]}
          >
            <Input placeholder="Fullname..." />
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
