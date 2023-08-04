import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Image, Input, notification, Upload } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import type { FormInstance } from "antd/es/form";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import dayjs from "dayjs";
import React, { useCallback, useContext, useEffect, useState } from "react";

import Loading from "../../../component/Loading";
import { UserContext } from "@/context/UserContext";
import UserService from "@/services/user";
import { useTranslation } from "react-i18next";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const Personal = () => {
  const { t } = useTranslation();
  const formRef = React.useRef<FormInstance>(null);
  const [loading, setLoading] = useState(false);
  const dateFormatList = ["DD/MM/YYYY"];
  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current && current > dayjs().endOf("day");
  };

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [fileListPreview, setFileListPreview] = useState<UploadFile[]>([]);
  const { user, setLoggedInUser } = useContext(UserContext);
  const [hasChange, setHasChange] = React.useState(false);

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>{t("Upload") as string}</div>
    </div>
  );

  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
      setFileListPreview([]);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      setFileListPreview([
        {
          uid: "-xxx",
          percent: 50,
          name: "image.png",
          status: "done",
          url: URL.createObjectURL(file),
        },
      ]);
      return false;
    },
    fileList: fileListPreview,
  };

  const initFetch = useCallback(async () => {
    setHasChange(false);
    setLoading(true);

    formRef.current?.setFieldsValue({
      username: user?.username,
      full_name: user?.full_name,
      address: user?.address,
      email: user?.email,
      phone_number: user?.phone_number,
      birth_date: user?.birth_date === null ? "" : dayjs(user?.birth_date),
      avatar: user?.avatar,
    });

    setFileListPreview([
      {
        uid: "-1",
        name: "image.png",
        status: "done",
        url: user?.avatar,
      },
    ]);

    setLoading(false);
  }, [user]);

  useEffect(() => {
    initFetch();
  }, [user]);

  const handleFormValuesChange = (changedValues: any) => {
    const isDiff = Object.keys(changedValues).some((field) => {
      return changedValues[field] != user[field];
    });
    setHasChange(isDiff);
  };

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const data: any = {
        username: values.username,
        full_name: values.full_name,
        address: values.address,
        email: values.email,
        phone_number: values.phone_number,
        birth_date: dayjs(values.birth_date).format("YYYY-MM-DD"),
      };
      const updateData: any = {};
      for (const [k, v] of Object.entries(data)) {
        if (v !== user[k]) {
          updateData[k] = v;
        }
      }
      if (fileList[0]) updateData.avatar = fileList[0] as RcFile;
      const updateUser = await UserService.updateUser(updateData);
      setLoggedInUser(updateUser);
      notification.success({
        message: "Update info successfully",
        type: "success",
      });
    } catch (error: any) {
      console.error(error);
      notification.error({ message: t(error.message) as string });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
        <Form
          {...layout}
          ref={formRef}
          name="control-ref"
          onFinish={onFinish}
          style={{ width: 600 }}
          onValuesChange={handleFormValuesChange}
        >
          <Form.Item name="username" label={t("Username") as string} rules={[{ required: true }]}>
            <Input disabled />
          </Form.Item>
          <Form.Item name="full_name" label={t("Full Name") as string} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="address" label={t("Address") as string} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label={t("Email") as string} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone_number" label={t("Phone Number") as string} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="birth_date" label={t("Date of birth") as string} rules={[{ required: true }]}>
            <DatePicker disabledDate={disabledDate} style={{ width: "100%" }} format={dateFormatList} />
          </Form.Item>
          <Form.Item name="avatar" label={t("Avatar") as string}>
            <Upload multiple={false} {...props} listType="picture-card">
              {uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button style={{ marginRight: "10px" }} type="primary" htmlType="submit" disabled={!hasChange}>
              {t("Submit") as string}
            </Button>
            <Button htmlType="button" onClick={initFetch}>
              {t("Cancel") as string}
            </Button>
          </Form.Item>
        </Form>
      </div>
      {loading && <Loading />}
    </div>
  );
};

export default Personal;
