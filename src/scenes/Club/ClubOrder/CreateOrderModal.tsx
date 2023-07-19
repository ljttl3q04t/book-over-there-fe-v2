import { MESSAGE_VALIDATE_BASE } from "@/constants/MessageConstant";
import { Button, DatePicker, Form, FormInstance, Modal, Select, notification } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import moment from "moment";
import { BookClubInfo, ClubBookInfos, MemberInfos } from "@/services/types";
import dfbServices from "@/services/dfb";
import dayjs from "dayjs";

type CreateOrderModalProps = {
  open: boolean;
  onCancel: () => void;
  members: MemberInfos[];
  clubBookInfos: ClubBookInfos[];
  staffClubs: BookClubInfo[];
  onRefresh: () => void;
};

const StyledModalContent = styled.div`
  padding: 30px;
`;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

export function CreateOrderModal(props: CreateOrderModalProps) {
  const { open, onCancel, members, clubBookInfos, staffClubs, onRefresh } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();
  const formRef = React.useRef<FormInstance>(form);

  React.useEffect(() => {
    formRef.current?.setFieldsValue({
      order_date: moment(),
      due_date: moment().add(35, "days"),
    });
  }, [members]);

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();
      const data = {
        member_id: values.member,
        club_id: values.club,
        order_date: dayjs(values.order_date?.toDate()).format("YYYY-MM-DD"),
        due_date: dayjs(values.due_date?.toDate()).format("YYYY-MM-DD"),
        club_book_ids: values.select_books.join(","),
      };
      const message = await dfbServices.createOrder(data);
      notification.success({ message: message, type: "success" });
      form.resetFields();
      await onRefresh();
      onCancel();
    } catch (error: any) {
      console.error(error);
      notification.error({ message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title={"Create Order"}
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
        <Button key="submit" type="primary" loading={isSubmitting} onClick={onSubmit}>
          {"Submit"}
        </Button>,
      ]}
      centered
    >
      <StyledModalContent>
        <Form {...layout} form={form} name="control-ref" style={{ width: 800 }}>
          <Form.Item name="club" label="Club" rules={[{ required: true, message: "Please select club" }]}>
            <Select placeholder="Please select a club">
              {staffClubs.map((club) => (
                <Select.Option key={club.id} value={club.id}>
                  {club.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="member" label="Member" rules={[{ required: true, message: "Please select a member" }]}>
            <Select
              placeholder="Please select a member"
              showSearch
              filterOption={(input, option: any) =>
                (option?.children ?? "").toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {members.map((member: MemberInfos) => (
                <Select.Option key={member.id} value={member.id}>
                  {`${member.full_name} - ${member.code}`}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Select Books"
            name="select_books"
            rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} select at least one book` }]}
          >
            <Select
              placeholder="Find books..."
              mode="multiple"
              showArrow
              style={{ width: "100%" }}
              showSearch
              filterOption={(input, option: any) =>
                (option?.children ?? "").toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {clubBookInfos.map((item) => {
                return <Select.Option value={item.id}>{`${item.book.name}`}</Select.Option>;
              })}
            </Select>
          </Form.Item>

          <Form.Item
            name="order_date"
            label="Order Date"
            rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} order time` }]}
          >
            <DatePicker format={["DD/MM/YYYY"]} />
          </Form.Item>

          <Form.Item
            name="due_date"
            label="Due Date"
            rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} order time` }]}
          >
            <DatePicker format={["DD/MM/YYYY"]} />
          </Form.Item>
        </Form>
      </StyledModalContent>
    </Modal>
  );
}
