import { MESSAGE_VALIDATE_BASE } from "@/constants/MessageConstant";
import { Button, DatePicker, Form, FormInstance, Input, Modal, Select, notification } from "antd";
import * as React from "react";
import styled from "styled-components";
import moment from "moment";
import { BookClubInfo, ClubBookInfos, MemberInfos } from "@/services/types";
import dfbServices from "@/services/dfb";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

type CreateOrderModalProps = {
  open: boolean;
  onCancel: () => void;
  members: MemberInfos[];
  clubBookInfos: ClubBookInfos[];
  staffClubs: BookClubInfo[];
  onRefresh: any;
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
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isNewMember, setIsNewMember] = React.useState(false);
  const { t } = useTranslation();

  const [form] = Form.useForm();
  const formRef = React.useRef<FormInstance>(form);
  const [orderDate, setOrderDate] = React.useState(moment());
  const [dueDate, setDueDate] = React.useState(moment().add(35, "days"));

  const handleOrderDateChange = (date: any) => {
    const newDueDate = date.add(35, "days");
    setOrderDate(date);
    setDueDate(newDueDate);
    formRef.current?.setFieldsValue({ due_date: newDueDate });
  };

  React.useEffect(() => {
    formRef.current?.setFieldsValue({
      club: staffClubs[0]?.id,
      order_date: orderDate,
      due_date: dueDate,
    });
    setIsNewMember(false);
  }, [open]);

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();
      const data: any = {
        club_id: values.club,
        order_date: dayjs(values.order_date?.toDate()).format("YYYY-MM-DD"),
        due_date: dayjs(values.due_date?.toDate()).format("YYYY-MM-DD"),
        club_book_ids: values.select_books.join(","),
      };
      if (isNewMember) {
        data["new_member"] = {
          full_name: values["memberFullName"],
          code: values["memberCode"],
          phone_number: values["memberPhoneNumber"],
          club_id: values.club,
        };
      } else {
        data["member_id"] = values.member;
      }
      const api = isNewMember ? dfbServices.createOrderNewMember : dfbServices.createOrder;
      const message = await api(data);
      notification.success({ message: message, type: "success" });
      form.resetFields();
      await onRefresh();
      onCancel();
    } catch (error: any) {
      console.error(error);
      notification.error({ message: t(error.message) as string });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title={t("Create New Order") as string}
      open={open}
      width={800}
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            onCancel();
          }}
        >
          {t("Cancel") as string}
        </Button>,
        <Button key="submit" type="primary" loading={isSubmitting} onClick={onSubmit}>
          {t("Submit") as string}
        </Button>,
      ]}
      centered
    >
      <StyledModalContent>
        <Form {...layout} form={form} ref={formRef} name="control-ref" style={{ width: 800 }}>
          <Form.Item name="club" label="Club" rules={[{ required: true, message: "Please select club" }]}>
            <Select placeholder="Please select a club">
              {staffClubs.map((club) => (
                <Select.Option key={club.id} value={club.id}>
                  {club.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="member"
            label={t("Select Member") as string}
            rules={[{ required: true, message: t("Please select a member") as string }]}
          >
            <Select
              showSearch
              filterOption={(input, option: any) =>
                (option?.children ?? "").toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={(v) => {
                setIsNewMember(v === "new");
              }}
            >
              <Select.Option value="new">{t("New Member") as string}</Select.Option>
              {members.map((member: MemberInfos) => (
                <Select.Option key={member.id} value={member.id}>
                  {`${member.full_name} - ${member.code} - ${member.phone_number || ""}`}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {isNewMember && (
            <>
              <Form.Item
                name="memberFullName"
                label={t("Full Name") as string}
                rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} full name` }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="memberCode"
                label="Code"
                rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} member code` }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="memberPhoneNumber"
                label={t("Phone Number") as string}
                rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} phone number` }]}
              >
                <Input />
              </Form.Item>
            </>
          )}

          <Form.Item
            label={t("Select Books") as string}
            name="select_books"
            rules={[{ required: true, message: t("Please enter your select at least one book") as string }]}
          >
            <Select
              mode="multiple"
              showArrow
              style={{ width: "100%" }}
              showSearch
              filterOption={(input, option: any) =>
                (option?.children ?? "").toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {clubBookInfos.map((item) => (
                <Select.Option value={item.id}>{`${item.book.name} - ${item.code}`}</Select.Option>
              ))}
              {clubBookInfos.map((item) => {
                return <Select.Option value={item.id}>{`${item.book.name}`}</Select.Option>;
              })}
            </Select>
          </Form.Item>

          <Form.Item
            name="order_date"
            label={t("Order Date") as string}
            initialValue={orderDate}
            rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} order time` }]}
          >
            <DatePicker format={["DD/MM/YYYY"]} onChange={handleOrderDateChange} />
          </Form.Item>

          <Form.Item
            name="due_date"
            label={t("Due Date") as string}
            initialValue={dueDate}
            rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} order time` }]}
          >
            <DatePicker format={["DD/MM/YYYY"]} disabled />
          </Form.Item>
        </Form>
      </StyledModalContent>
    </Modal>
  );
}
