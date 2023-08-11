import "../../index.css";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, notification } from "antd";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthService } from "../../services/auth";
import { UserContext } from "@/context/UserContext";
import styled from "styled-components";
import ResetPasswordModal from "@/component/ResetPasswordModal";
import { decodeJWT } from "@/helpers/fuctionHepler";
import userService from "@/services/user";
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
  const { setLoggedInUser, changeMembershipInfos, setCurrentClubId, setIsClubAdmin } = useContext(UserContext);
  const navigate = useNavigate();
  const [openResetPassword, setOpenResetPassword] = useState(false);

  const onFinish = async (values: any) => {
    AuthService.login(
      values.username,
      values.password,
      async (token: any) => {
        const tokenn = token.data.access_token;
        localStorage.setItem("access_token", tokenn);
        const { user_id } = decodeJWT(tokenn);
        token.data.user.user_id = user_id;
        const response: any = await userService.getUserMembership();
        if (response.data && response.data.length > 0) {
          const membershipInfos = response.data;
          changeMembershipInfos(membershipInfos);
          const _manageClubs = membershipInfos
            .filter((d: any) => !d.leaved_at && d.member_status === "active" && (d.is_staff || d.is_admin))
            .map((d: any) => {
              return {
                isStaff: d.is_staff,
                isClubAdmin: d.is_admin,
                clubId: d.book_club.id,
                clubName: d.book_club.name,
              };
            });
          if (_manageClubs.length > 0) setCurrentClubId(_manageClubs[0].clubId);
          setIsClubAdmin(membershipInfos.some((d: any) => d.is_admin && d.book_club.id === _manageClubs[0].clubId));
        }
        navigate("/");
        notification.success({
          message: "Login successfully!",
        });
        localStorage.setItem("username", token.data.user.username);
        setLoggedInUser(token.data.user);
      },
      () => {
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
            <h1 data-text="Book Over There" className="title">
              Read, Lead, Succeed
            </h1>
          </StyledLoginAccessibility>

          <ResetPasswordModal
            {...{
              open: openResetPassword,
              onCancel: () => {
                setOpenResetPassword(false);
              },
            }}
          />

          <Form
            layout="vertical"
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
          >
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

              <a className="login-form-forgot" onClick={() => setOpenResetPassword(true)}>
                Forgot password
              </a>
            </Form.Item>

            <Form.Item className="login-form-action">
              <Button type="primary" htmlType="submit" className="login-form-button">
                Log in
              </Button>
              <div style={{ paddingTop: "10px" }}>
                Don{"'"}t have an account?{" "}
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
