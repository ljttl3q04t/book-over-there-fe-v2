import { getBookByLink } from "@/scenes/User/MyBook/callService";
import bookService from "@/services/book";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Drawer, Form, FormInstance, Input, Modal, Space, Upload, notification } from "antd";
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

function DrawerBook({ open, onClose, bookEdit, title }: any) {
  const [form] = Form.useForm();
  const formRef = React.useRef<FormInstance>(null);
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
        publisher: bookEdit?.bookPublisher,
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
    const formData = new FormData();
    setIsLoading(true);
    if (fileList[0]) {
      formData.append("book.name", values.name);
      formData.append("book.category.name", values.category);
      formData.append("book.author.name", values.author);
      formData.append("book.publisher.name", values.publisher);
      formData.append("book.image", (fileList[0] as RcFile) ? (fileList[0] as RcFile) : "");
    } else {
      formData.append("book.name", values.name);
      formData.append("book.category.name", values.category);
      formData.append("book.author.name", values.author);
      formData.append("book.publisher.name", values.publisher);
      formData.append("book.image_url", fileListPreview[0]?.url as string);
    }
    try {
      const res = await bookService.createBook(formData);
      notification.info({
        message: "Info",
        description: res.result,
      });
      // fetchBookList()
      onClose();
      setFileListPreview([]);
      setIsLoading(false);
    } catch (err: any) {
      if (!fileList[0]) {
        notification.error({
          message: `Validation Error: }`,
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
    } finally {
      setIsLoading(false);
    }
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
          category: book?.book_category_name,
          image: book?.book_image,
          author: book?.book_author_name,
          publisher: book?.book_publisher_name,
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
          <Button onClick={() => form.submit()} type="primary" disabled={isLoading}>
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

        <Form.Item name="category" label="Category" rules={[{ required: true, message: "Please enter category" }]}>
          <Input style={{ width: "100%" }} placeholder="Please enter category" />
        </Form.Item>
        <Form.Item name="author" label="Author" rules={[{ required: true, message: "Please enter author" }]}>
          <Input style={{ width: "100%" }} placeholder="Please enter author" />
        </Form.Item>
        <Form.Item name="publisher" label="Publisher" rules={[{ required: true, message: "Please enter publisher" }]}>
          <Input style={{ width: "100%" }} placeholder="Please enter publisher" />
        </Form.Item>
      </Form>
    </Drawer>
  );
}

export default DrawerBook;
