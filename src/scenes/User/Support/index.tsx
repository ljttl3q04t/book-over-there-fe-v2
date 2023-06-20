import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, notification, Typography, Upload } from "antd";
import type { FormInstance } from "antd/es/form";
import type { RcFile, UploadProps } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";
import React, { useState } from "react";

const { Title } = Typography;

const { TextArea } = Input;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 4, span: 16 },
};

const Support = () => {
  const formRef = React.useRef<FormInstance>(null);

  const onFinish = (values: any) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("username", values.username);
    formData.append("email", values.email);
    formData.append("description", values.description);
    if (values.issuePic) {
      formData.append("issuePic", values.issuePic);
    }
    onReset();
    notification.success({
      message: "Ticket Has Been Send",
      description:
        "Hi there, Book Over There has take your ticket. We will response to you as soon as possible. Please check your email for further info. Thank you & have a nice day!!",
    });
  };

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

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
      formRef.current?.setFieldsValue({ issuePic: selectedFile });
    } else {
      formRef.current?.setFieldsValue({ issuePic: undefined });
    }
  };
  const handleCancel = () => setPreviewOpen(false);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const onReset = () => {
    formRef.current?.resetFields();
    setFileList([]);
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
          padding: 30,
          border: "1px solid rgba(0,0,0,0.2)",
          borderRadius: 10,
          boxShadow: "rgb(0 0 0 / 12%) 0px 5px 5px",
          float: "left",
        }}
      >
        <Title level={2} style={{ textAlign: "center", marginBottom: "30px" }}>
          Support Center
        </Title>
        <Form {...layout} ref={formRef} name="control-ref" onFinish={onFinish} style={{ width: 800 }}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="Enter your issue here..." />
          </Form.Item>
          <Form.Item name={"issuePic"} valuePropName="fileList">
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
              <img alt="example" style={{ width: "100%" }} src={previewImage} />
            </Modal>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button style={{ marginRight: "10px" }} type="primary" htmlType="submit">
              Submit
            </Button>
            <Button htmlType="button" onClick={onReset}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Support;
