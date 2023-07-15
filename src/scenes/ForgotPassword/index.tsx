import { LockOutlined } from "@ant-design/icons";
import { Button, Form, Input, notification } from "antd";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import userService from "@/services/user";
const StyledForgotPasswordForm = styled.div`
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
const StyledForgotPasswordPage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  height: 100vh;
`;
const StyledForgotPasswordAccessibility = styled.div`
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
const ForgotPassword = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setIsSubmitting(true);
      const data = {
        uid: uid ?? "",
        token: token ?? "",
        newPassword: values.password,
      };
      const message = await userService.updatePassword(data);
      notification.success({ message: message, type: "success" });
      navigate("/login");
    } catch (err:any) {
      notification.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StyledForgotPasswordPage>
      <StyledForgotPasswordForm>
        <StyledForgotPasswordAccessibility>
          <h1 className="title"> Change password!</h1>
        </StyledForgotPasswordAccessibility>
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
            <StyledActionGroup>
              {" "}
              <Button type="primary" htmlType="submit" className="login-form-button" loading={isSubmitting}>
                Submit
              </Button>
            </StyledActionGroup>
          </Form.Item>
        </Form>
      </StyledForgotPasswordForm>
    </StyledForgotPasswordPage>
  );
};

export default ForgotPassword;
