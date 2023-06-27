import "../../index.css";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, notification, Typography } from "antd";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { AuthService } from "../../services/auth";
import { UserContext } from "@/context/UserContext";
// import { useCookies } from "react-cookie";
// import { getTokenExpiration } from "@/helpers/TokenHelper";
const { Title } = Typography;

const Login = () => {
  // const [cookie, setCookie] = useCookies(["access_token", "refresh_token"]);

  const { setLoggedInUser } = useContext(UserContext);
  const navigate = useNavigate();

  // localStorage.setItem("access_token", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjg2OTA5MDkzLCJpYXQiOjE2ODY5MDU0OTMsImp0aSI6IjJlYjdjNTQxZDc0NTRkM2M5ZDYwNDQ5MGVhNWUwNmEwIiwidXNlcl9pZCI6MX0.Tn052OpOkGVXaS2S6BejuSW47zqSe0mAk9_euJOmykI');
  const onFinish = (values: any) => {
    AuthService.login(
      values.username,
      values.password,
      (token: any) => {
        console.log(token.data, " token.data");

        const tokenn = token.data.access_token;
        localStorage.setItem("access_token", tokenn);
        // const expirationTime = getTokenExpiration(token);
        // setCookie("access_token", tokenn, { path: "/", expires: expirationTime });
        navigate("/");
        notification.success({
          message: "Login successfully!",
        });
        localStorage.setItem("username", token.data.user.username);
        setLoggedInUser(token.data.user);
      },
      (_reason: any) => {
        notification.info({
          message: "Something wrong. Please check your username & password",
        });
      },
    );
  };

  return (
    <div className="login-page">
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Title
          onClick={() => {
            navigate("/");
          }}
          level={2}
          style={{ textAlign: "center" }}
        >
          Book Over There
        </Title>
        <Form.Item
          name="username"
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
          name="password"
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
};

export default Login;
