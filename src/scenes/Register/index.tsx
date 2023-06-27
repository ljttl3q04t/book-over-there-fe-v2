import { LockOutlined, MailOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, notification, Typography } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import UserService from "@/services/user";
import styled from "styled-components";
const { Title } = Typography;
const StyledRegisterForm = styled.div`
  border-radius: 12px;
  padding: 30px;
  background: #fff;
  width: 40%;
  margin-top: 70px;
`;
const StyledActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;
const StyledRegisterPage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  height: 100vh;
`;
const Register = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    const user = {
      username: values.username,
      password: values.password,
      phone_number: values.phone,
      email: values.email,
    };

    UserService.registerUser(user).then((res: any) => {
      if (res?.error?.message) {
        notification.info({
          message: "Info",
          description: res.payload.error || res.payload,
        });
        return;
      }
      notification.success({
        message: "Register successfully, please login to continue!",
        type: "success",
      });
      navigate("/login");
    });
  };

  return (
    <StyledRegisterPage>
      <StyledRegisterForm>
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
          <Title level={2} style={{ textAlign: "center" }}>
            Welcome to Book Over There
          </Title>
          <Form.Item
            name="username"
            label="Username"
            rules={[
              {
                required: true,
                message: "Please input your Username!",
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
                type: "email",
                message: "The input is not valid E-mail!",
              },

              {
                required: true,
                message: "Please input your Email!",
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
                message: "Please input your phone number!",
              },
            ]}
          >
            <Input prefix={<PhoneOutlined className="site-form-item-icon" />} placeholder="Phone" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item
            name="rePassword"
            label="Re-enter password"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please input your Password again!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("The new password that you entered do not match!"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Re-enter password"
            />
          </Form.Item>
          <Form.Item>
            <a className="login-form-forgot" href="/">
              Forgot password
            </a>
          </Form.Item>

          <Form.Item>
            <StyledActionGroup>
              {" "}
              <Button type="primary" htmlType="submit" className="login-form-button">
                Register
              </Button>
              <span>Or </span>
              <a href="/login">Login</a>
            </StyledActionGroup>
          </Form.Item>
        </Form>
      </StyledRegisterForm>
    </StyledRegisterPage>
  );
};

export default Register;
