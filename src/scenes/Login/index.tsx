import "../../index.css";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Modal, notification, Typography } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthService } from "../../services/auth";
import { UserContext } from "@/context/UserContext";
import styled from "styled-components";
import { FormInstance } from "antd/lib/form/Form";
import userService from "@/services/user";
import { log } from "console";
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
  margin: -24px 16px 8px 10%;
  padding: 16px;
  text-align: center;
  width: 100%;
  height: 30%;
  opacity: 1;
  background: linear-gradient(195deg, rgb(73, 163, 241), rgb(26, 115, 232));
  color: rgb(52, 71, 103);
  border-radius: 0.75rem;
  box-shadow: rgba(0, 0, 0, 0.14) 0rem 0.25rem 1.25rem 0rem, rgba(0, 187, 212, 0.4) 0rem 0.4375rem 0.625rem -0.3125rem;
  margin-bottom: 70px;
  > .title {
    font-family: "Titillium Web", sans-serif;
    font-weight: 700;
    font-size: 30px;
    letter-spacing: 0.1em;
    display: grid;
    place-items: center;
    grid-template-areas: "text";
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
    background-image: linear-gradient(
      90deg,
      rgba(255, 255, 255, 1) 0%,
      rgba(255, 255, 255, 1) 35%,
      rgba(255, 255, 255, 1) 100%
    );
    margin: 0;

    & > *,
    &::after {
      grid-area: text;
    }

    &::after {
      font-size: 48px;
      content: attr(data-text);
      transform: translate(0.1em, 0.1em);
      filter: drop-shadow(0.015em 0.015em 0.025em var(--shadow));
      -webkit-background-clip: text;
      color: transparent;
      background-image: linear-gradient(
        90deg,
        rgba(255, 255, 255, 1) 0%,
        rgba(255, 255, 255, 1) 35%,
        rgba(255, 255, 255, 1) 100%
      );
    }
  }
`;
const Login = () => {
  // const [cookie, setCookie] = useCookies(["access_token", "refresh_token"]);

  const { setLoggedInUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [modalJoin, setModalJoin] = useState(false);
  const formRef = React.useRef<FormInstance>(null);

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

  const handleCloseModal = () => {
    formRef.current?.resetFields();
    setModalJoin(false);
  };

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  const onFinishSentMail = (_values: any) => {
    formRef.current
      ?.validateFields()
      .then(async (formValues) => {
        const data = {
          username_or_email: formValues.userNameOrEmail
        };
        try {
          const response: any = await userService.passwordReset(data)
          notification.info({ message: response.data.message });
        } catch (error) {
          notification.error({ message: "System error" });
        }
      })
      .catch((_errors) => {
        notification.info({ message: "Please make sure that you enter all field" });
      });
  };

  return (
    <StyledLoginPage>
      <div className="login-page-container">
        <StyledLoginForm>
          <StyledLoginAccessibility>
            <h1 data-text="Book Over There" className="title">
              Read, Lead, Succeed
            </h1>
          </StyledLoginAccessibility>

          <Modal
            style={{}}
            title="Forgot Password"
            width={800}
            open={modalJoin}
            onCancel={handleCloseModal}
            onOk={onFinishSentMail}
          // okButtonProps={{ disabled: loading }}
          >
            <Form {...layout} ref={formRef} name="control-ref" style={{ width: 800 }}>
              <Form.Item name="userNameOrEmail" label="Usernam or mail" rules={[{ required: true }]}>
                <Input size="large" prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username or mail" />
              </Form.Item>
            </Form>

          </Modal>

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

              <a className="login-form-forgot" onClick={() => setModalJoin(true)}>
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
