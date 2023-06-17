import React from 'react'
import { Form, Input, Button, Checkbox, Typography, notification } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import "../../index.css"
import { AuthService } from '../../services/auth';

const { Title } = Typography;

const Login = () => {
    const navigate = useNavigate();
    // localStorage.setItem("access_token", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjg2OTA5MDkzLCJpYXQiOjE2ODY5MDU0OTMsImp0aSI6IjJlYjdjNTQxZDc0NTRkM2M5ZDYwNDQ5MGVhNWUwNmEwIiwidXNlcl9pZCI6MX0.Tn052OpOkGVXaS2S6BejuSW47zqSe0mAk9_euJOmykI');
    const onFinish = (values: any) => {
        AuthService.login(
            values.username,
            values.password,
            (token: any) => {
                var tokenn = token.data.access_token;
                localStorage.setItem("access_token", tokenn);
                navigate("/");
                notification.success({
                    message: "Login successfully!"
                });
            },
            (reason: any) => {
                notification.info({
                    message: "Something wrong. Please check your username & password"
                });
            },)
    };

    return (
        <div className='login-page'>
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
            >
                <Title level={2} style={{ textAlign: 'center' }}>Book Over There</Title>
                <Form.Item
                    name="username"
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
                    name="password"
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
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <a className="login-form-forgot" href="/">
                        Forgot password
                    </a>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Log in
                    </Button>
                    Or <a href="/register">register now!</a>
                </Form.Item>
            </Form>
        </div>
    );
}

export default Login