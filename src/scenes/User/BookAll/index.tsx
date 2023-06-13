import React, { useState } from "react";
import CardBook from "../../../component/CardBook";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  notification,
  Select,
  Upload,
} from "antd";
import { PlusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd/es/form";
import type { RcFile, UploadProps } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";

const { Option } = Select;
const { TextArea } = Input;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

function AllBook() {
  const formRef = React.useRef<FormInstance>(null);
  const [modalAdd, setModalAdd] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };
  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0) {
      const selectedFile = newFileList[0].originFileObj as File;
      formRef.current?.setFieldsValue({ bookCover: selectedFile });
    } else {
      formRef.current?.setFieldsValue({ bookCover: undefined });
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
    const formData = new FormData();
    formRef.current
      ?.validateFields()
      .then((formValues) => {
        formData.append("title", formValues.title);
        formData.append("author", formValues.author);
        formData.append("quantity", formValues.quantity);
        formData.append("category", formValues.category);
        formData.append("description", formValues.description);
        if (formValues.bookCover) {
          formData.append("bookCover", formValues.bookCover);
        }
        formData.forEach((value, name) => {
          console.log(`Field: ${name}, Value: ${value}`);
        });
        notification.success({ message: "Book added successfully" });
        setModalAdd(false);
        formRef.current?.resetFields();
        setFileList([]);
      })
      .catch((errors) => {
        notification.info({
          message: "Please make sure that you enter correctly",
        });
      });
  };

  const handleDelete = () => {};

  return (
    <>
      <div>
        <Select defaultValue={"All"} size="large" style={{ width: 250 }}>
          <Option value="All">ALL</Option>
          <Option value="newest">Newest</Option>
          <Option value="oldest">Oldest</Option>
          <Option value="a-z">A-Z</Option>
          <Option value="z-a">Z-A</Option>
        </Select>
        <Button
          size="large"
          type="primary"
          icon={<PlusCircleOutlined />}
          style={{ marginBottom: "20px", float: "right" }}
          onClick={() => setModalAdd(true)}
        >
          Add Book
        </Button>
      </div>
      <Modal
        width={800}
        open={modalAdd}
        title="Add new book"
        onCancel={() => {
          setModalAdd(false);
          formRef.current?.resetFields();
          setFileList([]);
        }}
        onOk={onFinish}
      >
        <Form
          {...layout}
          ref={formRef}
          name="control-ref"
          style={{ width: 800 }}
        >
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="author" label="Author" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="action">Action</Option>
              <Option value="horror">Horror</Option>
              <Option value="spy">Spy</Option>
              <Option value="adventure">Adventure</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <TextArea rows={4} placeholder="Enter book description..." />
          </Form.Item>
          <Form.Item name="bookCover">
            <div style={{ marginLeft: 100 }}>
              <Upload
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
              <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
              >
                <img
                  alt="example"
                  style={{ width: "100%" }}
                  src={previewImage}
                />
              </Modal>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      <Row gutter={[32, 32]} style={{ width: "100%" }}>
        {[1, 2, 3, 1, 2, 3, 4, 1, 2, 4, 5, 5, 5].map(() => (
          <Col>
            <CardBook
              width="280px"
              height="350px"
              onEdit={() => setModalAdd(true)}
              onDelete={handleDelete}
            />
          </Col>
        ))}
      </Row>
    </>
  );
}

export default AllBook;
