/* eslint-disable @typescript-eslint/no-non-null-assertion */
// import {PlusOutlined } from '@ant-design/icons';
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { Button, DatePicker, Form, Image, Input, notification, Select, Upload } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import type { FormInstance } from "antd/es/form";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Loading from "../../../component/Loading";
import { updateUser } from "../../../store/userStore";

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

// const getBase64 = (file: RcFile): Promise<string> =>
//   new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result as string);
//     reader.onerror = (error) => reject(error);
//   });

const Personal = () => {
  const formRef = React.useRef<FormInstance>(null);
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const [loading, setLoading] = useState(false);
  const dateFormatList = ["DD/MM/YYYY"];
  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current && current > dayjs().endOf("day");
  };

  const { userInfo }: any = useSelector<any>((state) => state.user);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

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
      fileList[0] = file;
      setFileList(fileList);
      return false;
    },
    fileList,
  };

  const initFetch = useCallback(async () => {
    setLoading(true);
    fileList.push({
      uid: "-1",
      name: "avatar.png",
      status: "done",
      url: userInfo.avatar,
    });
    formRef.current?.setFieldsValue({
      username: userInfo.username,
      full_name: userInfo.full_name,
      address: userInfo.address,
      email: userInfo.email,
      phone_number: userInfo.phone_number,
      gender: "male",
      birth_date: userInfo.birth_date === null ? "" : dayjs(userInfo.birth_date),
      avatar: userInfo.avatar,
    });

    setLoading(false);
  }, [userInfo]);

  useEffect(() => {
    initFetch();
  }, [userInfo]);

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
    dispatch(updateUser(data))
      .then((res: any) => {
        if (res?.error?.message) {
          notification.info({
            message: "Info",
            description: res.payload.error || res.payload,
          });
          return;
        }
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
        marginTop: "70px",
      }}
    >
      <div
        style={{
          display: "flex",
          padding: 30,
          background:"#fff",
          borderRadius: 10,
          boxShadow: "rgb(0 0 0 / 12%) 0px 5px 5px",
        }}
      >
        <div>
          <Image style={{ float: "left" }} width={200} src={userInfo.avatar} />
        </div>
        <Form {...layout} ref={formRef} name="control-ref" onFinish={onFinish} style={{ width: 600 }}>
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input />
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
              { uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button style={{ marginLeft: "235px", marginRight: "10px" }} type="primary" htmlType="submit">
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
