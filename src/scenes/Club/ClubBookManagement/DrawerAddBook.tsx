import { getBookByLink } from "@/scenes/User/MyBook/callService";
import dfbServices from "@/services/dfb";
import { CategoryInfos } from "@/services/types";
import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Drawer,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Upload,
  notification,
} from "antd";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import Tooltip from "antd/lib/tooltip";
import * as React from "react";

const { Search } = Input;
const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

function DrawerAddBook({ open, onClose, bookEdit, title, categories }: any) {
  const [form] = Form.useForm();
  const formRef = React.useRef<FormInstance>(form);
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState("");
  const [previewTitle, setPreviewTitle] = React.useState("");
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);
  const [fileListPreview, setFileListPreview] = React.useState<UploadFile[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (bookEdit) {
      formRef.current?.setFieldsValue({
        name: bookEdit?.bookName,
        category: bookEdit?.bookCategory,
        image: bookEdit?.bookImage,
        bookStatus: bookEdit?.bookStatus,
        author: bookEdit?.bookAuthor,
      });
      setFileListPreview([
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url: bookEdit?.bookImage,
        },
      ]);
    }
  }, [bookEdit]);

  const onFinish = async (values: any) => {
    try {
      console.log("values", values);
      setIsLoading(true);
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("code", values.code);
      formData.append("category", values.category);
      formData.append("author", values.author);
      formData.append("init_count", values.initialCount);
      formData.append("current_count", values.currentCount);
      formData.append("club_id", "5");

      // if (fileList.length > 0) {
      //   formData.append("image", (fileList[0] as RcFile) ? (fileList[0] as RcFile) : "");
      // } else {
      //   formData.append("image", fileListPreview[0]?.url as string);
      // }
      const message = await dfbServices.createBook(formData);
      notification.success({ message: message, type: "success" });
      onClose();
      setFileListPreview([]);
      setIsLoading(false);
    } catch (err: any) {
      console.log("err create: ", err.response);
      if (!fileList[0]) {
        notification.error({
          message: `Validation Error: ${err.message}`,
          description: "please choose a file",
        });
      }
      Object.keys(err.response.data.book).forEach((field) => {
        const errors = err.response.data.book[field];
        errors.forEach((errorMessage: any) => {
          notification.error({
            message: `Validation Error: ${field}`,
            description: errorMessage,
          });
        });
      });
    }
    setIsLoading(false);
  };

  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
      setFileListPreview([]);
    },
    beforeUpload: (file) => {
      setFileListPreview([
        {
          uid: "-xxx",
          percent: 50,
          name: "image.png",
          status: "done",
          url: URL.createObjectURL(file),
        },
      ]);

      setFileList([file]);
      return false;
    },
    fileList: fileListPreview,
  };

  React.useEffect(() => {
    if (open === false) {
      form.resetFields();
      setFileList([]);
    }
  }, [form, open]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || (file.url && file.url.substring(file.url.lastIndexOf("/") + 1)) || "");
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const handleCancel = () => setPreviewOpen(false);

  const changeLink = async (value: string) => {
    try {
      setIsLoading(true);
      const book: any = await getBookByLink({ remote_url: value });
      if (book) {
        formRef.current?.setFieldsValue({
          name: book?.book_name,
          image: book?.book_image,
          author: book?.book_author_name,
        });
        setFileListPreview([
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url: book?.book_image,
          },
        ]);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching book list:", error);
    }
  };

  return (
    <Drawer
      size={"large"}
      title={title}
      onClose={() => {
        onClose();
        setFileListPreview([]);
      }}
      open={open}
      bodyStyle={{ paddingBottom: 80 }}
      extra={
        <Space>
          <Button
            onClick={() => {
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button onClick={() => form.submit()} type="primary">
            Save
          </Button>
        </Space>
      }
    >
      <Form layout="vertical" form={form} onFinish={onFinish} ref={formRef}>
        <Form.Item name="link" label="Link">
          <Tooltip title="You can select link book from Tiki or Fahasa " color={"#108ee9"}>
            <Search
              disabled={isLoading}
              size="large"
              style={{ width: "100%" }}
              placeholder="You can select link book from Tiki or Fahasa"
              onSearch={changeLink}
            />
          </Tooltip>
        </Form.Item>
        <Form.Item name="image" label="Cover">
          <Upload accept="image/*" multiple={false} listType="picture-card" onPreview={handlePreview} {...props}>
            {uploadButton}
          </Upload>
          <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
            <img alt="example" style={{ width: "100%" }} src={previewImage} />
          </Modal>
        </Form.Item>

        <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter name" }]}>
          <Input style={{ width: "100%" }} placeholder="Please enter name" min={1} />
        </Form.Item>

        <Form.Item name="code" label="Code" rules={[{ required: true, message: "Please enter code" }]}>
          <Input style={{ width: "100%" }} placeholder="Please enter code" min={1} />
        </Form.Item>

        <Form.Item name="category" label="Category" rules={[{ required: true, message: "Please select a category" }]}>
          <Select
            placeholder="Please select a category"
            showSearch
            filterOption={(input, option: any) =>
              (option?.children ?? "").toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {categories.map((category: CategoryInfos) => (
              <Select.Option key={category.id} value={category.id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="author" label="Author" rules={[{ required: true, message: "Please enter author" }]}>
          <Input style={{ width: "100%" }} placeholder="Please enter author" />
        </Form.Item>

        <Form.Item
          name="initialCount"
          label="Initial Count"
          rules={[{ required: true, message: "Please enter the initial count" }]}
        >
          <InputNumber style={{ width: "100%" }} placeholder="Please enter the initial count" />
        </Form.Item>

        <Form.Item
          name="currentCount"
          label="Current Count"
          rules={[{ required: true, message: "Please enter the current count" }]}
        >
          <InputNumber style={{ width: "100%" }} placeholder="Please enter the current count" />
        </Form.Item>
      </Form>
    </Drawer>
  );
}

export default DrawerAddBook;
