import { createFileFromImageLink } from "@/helpers/fuctionHepler";
import { getBookByLink, getListBookInit } from "@/scenes/User/MyBook/callService";
import bookService from "@/services/book";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Drawer, Form, FormInstance, Input, Modal, Select, Space, Upload, notification } from "antd";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import Tooltip from "antd/lib/tooltip";
import { useEffect, useRef, useState } from "react";
import React from "react";

const { Option } = Select;
const { Search } = Input;
const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

function DawerBook({ open, onSubmit, onClose, fetchBookList, bookEdit, title }: any) {


  const [form] = Form.useForm();
  const formRef = useRef<FormInstance>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [fileListPreview, setFileListPreview] = useState<UploadFile[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [booksTemp, setBooksTemp] = useState<any[]>([]);
  const [option, setOption] = useState({
    pageIndex: 1,
    pageSize: 1000,
    txtSearch: ''
  });


  useEffect(() => {
    if (bookEdit) {
      formRef.current?.setFieldsValue({
        name: bookEdit?.bookName,
        category: bookEdit?.bookCategory,
        image: bookEdit?.bookImage,
        bookStatus: bookEdit?.bookStatus,
        author: bookEdit?.bookAuthor,
        publisher: bookEdit?.bookPublisher
      });
      setFileListPreview([{
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: bookEdit?.bookImage,
      }])
    }
  }, [bookEdit])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookList: any = await getListBookInit(option);
        console.log("bookList: ", bookList);
        setBooks(bookList);
      } catch (error) {
        console.error("Error fetching book list:", error);

        // Handle error
      }
    };
    fetchData();
  }, [])

  const onFinish = async (values: any) => {
    console.log("fileList[0]: ", fileList[0]);
    let formData = new FormData();
    if (fileList[0]) {

      formData.append('book.name', values.name);
      formData.append('book.category.name', values.category);
      formData.append('book.author.name', values.author);
      formData.append('book.publisher.name', values.publisher);
      formData.append('book.image', fileList[0] as RcFile ? fileList[0] as RcFile : '');
    } else {
      formData.append('book.name', values.name);
      formData.append('book.category.name', values.category);
      formData.append('book.author.name', values.author);
      formData.append('book.publisher.name', values.publisher);
      formData.append('book.image_url', 'https://salt.tikicdn.com/cache/400x400/ts/product/e2/32/b3/085ee546b06b792e847edd88b02b8f15.jpg.webp');
    }


    console.log('formData; ', formData);

    try {
      const res = await bookService.createBook(formData);
      console.log("res: ", res);

      notification.info({
        message: "Info",
        description: res.result,
      });
      // fetchBookList()
      onClose();
      setFileListPreview([])
    } catch (err: any) {
      console.log("err create: ", err.response);
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
    }
  };

  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
      setFileListPreview([])
    },
    beforeUpload: (file) => {
      setFileListPreview([{
        uid: '-xxx',
        percent: 50,
        name: 'image.png',
        status: 'done',
        url: URL.createObjectURL(file),
      }])

      setFileList([file]);
      return false;
    },
    fileList: fileListPreview,
  };

  useEffect(() => {
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
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1));
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const handleCancel = () => setPreviewOpen(false);

  // const handleChangeNameBook = (value: any) => {
  //   setBooksTemp([...books]) 
  // };

  const changeLink = async (value: string) => {
    try {
      const book: any = await getBookByLink({ remote_url: value });
      console.log("book: ", book);

      if (book) {
        formRef.current?.setFieldsValue({
          name: book?.book_name,
          category: book?.book_category_name,
          image: book?.book_image,
          author: book?.book_author_name,
          publisher: book?.book_publisher_name
        });
        setFileListPreview([{
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: book?.book_image,
        }])
      }


    } catch (error) {
      console.error("Error fetching book list:", error);

      // Handle error
    }

  }

  return (
    <Drawer
      size={'large'}
      title={title}
      onClose={() => {
        onClose();
        setFileListPreview([])
      }}
      open={open}
      bodyStyle={{ paddingBottom: 80 }}
      extra={
        <Space>
          <Button onClick={() => {
            onClose()
          }}>Cancel</Button>
          <Button onClick={() => form.submit()} type="primary">
            Save
          </Button>
        </Space>
      }
    >
      <Form layout="vertical" form={form} onFinish={onFinish} ref={formRef}>
        <Form.Item name="link" label="Link">
          <Tooltip title="You can select link book from Tiki or Fahasa " color={'#108ee9'}>
            <Search
              size="large"
              style={{ width: "100%" }}
              placeholder="Please enter link"
              onSearch={changeLink}
            // value={bookEdit?.category}
            />
          </Tooltip>
        </Form.Item>
        <Form.Item name="image" label="Cover" >
          <Upload
            accept="image/*"
            multiple={false}
            listType="picture-card"
            onPreview={handlePreview}
            {...props}
          >
            {/* {fileList.length >= 1 ? null : uploadButton} */}
            {uploadButton}
          </Upload>
          <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
            <img alt="example" style={{ width: "100%" }} src={previewImage} />
          </Modal>
        </Form.Item>

        <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter name" }]}>
          <Input
            style={{ width: "100%" }}
            placeholder="Please enter name"
            min={1}
          />

        </Form.Item>


        <Form.Item name="category" label="Category" rules={[{ required: true, message: "Please enter category" }]}>
          <Input
            style={{ width: "100%" }}
            placeholder="Please enter category"
          // value={bookEdit?.category}
          />
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

export default DawerBook;
