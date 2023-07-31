import BreadcrumbNav from "@/component/BreadcrumbNav";
import { UserContext } from "@/context/UserContext";
import { validatePhoneNumber } from "@/helpers/fuctionHepler";
import userService from "@/services/user";
import { CheckCircleOutlined, PhoneOutlined, ProfileOutlined, UserAddOutlined, UserOutlined } from "@ant-design/icons";
import type { FormInstance, MenuProps } from "antd";
import { Button, Dropdown, Form, Image, Input, Modal, Select, Space, Tag, notification } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const StyledNavBar = styled.div`
  padding: 10px 20px 10px 0;
  margin-bottom: 0px;
  background: rgb(255, 255, 255);
  margin: 1rem 1rem 1rem 0;
  border-radius: 0.75rem;
  /* border-bottom: 2px; */
  box-shadow: rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem;
  display: flex;
  justify-content: space-between;
`;
const StyledActionLog = styled.div`
  display: flex;
  gap: 8px;
`;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

const Navbar = () => {
  const access = localStorage.getItem("access_token");
  const navigate = useNavigate();
  const [changePW, setChangePW] = useState(false);
  const { user, logoutUser, language, changeLanguage, setLoggedInUser } = useContext(UserContext);
  const { t, i18n } = useTranslation();
  const [openVerify, setOpenVerify] = useState(false);
  const [sentOTP, setSentOTP] = useState(false);
  const [countdown, setCountdown] = useState(300);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  const formRef = useRef<FormInstance>(form);

  const handleSendOtp = async () => {
    try {
      setLoading(true);
      const message = await userService.sendOTP();
      notification.success({ message: message, type: "success" });
      setSentOTP(true);
      setCountdown(300);
    } catch (error: any) {
      const errorMessage = t(error.message || "An error occurred") as string;
      notification.error({ message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitVerify = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const message = await userService.verifyOTP(values.otp_code);
      notification.success({ message: message, type: "success" });
      if (user) {
        setLoggedInUser({ ...user, is_verify: true });
      }
      setOpenVerify(false);
    } catch (error: any) {
      if (error.values === undefined) {
        const errorMessage = t(error.message || "An error occurred") as string;
        notification.error({ message: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer: any;
    if (sentOTP && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }

    return () => {
      clearTimeout(timer);
      if (sentOTP && countdown === 0) {
        setSentOTP(false);
        setCountdown(2);
      }
    };
  }, [sentOTP, countdown]);

  const handleVerify = () => {
    setOpenVerify(true);
  };

  const handleLogout = () => {
    logoutUser();
    localStorage.clear();
    navigate("/");
  };

  const items: MenuProps["items"] = [
    {
      label: t("Logout") as string,
      key: "2",
      onClick: handleLogout,
    },
  ];

  const handleChangeLanguage = (e: any) => {
    const language = e;
    i18n.changeLanguage(language);
    changeLanguage(language);
  };

  return (
    <StyledNavBar>
      <BreadcrumbNav displayPageName={false} />
      <div style={{ float: "right", display: "flex", alignItems: "center" }}>
        {access !== null &&
          (user?.is_verify ? (
            <Tag icon={<CheckCircleOutlined />} color="success">
              {t("Verified") as string}
            </Tag>
          ) : (
            <Button type="link" onClick={handleVerify}>
              {t("Verify") as string}
            </Button>
          ))}
        <Select
          value={language}
          style={{ width: 120, marginRight: 8, marginLeft: 8 }}
          onChange={handleChangeLanguage}
          options={[
            { value: "vi", label: t("common.vietnames") },
            { value: "en", label: t("common.english") },
          ]}
        />
        {access !== null ? (
          <>
            <Image
              style={{
                float: "left",
                border: "1px solid #fff",
                borderRadius: "50%",
              }}
              width={25}
              preview={false}
              src={user && user.avatar}
            />
            <Dropdown menu={{ items }} placement="bottomRight" trigger={["click"]} arrow>
              <a onClick={(e) => e.preventDefault()}>
                <Space
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginLeft: 5,
                  }}
                >
                  {user && user.username}!
                  <ProfileOutlined />
                </Space>
              </a>
            </Dropdown>
            <Modal open={changePW} onCancel={() => setChangePW(false)}></Modal>
          </>
        ) : (
          <StyledActionLog>
            <Button
              icon={<UserOutlined />}
              type="primary"
              onClick={(e) => {
                e.preventDefault();
                navigate("/login");
              }}
            >
              <Space
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginLeft: 5,
                }}
              >
                {t("Login") as string}
              </Space>
            </Button>
            <Button
              icon={<UserAddOutlined />}
              onClick={(e) => {
                e.preventDefault();
                navigate("/register");
              }}
            >
              <Space
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginLeft: 5,
                }}
              >
                {t("Register") as string}
              </Space>
            </Button>
          </StyledActionLog>
        )}
      </div>
      <Modal
        title={t("Verify Phone Number") as string}
        open={openVerify}
        onCancel={() => {
          setOpenVerify(false);
        }}
        onOk={handleSubmitVerify}
        cancelText={t("Cancel") as string}
        okText={t("Submit") as string}
        width={800}
        centered
        maskClosable={false}
        confirmLoading={loading}
      >
        <Form {...layout} form={form} ref={formRef} name="control-ref" style={{ width: 800 }}>
          <Form.Item
            name="phone_number"
            label={t("Phone Number") as string}
            rules={[{ required: true, validator: validatePhoneNumber }]}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Input value={user?.phone_number} disabled prefix={<PhoneOutlined className="site-form-item-icon" />} />
              <div style={{ marginLeft: 10 }}>
                {sentOTP && countdown > 0 ? (
                  <Button type="link" loading={sentOTP && countdown > 0}>
                    {`${t("Resend OTP in") as string} ${countdown} ${t("seconds") as string}`}
                  </Button>
                ) : (
                  <Button type="link" onClick={handleSendOtp} loading={loading}>
                    {t("Send OTP") as string}
                  </Button>
                )}
              </div>
            </div>
          </Form.Item>
          <Form.Item name="otp_code" label={t("OTP Code") as string} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </StyledNavBar>
  );
};

export default Navbar;
