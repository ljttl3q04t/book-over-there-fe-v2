import { Button, Checkbox, Form, Input, Typography, notification } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../store/userStore';
import { ThunkDispatch } from "@reduxjs/toolkit";

const { Title } = Typography;

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        var user = {
            username: values.username,
            password: values.password,
            number_phone: values.phone,
            email: values.email,
        }

        dispatch(registerUser(user))
            .then((res: any) => {
                console.log(res.data)
                notification.success({
                    message: "Register successfully",
                });
                navigate("/login")
            })
    };

    return (
        <div className='login-page'>
            <Form
                name="normal_login"
                className="login-form"
                layout="vertical"
                form={form}
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
                    label="E-mail"
                    rules={[
                        {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                        },

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
                        prefix={<PhoneOutlined className="site-form-item-icon" />}
                        placeholder="Phone"
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Password"
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Password!',
                        },
                    ]}
                >
                    <Input.Password prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password" />
                </Form.Item>
                <Form.Item
                    name="rePassword"
                    label="Re-enter password"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Password again!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The new password that you entered do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Re-enter password" />
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
                    Or <a href="/login">Login now!</a>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Register