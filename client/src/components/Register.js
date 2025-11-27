import React, { useState } from "react";
import {
  LockOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
  UserAddOutlined,
  SafetyCertificateOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Typography, Divider, Card, Alert } from "antd";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import getBaseURL from "../utils/config";
import "../Login.css";

const { Title, Text } = Typography;

const Register = () => {
  const baseURL = getBaseURL();
  const [registerForm] = Form.useForm();
  const navigate = useNavigate();

  // UI State
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isEmailDuplicate, setIsEmailDuplicate] = useState(false);

  // Handle Form Submission
  const onNext = async (values) => {
    if (!isEmailValid) {
      toast.error("Please enter a valid email.");
      return;
    }

    setIsSendingOTP(true);
    try {
      const email = values.email;

      // API: Check if email is already registered
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

      // Navigate to OTP Screen with form values
      navigate("/verify-otp", { state: { email, ...values } });
    } catch (error) {
      toast.error("Failed to verify email. Please try again.");
    } finally {
      setIsSendingOTP(false);
    }
  };

  // Validate email format on change
  const onFormValuesChange = (changedValues) => {
    if (changedValues.email) {
      const email = changedValues.email;
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      setIsEmailValid(emailValid);
      setIsEmailDuplicate(false);
    }
  };

  return (
    <section className="register-page">
      <div className="register-container">
        <Card className="register-card" bordered={false}>
          {/* Header Section */}
          <div className="register-header">
            <div className="register-icon-wrapper">
              <UserAddOutlined className="register-icon" />
            </div>
            <Title level={2} className="register-title">
              Create Account
            </Title>
            <Text className="register-subtitle">
              Join JuniorPASS to explore amazing learning opportunities
            </Text>
          </div>

          {/* Info Box */}
          <div className="register-info-box">
            <SafetyCertificateOutlined style={{ marginRight: 8, color: '#98BDD2' }} />
            <Text className="register-info-text">
              <strong>Secure Registration:</strong> Your information is protected with industry-standard encryption
            </Text>
          </div>

          {/* Google Login */}
          <div className="google-login-wrapper">
            <GoogleLogin
              onSuccess={() => {}}
              onError={() => {}}
              theme="outline"
              size="large"
              width="100%"
              text="signup_with"
            />
          </div>

          <Divider className="register-divider">
            <Text className="divider-text">or register with email</Text>
          </Divider>

          {/* Registration Form */}
          <Form
            name="register"
            form={registerForm}
            className="register-form"
            onFinish={onNext}
            onValuesChange={onFormValuesChange}
            layout="vertical"
          >
            <Form.Item
              name="name"
              label={<Text strong>Full Name</Text>}
              rules={[
                { required: true, message: "Please enter your full name" },
                { min: 2, message: "Name must be at least 2 characters" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="input-icon" />}
                size="large"
                className="register-input"
              />
            </Form.Item>

            <Form.Item
              name="phoneNumber"
              label={<Text strong>Phone Number</Text>}
              rules={[
                { required: true, message: "Please enter your phone number" },
                {
                  pattern: /^[689]\d{7}$/,
                  message: "Please enter a valid Singapore phone number",
                },
              ]}
            >
              <Input
                prefix={<PhoneOutlined className="input-icon" />}
                size="large"
                className="register-input"
                maxLength={8}
              />
            </Form.Item>

            <Form.Item
              name="email"
              label={<Text strong>Email Address</Text>}
              rules={[
                { required: true, message: "Please enter your email address" },
                { type: "email", message: "Please enter a valid email address" },
              ]}
              help={isEmailDuplicate && "This email is already registered"}
              validateStatus={isEmailDuplicate ? "error" : ""}
            >
              <Input
                prefix={<MailOutlined className="input-icon" />}
                type="email"
                size="large"
                className="register-input"
              />
            </Form.Item>

            {isEmailDuplicate && (
              <Alert
                message="Email Already Registered"
                description={
                  <span>
                    This email is already in use. Please{" "}
                    <Link to="/login">login</Link> or use a different email.
                  </span>
                }
                type="error"
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}

            <Form.Item
              name="password"
              label={<Text strong>Password</Text>}
              rules={[
                { required: true, message: "Please create a password" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="input-icon" />}
                type="password"
                size="large"
                className="register-input"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label={<Text strong>Confirm Password</Text>}
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Passwords do not match")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="input-icon" />}
                type="password"
                size="large"
                className="register-input"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item className="submit-button-wrapper">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="register-submit-btn"
                loading={isSendingOTP}
                disabled={isSendingOTP || isEmailDuplicate}
                icon={<ArrowRightOutlined />}
              >
                Continue to Verification
              </Button>
            </Form.Item>
          </Form>

          {/* Footer Links */}
          <div className="register-footer">
            <Divider className="footer-divider" />
            <div className="footer-links">
              <Text className="footer-text">
                Already have an account?{" "}
                <Link to="/login" className="login-link">
                  Sign In
                </Link>
              </Text>
            </div>
            <div className="partner-login-wrapper">
              <Text className="partner-text">Are you a partner? </Text>
              <Link
                to="https://www.portal.juniorpass.sg"
                className="partner-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Partner Registration →
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Register;
