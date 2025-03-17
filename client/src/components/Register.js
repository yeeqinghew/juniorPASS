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
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import getBaseURL from "../utils/config";

const { Title, Text } = Typography;

const Register = () => {
  const baseURL = getBaseURL();
  const [registerForm] = Form.useForm();
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isEmailDuplicate, setIsEmailDuplicate] = useState(false);
  const navigate = useNavigate();

  const onNext = async (values) => {
    if (!isEmailValid) {
      toast.error("Please enter a valid email.");
      return;
    }

    setIsSendingOTP(true);
    try {
      const email = values.email;

      // Check if email is already registered
      const checkEmailResponse = await fetch(`${baseURL}/auth/check-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const checkEmailData = await checkEmailResponse.json();

      if (!checkEmailResponse.ok || !checkEmailData.available) {
        setIsEmailDuplicate(true);
        setIsSendingOTP(false);
        toast.error(
          checkEmailData.message || "This email is already registered."
        );
        return;
      }

      setIsEmailDuplicate(false);

      // Send OTP
      const sendOTPResponse = await fetch(`${baseURL}/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const parseRes = await sendOTPResponse.json();
      if (sendOTPResponse.ok) {
        toast.success(parseRes.message || "OTP sent successfully");
        navigate("/verify-otp", { state: { email, ...values } });
      } else {
        throw new Error(
          parseRes.message || "Failed to send OTP. Please try again."
        );
      }
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsSendingOTP(false);
    }
  };

  const onFormValuesChange = (changedValues) => {
    if (changedValues.email) {
      const email = changedValues.email;
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      setIsEmailValid(emailValid);
      setIsEmailDuplicate(false);
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
          padding: "30px 40px",
          borderRadius: "10px",
          maxWidth: "600px",
          margin: "50px auto",
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <Title level={3} style={{ textAlign: "center" }}>
          Register
        </Title>
        <GoogleLogin
          onSuccess={() => {}}
          onError={() => {}}
          theme="outline"
          width="290"
        />

        <Divider>OR</Divider>

        <Form
          name="register"
          form={registerForm}
          className="register-form"
          style={{ maxWidth: "100%", margin: "0 auto", width: "290px" }} // width same as Google sign-in
          onFinish={onNext}
          onValuesChange={onFormValuesChange}
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Name" size="large" />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            rules={[
              { required: true, message: "Please input your phone number!" },
              {
                pattern: /^[689]\d{7}$/,
                message: "Phone number is in an invalid format!",
              },
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="Phone Number"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
            help={isEmailDuplicate && "This email is already registered."}
            validateStatus={isEmailDuplicate ? "error" : ""}
          >
            <Input
              prefix={<MailOutlined />}
              type="email"
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
              size="large"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The passwords do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Confirm Password"
              size="large"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="next-button"
              style={{ width: "100%" }}
              loading={isSendingOTP}
              disabled={isSendingOTP || isEmailDuplicate}
            >
              Next
            </Button>
            <div style={{ textAlign: "center" }}>
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
