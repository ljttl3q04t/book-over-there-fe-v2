/* eslint-disable unused-imports/no-unused-vars */
import { PlusOutlined } from "@ant-design/icons";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { Button, DatePicker, Form, Image, Input, notification, Select } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import type { FormInstance } from "antd/es/form";
import type { RcFile, UploadProps } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import Loading from "../../../component/Loading";
import { getUser, updateUser } from "../../../store/userStore";

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const Personal = () => {
  const formRef = React.useRef<FormInstance>(null);
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const [loading, setLoading] = useState(false);
  const dateFormatList = ["DD/MM/YYYY"];
  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current && current > dayjs().endOf("day");
  };

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const initFetch = useCallback(async () => {
    setLoading(true);
    dispatch(getUser())
      .then((response) => {
        if (response.payload) {
          formRef.current?.setFieldsValue({
            username: response.payload.username,
            full_name: response.payload.full_name,
            address: response.payload.address,
            email: response.payload.email,
            phone_number: response.payload.phone_number,
            gender: "male",
            birth_date: response?.payload?.birth_date === null ? "" : dayjs(response?.payload?.birth_date),
          });
        }
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    initFetch();
  }, []);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1));
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0) {
      const selectedFile = newFileList[0].originFileObj as File;
      formRef.current?.setFieldsValue({ profilePic: selectedFile });
    } else {
      formRef.current?.setFieldsValue({ profilePic: undefined });
    }
  };
  const handleCancel = () => setPreviewOpen(false);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const onFinish = (values: any) => {
    const data = {
      username: values.username,
      full_name: values.full_name,
      address: values.address,
      email: values.email,
      phone_number: values.phone_number,
      birth_date: dayjs(values.birth_date).format("YYYY-MM-DD"),
    };

    setLoading(true);
    dispatch(updateUser(data))
      .then((res: any) => {
        if (res?.error?.message) {
          notification.info({
            message: "Info",
            description: res.payload.error || res.payload,
          });
          return;
        }
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
          borderRadius: 10,
          border: "1px solid rgba(0,0,0,0.2)",
          boxShadow: "rgb(0 0 0 / 12%) 0px 5px 5px",
        }}
      >
        <div>
          <Image
            style={{ float: "left" }}
            width={200}
            src="https://cdn.eduncle.com/library/scoop-files/2020/6/image_1593346767460.jpg"
          />
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
          {/* <Form.Item name={"profilePic"} valuePropName="fileList">
            <Upload
              accept="image/*"
              listType="picture-circle"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              beforeUpload={() => {
                return false;
              }}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </Form.Item> */}
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
