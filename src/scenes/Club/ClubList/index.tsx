/* eslint-disable no-extra-boolean-cast */
import { Button, DatePicker, Form, Input, Modal, notification } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import Table, { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, { useCallback, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { getAccessToken } from "../../../http-common";
import { UserContext } from "@/context/UserContext";
import { MESSAGE_VALIDATE_BASE } from "@/constants/MessageConstant";
import ClubService from "@/services/club";
const { TextArea } = Input;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

const StyledBookList = styled.div`
  border-radius: 12px;
  padding: 30px;
  background: #fff;
  width: 100%;
  margin-top: 70px;
`;
const StyledModalContent = styled.div`
  padding: 30px;
`;

const ClubList = () => {
  const [loading, setLoading] = useState(false);
  const [clubList, setClubList] = useState([]);
  const [clubId, setClubId] = useState();
  const [form] = Form.useForm();
  const dateFormatList = ["DD/MM/YYYY"];
  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current && current > dayjs().endOf("day");
  };
  const { user } = useContext(UserContext);

  const [modalJoin, setModalJoin] = useState(false);

  const initFetch = useCallback(async () => {
    setLoading(true);
    ClubService.getListClub()
      .then((response) => {
        if (response.data) {
          const data = response.data.map((item: any, index: any) => {
            return { no: index + 1, ...item };
          });
          setClubList(data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    initFetch();
  }, []);

  const handleCloseJoin = () => {
    form.resetFields();
    setModalJoin(false);
  };

  const handleOpenJoin = (_item: any) => {
    setClubId(_item.id);
    console.log(user, "useruseruser");

    form.setFieldsValue({
      full_name: user.full_name,
      phone_number: user.phone_number,
      email: user.email,
      address: user.address,
      birth_date: user.birth_date ? dayjs(user.birth_date) : "",
    });
    setModalJoin(true);
  };

  const onFinish = (_values: any) => {
    form
      .validateFields()
      .then((formValues) => {
        const data = {
          club_id: clubId,
          full_name: formValues.full_name,
          phone_number: formValues.phone_number,
          email: formValues.email,
          address: formValues.address,
          birth_date: dayjs(formValues.birth_date).format("YYYY-MM-DD"),
          reason: formValues.reason,
        };
        ClubService.joinCLub(data)
          .then((res: any) => {
            if (res?.error?.message) {
              notification.info({
                message: "Info",
                description: res.payload.error || res.payload,
              });
              return;
            }
            notification.success({
              message: "Your request has been send successfully, please wait for approval. Thank you!",
              type: "success",
            });
            initFetch();
          })
          .finally(() => {
            setModalJoin(false);
            form.resetFields();
          });
      })
      .catch((_errors) => {
        notification.info({ message: "Please make sure that you enter all field" });
      });
  };
  const disableJoinedClubBtn = (item: any) => {
    if (!getAccessToken() || item.is_member) {
      return true;
    }
    return false;
  };
  const columns: ColumnsType<any> = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Created Date",
      key: "created_at",
      dataIndex: "created_at",
      render: (value: any) => {
        return dayjs(value).format("DD-MM-YYYY");
      },
    },
    {
      title: "Total member",
      key: "total_member_count",
      dataIndex: "total_member_count",
    },
    {
      title: "Total book count",
      key: "total_book_count",
      dataIndex: "total_book_count",
    },
    {
      title: "Action",
      key: "",
      dataIndex: "",
      render: (_values: any) => {
        return (
          <>
            <Button type="primary" disabled={disableJoinedClubBtn(_values)} onClick={() => handleOpenJoin(_values)}>
              Join Club
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <StyledBookList>
      <Table loading={loading} columns={columns} dataSource={clubList} />
      <Modal title="Join Club" width={800} open={modalJoin} onCancel={handleCloseJoin} onOk={onFinish}>
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
              rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} phone number` }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} email` }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} address` }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="birth_date"
              label="Date of Birth"
              rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} date of birth` }]}
            >
              <DatePicker disabledDate={disabledDate} style={{ width: "100%" }} format={dateFormatList} />
            </Form.Item>
            <Form.Item
              name="reason"
              label="Reason"
              rules={[{ required: true, message: `${MESSAGE_VALIDATE_BASE} reason` }]}
            >
              <TextArea rows={4} placeholder="Why you want to join this club..." />
            </Form.Item>
          </Form>
        </StyledModalContent>
      </Modal>
    </StyledBookList>
  );
};

export default ClubList;
