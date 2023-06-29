/* eslint-disable @typescript-eslint/no-non-null-assertion */
// import {PlusOutlined } from '@ant-design/icons';
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Image, Input, notification, Select, Upload } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import type { FormInstance } from "antd/es/form";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import dayjs from "dayjs";
import React, { useCallback, useContext, useEffect, useState } from "react";

import Loading from "../../../component/Loading";
import { UserContext } from "@/context/UserContext";
import UserService from "@/services/user";
const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const Personal = () => {
  const formRef = React.useRef<FormInstance>(null);
  const [loading, setLoading] = useState(false);
  const dateFormatList = ["DD/MM/YYYY"];
  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current && current > dayjs().endOf("day");
  };

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [fileListPreview, setFileListPreview] = useState<UploadFile[]>([]);
  const { user, setLoggedInUser } = useContext(UserContext);

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      setFileListPreview([{
        uid: '-xxx',
        percent: 50,
        name: 'image.png',
        status: 'done',
        url: URL.createObjectURL(file),
      }])
      return false;
    },
    fileList: fileListPreview,
  };

  const initFetch = useCallback(async () => {
    setLoading(true);

    formRef.current?.setFieldsValue({
      username: user?.username,
      full_name: user?.full_name,
      address: user?.address,
      email: user?.email,
      phone_number: user?.phone_number,
      gender: "male",
      birth_date: user?.birth_date === null ? "" : dayjs(user?.birth_date),
      avatar: user?.avatar,
    });

    setFileListPreview([{
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: user?.avatar,
    }])

    setLoading(false);
  }, [user]);

  useEffect(() => {
    initFetch();
  }, [user]);

  const onFinish = (values: any) => {
    setLoading(true);
    const data = {
      username: values.username,
      full_name: values.full_name,
      address: values.address,
      email: values.email,
      phone_number: values.phone_number,
      birth_date: dayjs(values.birth_date).format("YYYY-MM-DD"),
      avatar: fileList[0] as RcFile,
    };
    
    UserService.updateUser(data)
      .then((res: any) => {
        if (res?.error?.message) {
          notification.info({
            message: "Info",
            description: res.payload.error || res.payload,
          });
          return;
        }
        setLoggedInUser(res.data);
        setFileList([]);
        notification.success({
          message: "Update info successfully",
          type: "success",
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // marginTop: "70px",
      }}
    >
      <div
        style={{
          display: "flex",
          padding: 30,
          background: "#fff",
          borderRadius: 10,
          boxShadow: "rgb(0 0 0 / 12%) 0px 5px 5px",
        }}
      >
        <div>
          <Image style={{ float: "left" }} width={200} src={user?.avatar} />
        </div>
        <Form {...layout} ref={formRef} name="control-ref" onFinish={onFinish} style={{ width: 600 }}>
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input
            disabled
            />
          </Form.Item>
          <Form.Item name="full_name" label="Full Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Address" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone_number" label="Phone number" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
            <Select placeholder="Select your gender" allowClear defaultValue={"male"}>
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item name="birth_date" label="Date of birth" rules={[{ required: true }]}>
            <DatePicker disabledDate={disabledDate} style={{ width: "100%" }} format={dateFormatList} />
          </Form.Item>
          <Form.Item name="avatar" label="Avatar">
            <Upload multiple={false} {...props} listType="picture-card">
              {uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button style={{ marginRight: "10px" }} type="primary" htmlType="submit">
              Submit
            </Button>
            <Button htmlType="button" onClick={initFetch}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </div>
      {loading && <Loading />}
    </div>
  );
};

export default Personal;
