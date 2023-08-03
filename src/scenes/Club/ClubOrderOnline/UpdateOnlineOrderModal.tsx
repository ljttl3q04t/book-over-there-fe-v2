import { MESSAGE_VALIDATE_BASE } from "@/constants/MessageConstant";
import defaultImage from "@/image/book-default.png";
import { Avatar, Button, DatePicker, Form, Input, List, Modal, notification } from "antd";
import moment from "moment";
import * as React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { OnlineOrderTableRow } from "./types";

type UpdateOnlineOrderModalProps = {
  open: boolean;
  onCancel: () => void;
  onRefresh: () => void;
  form: any;
  formRef: any;
  currentOrder: OnlineOrderTableRow | undefined;
  handleSubmitUpdateOrder: any;
};

const StyledModalContent = styled.div`
  padding: 30px;
`;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

export function UpdateOnlineOrderModal(props: UpdateOnlineOrderModalProps) {
  const { open, onCancel, onRefresh, currentOrder, form, formRef, handleSubmitUpdateOrder } = props;
  const [loading, setLoading] = React.useState(false);
  const [hasChange, setHasChange] = React.useState(false);
  const [dueDate, setDueDate] = React.useState(moment().add(35, "days"));

  const { t } = useTranslation();

  const handleCancel = () => {
    onCancel();
  };

  const handleFormValuesChange = (changedValues: any) => {
    const isDiff = Object.keys(changedValues).some((field) => {
      return changedValues[field] != currentOrder[field];
    });
    setHasChange(isDiff);
  };

  const handleOrderDateChange = (date: any) => {
    const newDueDate = date.add(35, "days");
    setDueDate(newDueDate);
    formRef.current?.setFieldsValue({ dueDate: newDueDate });
  };

  React.useEffect(() => {
    setHasChange(false);
    formRef.current?.setFieldsValue({
      fullName: currentOrder?.fullName,
      phoneNumber: currentOrder?.phoneNumber,
      address: currentOrder?.address,
      orderDate: moment(currentOrder?.orderDate, "YYYY-MM-DD"),
      dueDate: moment(currentOrder?.dueDate, "YYYY-MM-DD"),
    });
  }, [currentOrder, form]);

  React.useEffect(() => {
    formRef.current?.setFieldsValue({
      fullName: currentOrder?.fullName,
      phoneNumber: currentOrder?.phoneNumber,
      address: currentOrder?.address,
      orderDate: moment(currentOrder?.orderDate, "YYYY-MM-DD"),
      dueDate: moment(currentOrder?.dueDate, "YYYY-MM-DD"),
    });
  }, [open]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await handleSubmitUpdateOrder();
      onRefresh();
      onCancel();
    } catch (error: any) {
      const errorMessage = error.message || "An error occurred while updating the member.";
      notification.error({ message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={t("Update Online Order") as string}
      open={open}
      width={800}
      onCancel={handleCancel}
      onOk={handleSubmit}
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
          id="updateOnlineOrder"
          form={form}
          ref={formRef}
          name="control-ref"
          style={{ width: 800 }}
          onValuesChange={handleFormValuesChange}
        >
          <Form.Item
            name="fullName"
            label={t("Full Name") as string}
            rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} full name` }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label={t("Phone Number") as string}
            rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} phone number` }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label={t("Address") as string}
            rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} address` }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="orderDate"
            label={t("Order Date") as string}
            rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} order time` }]}
          >
            <DatePicker format={["DD/MM/YYYY"]} onChange={handleOrderDateChange} />
          </Form.Item>
          <Form.Item
            name="dueDate"
            label={t("Due Date") as string}
            initialValue={dueDate}
            rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} order time` }]}
          >
            <DatePicker format={["DD/MM/YYYY"]} disabled />
          </Form.Item>
          <Form.Item name="selected_book" label={t("Selected Books") as string} rules={[{ required: false }]}>
            <List
              itemLayout="horizontal"
              dataSource={currentOrder?.books}
              renderItem={(item: any) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.book.image ? item.book.image : defaultImage} />}
                    title={<p>{item.book.name}</p>}
                  />
                </List.Item>
              )}
            />
          </Form.Item>
        </Form>
      </StyledModalContent>
    </Modal>
  );
}
