import { LockOutlined, MailOutlined, PhoneOutlined, UserOutlined, UserAddOutlined } from "@ant-design/icons";
import { Button, Form, Input, notification } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import UserService from "@/services/user";
import styled from "styled-components";
const StyledRegisterForm = styled.div`
  min-width: 600px;
  color: rgba(0, 0, 0, 0.87);
  transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-wrap: break-word;
  background-color: rgb(255, 255, 255);
  background-clip: border-box;
  border: 0px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.75rem;
  box-shadow: rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem;
  overflow: visible;
  justify-content: center;
  align-items: center;
  /* height: 60%; */
  > .register-form {
    padding: 20px;
    width: 100%;
  }
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
const StyledRegisterAccessibility = styled.div`
  margin: -24px 16px 8px;
  padding: 16px;
  text-align: center;
  width: 90%;
  height: 30%;
  opacity: 1;
  background: linear-gradient(195deg, rgb(73, 163, 241), rgb(26, 115, 232));
  color: rgb(52, 71, 103);
  border-radius: 0.75rem;
  box-shadow: rgba(0, 0, 0, 0.14) 0rem 0.25rem 1.25rem 0rem, rgba(0, 187, 212, 0.4) 0rem 0.4375rem 0.625rem -0.3125rem;
  margin-bottom: 70px;
  > .title {
    margin: 8px 0px 0px;
    font-size: 1.5rem;
    line-height: 1.375;
    font-family: Roboto, Helvetica, Arial, sans-serif;
    letter-spacing: 0.00735em;
    opacity: 1;
    text-transform: none;
    vertical-align: unset;
    text-decoration: none;
    color: rgb(255, 255, 255);
    font-weight: 600;
  }
`;
const Register = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const user = {
        username: values.username,
        password: values.password,
        phone_number: values.phone,
        email: values.email,
        full_name: values.full_name,
      };
      const message = await UserService.registerUser(user);
      notification.success({
        message: message,
        type: "success",
      });
      navigate("/login");
    } catch (err: any) {
      notification.error({
        message: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledRegisterPage>
      <StyledRegisterForm>
        <StyledRegisterAccessibility>
          <h1 className="title"> Welcome to Book Over There!</h1>
        </StyledRegisterAccessibility>
        <Form
          name="normal_login"
          className="register-form"
          layout="vertical"
          form={form}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
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
            name="full_name"
            label="Full Name"
            rules={[
              {
                required: true,
                message: "Please input your Full Name!",
              },
            ]}
          >
            <Input prefix={<UserAddOutlined className="site-form-item-icon" />} placeholder="Full Name" />
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
              {
                min: 6, // Minimum password length
                message: "Password must be at least 6 characters long!",
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
              <Button type="primary" htmlType="submit" className="login-form-button" loading={loading}>
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
