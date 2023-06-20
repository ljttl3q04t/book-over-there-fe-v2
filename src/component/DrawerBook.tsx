/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react/react-in-jsx-scope */
import { PlusOutlined } from "@ant-design/icons";
import { Button, Drawer, Form, FormInstance, Input, Modal, Select, Space, Upload, UploadFile, UploadProps } from 'antd'
import { RcFile } from 'antd/es/upload';
import { useEffect, useRef, useState, } from 'react'

const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

function DawerBook({ open, onSubmit, onClose }: any) {
    const [form] = Form.useForm();
    const formRef = useRef<FormInstance>(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const onFinish = (values: any) => {
        onClose();
        console.log(values);
        onSubmit(values);
    };

    useEffect(() => {
        if (open === false) {
            form.resetFields()
            setFileList([])
        }
    }, [form, open])


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
            formRef.current?.setFieldsValue({ cover: selectedFile });
        } else {
            formRef.current?.setFieldsValue({ cover: undefined });
        }
    };
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    const handleCancel = () => setPreviewOpen(false);
    return (
        <Drawer
            title="Add Book"
            onClose={onClose}
            open={open}
            bodyStyle={{ paddingBottom: 80 }}
            extra={
                <Space>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={() => form.submit()} type="primary">
                        Save
                    </Button>
                </Space>
            }
        >
            <Form layout="vertical" form={form} onFinish={onFinish} ref={formRef} >

                <Form.Item
                    name="cover"
                    label="Cover"
                    rules={[{ required: true, message: 'Please enter cover' }]}

                >

                    <Upload
                        accept="image/*"
                        listType="picture-card"
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

                <Form.Item
                    name="name"
                    label="Name"
                    rules={[{ required: true, message: 'Please enter name' }]}
                >
                    <Input
                        style={{ width: '100%' }}
                        placeholder="Please enter name"
                        min={1}
                    />
                </Form.Item>
                <Form.Item
                    name="bookStatus"
                    label="BookStatus"
                    rules={[{ required: true, message: 'Please select book status' }]}
                >
                    <Select
                        placeholder="Please enter book status"
                        allowClear
                        options={[
                            { value: 'jack', label: 'Jack' },
                            { value: 'lucy', label: 'Lucy' },
                            { value: 'Yiminghe', label: 'yiminghe' },
                            { value: 'disabled', label: 'Disabled' },
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    name="category"
                    label="Category"
                    rules={[{ required: true, message: 'Please enter category' }]}
                >
                    <Input
                        style={{ width: '100%' }}
                        placeholder="Please enter category"
                    />
                </Form.Item>
                <Form.Item
                    name="author"
                    label="Author"
                    rules={[{ required: true, message: 'Please enter author' }]}
                >
                    <Input
                        style={{ width: '100%' }}
                        placeholder="Please enter author"
                    />
                </Form.Item>
                <Form.Item
                    name="publisher"
                    label="Publisher"
                    rules={[{ required: true, message: 'Please enter publisher' }]}
                >
                    <Input
                        style={{ width: '100%' }}
                        placeholder="Please enter publisher"
                    />
                </Form.Item>
            </Form>
        </Drawer>
    )
}

export default DawerBook