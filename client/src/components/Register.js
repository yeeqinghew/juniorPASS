import React, { useState } from "react";
import {
  LockOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Typography, Divider } from "antd";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import getBaseURL from "../utils/config";
import useHandleLogin from "../hooks/useHandleLogin";
import { useUserContext } from "./UserContext";

const { Title, Text } = Typography;

const Register = () => {
  const baseURL = getBaseURL();
  const [registerForm] = Form.useForm();
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const { from } = { from: { pathname: "/" } };
  const { handleGoogleLogin } = useHandleLogin({ from });
  const { setAuth } = useUserContext();
  const onRegister = async (values) => {
    try {
      const response = await fetch(`${baseURL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const parseRes = await response.json();
      if (parseRes.token) {
        localStorage.setItem("token", parseRes.token);
        setAuth(true);
        toast.success("Register successfully");
      } else {
        setAuth(false);
        toast.error(parseRes.message);
      }
    } catch (error) {
      setAuth(false);
      console.error(error.message);
      toast.error(error.message);
    }
  };

  const errorMessage = (error) => {
    console.error(error);
  };

  // Handler to track phone number validation status
  const onFormValuesChange = (changedValues) => {
    if (changedValues.phoneNumber) {
      const phoneNumber = changedValues.phoneNumber;
      // Validate the phone number format
      const phoneValid = /^[689]\d{7}$/.test(phoneNumber);
      setIsPhoneValid(phoneValid);
    }
  };

  const handleSendOTP = () => {
    setIsSendingOTP(true);
    try {
      // Simulate OTP sending process (e.g., using Twilio or other services)
      setOtpSent(true);
      toast.success("OTP sent successfully");
    } catch (error) {
      setOtpSent(false);
      console.error("Failed to send OTP. Please try again.");
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsSendingOTP(false);
    }
  };

  return (
    <section
      style={{
        padding: "0 140px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "22.2rem",
          border: "1px solid hsla(0, 0%, 65%, 0.158)",
          boxShadow: "0 0 36px 1px rgba(0, 0, 0, 0.2)",
          borderRadius: "25px",
          backdropFilter: "blur(20px)",
          zIndex: "99",
          padding: "2rem",
        }}
      >
        <Title level={3} style={{ textAlign: "center" }}>
          Register
        </Title>
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={errorMessage}
          theme="outline"
          width="290"
        />

        <Divider>OR</Divider>
        <Form
          name="register"
          form={registerForm}
          className="register-form"
          style={{
            maxWidth: "300px",
          }}
          onFinish={onRegister}
          onValuesChange={onFormValuesChange}
        >
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your name!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Name"
              size={"large"}
            />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            rules={[
              {
                required: true,
                message: "Please input your phone number!",
              },
              {
                pattern: /^[689]\d{7}$/,
                message: "Phone number is in an invalid format!",
              },
            ]}
          >
            <Input
              prefix={<PhoneOutlined className="site-form-item-icon" />}
              placeholder="Phone Number"
              size={"large"}
            />
          </Form.Item>

          <Form.Item
            name="otp"
            // TODO: rules={[{ required: true, message: "Please enter the OTP!" }]}
          >
            <Input.Group compact>
              <Input
                style={{ width: "65%" }}
                placeholder="Enter the OTP"
                disabled={!otpSent}
              />
              <Button
                type="primary"
                onClick={handleSendOTP}
                disabled={otpSent || !isPhoneValid || isSendingOTP} // Disable if OTP sent, phone invalid, or OTP sending
                loading={isSendingOTP}
                style={{ width: "35%" }}
              >
                {isSendingOTP ? "Sending OTP..." : "Send OTP"}
              </Button>
            </Input.Group>
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              type={"email"}
              placeholder="Email"
              size={"large"}
              required
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type={"password"}
              placeholder="Password"
              size={"large"}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              required
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              style={{ width: "100%" }}
            >
              Register
            </Button>
            <div
              style={{
                textAlign: "center",
              }}
            >
              <Text>Already have an account? </Text>
              <Link to="/login">Login</Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};

export default Register;
