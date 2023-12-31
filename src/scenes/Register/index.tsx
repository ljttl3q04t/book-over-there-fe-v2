import { Button, Checkbox, Form, Input, Typography, notification } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined,PhoneOutlined } from '@ant-design/icons';
import React from 'react'
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Register = () => {
    const navigate = useNavigate();
    const onFinish = (values: any) => {
        navigate('/login');
        notification.success({
            message: "Register successfully. Please login to you account"
        })
    };

    return (
        <div className='login-page'>
            <Form
                name="normal_login"
                className="login-form"
                layout="vertical"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
            >
                <Title level={2} style={{ textAlign: 'center' }}>Welcome to Book Over There</Title>
                <Form.Item
                    name="username"
                    label="Username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Username!',
                        },
                    ]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Email!',
                        },
                    ]}
                >
                    <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
                </Form.Item>
                <Form.Item
                    name="phone"
                    label="Phone"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your phone number!',
                        },
                    ]}
                >
                    <Input
                        prefix={<PhoneOutlined  className="site-form-item-icon" />}
                        placeholder="Phone"
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Password!',
                        },
                    ]}
                >
                    <Input.Password prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"/>
                </Form.Item>
                <Form.Item
                    name="rePassword"
                    label="Re-enter password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Password again!',
                        },
                    ]}
                >
                    <Input.Password prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Re-enter password"/>
                </Form.Item>
                <Form.Item>
                    <a className="login-form-forgot" href="/">
                        Forgot password
                    </a>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Register
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Register