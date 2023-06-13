import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Form, Image, Input, Select } from 'antd';
import type { FormInstance } from 'antd/es/form';
import type { RangePickerProps } from 'antd/es/date-picker';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import dayjs from 'dayjs';

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
  const dateFormatList = ['DD/MM/YYYY'];
  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return current && current > dayjs().endOf('day');
  };

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);


  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || file.preview as string);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
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
    const formData = new FormData();
    formData.append('username', values.username);
    formData.append('studentId', values.studentId);
    formData.append('email', values.email);
    formData.append('phone', values.phone);
    formData.append('gender', values.gender);
    formData.append('birthDate', values.birthDate.format('YYYY-MM-DD'));
    if (values.profilePic) {
      formData.append('profilePic', values.profilePic);
    }
    formData.forEach((value, name) => {
      console.log(`Field: ${name}, Value: ${value}`);
    });
  };

  useEffect(() => {
    formRef.current?.setFieldsValue({
      username: "phdung",
      studentId: "SE05759",
      email: "phdung@gmail.com",
      phone: "09812312412",
      gender: "male",
      birthDate: dayjs("01/01/1998")
    });
  }, [])

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '70px'
    }}>
      <div style={{
        display: 'flex',
        padding: 30,
        borderRadius: 10,
        border: '1px solid rgba(0,0,0,0.2)',
        boxShadow: 'rgb(0 0 0 / 12%) 0px 5px 5px'
      }}>
        <div>
          <Image
            style={{ float: 'left' }}
            width={200}
            src="https://cdn.eduncle.com/library/scoop-files/2020/6/image_1593346767460.jpg"
          />
        </div>
        <Form
          {...layout}
          ref={formRef}
          name="control-ref"
          onFinish={onFinish}
          style={{ width: 600 }}
        >
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="studentId" label="Student ID" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone number" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
            <Select
              placeholder="Select your gender"
              allowClear
            >
              <Option value="male">male</Option>
              <Option value="female">female</Option>
              <Option value="other">other</Option>
            </Select>
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.gender !== currentValues.gender}
          >
            {({ getFieldValue }) =>
              getFieldValue('gender') === 'other' ? (
                <Form.Item name="customizeGender" label="Customize Gender">
                  <Input />
                </Form.Item>
              ) : null
            }
          </Form.Item>
          <Form.Item name="birthDate" label="Date of birth" rules={[{ required: true }]}>
            <DatePicker disabledDate={disabledDate} style={{ width: '100%' }} format={dateFormatList} />
          </Form.Item>
          <Form.Item name={"profilePic"} valuePropName="fileList">
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
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button style={{ marginLeft: '235px', marginRight: '10px' }} type="primary" htmlType="submit">
              Submit
            </Button>
            <Button htmlType="button">
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div >
  );
};

export default Personal;