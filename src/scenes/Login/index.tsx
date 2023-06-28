import "../../index.css";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, notification, Typography } from "antd";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { AuthService } from "../../services/auth";
import { UserContext } from "@/context/UserContext";
import styled from "styled-components";
// import { useCookies } from "react-cookie";
// import { getTokenExpiration } from "@/helpers/TokenHelper";
const { Title } = Typography;
const StyledLoginPage = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-flow: row wrap;
  margin-top: -8px;
  width: calc(100% + 8px);
  margin-left: -8px;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
  > .login-page-container {
  }
`;
const StyledLoginForm = styled.div`
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
  height: 550px;
  > .login-form {
    min-width: 500px;
  }
  > .login-form-action {
    padding-top: 10px;
  }
`;
const StyledLoginAccessibility = styled.div`
  margin: -24px 16px 8px;
  padding: 16px;
  text-align: center;
  width: 90%;
  height: 40%;
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
    <StyledLoginPage>
      <div className="login-page-container">
        <StyledLoginForm>
          <StyledLoginAccessibility>
            <h1 className="title"> Book Over There</h1>
          </StyledLoginAccessibility>
          <Form
            layout="vertical"
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
          >
            {/* <Title
              onClick={() => {
                navigate("/");
              }}
              level={2}
              style={{ textAlign: "center" }}
            >
              Book Over There
            </Title> */}
            <Form.Item
              label="Username"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your Username!",
                },
              ]}
            >
              <Input size="large" prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
              ]}
            >
              <Input.Password
                size="large"
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

            <Form.Item className="login-form-action">
              <Button type="primary" htmlType="submit" className="login-form-button">
                Log in
              </Button>
              <div style={{ paddingTop: "10px" }}>
                Don't have an account?{" "}
                <a style={{ paddingLeft: "5px" }} href="/register">
                  {" "}
                  Register
                </a>
              </div>
            </Form.Item>
          </Form>
        </StyledLoginForm>
      </div>
    </StyledLoginPage>
  );
};

export default Login;
