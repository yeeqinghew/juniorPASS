import React from "react";
import {
  LockOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
  NumberOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Typography, Divider } from "antd";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";

const { Title, Text } = Typography;

const Register = ({ setAuth }) => {
  const handleGoogleLogin = async (values) => {
    console.log(values);
    const { clientId, credential } = values;
    if (credential) {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: credential,
          method: "gmail",
          userType: "parent",
        }),
      });
      const parseRes = await response.json();
      if (parseRes.token) {
        localStorage.setItem("token", parseRes.token);
        setAuth(true);
        toast.success("Register successfully");
      } else {
        setAuth(false);
        toast.error("Failed. Please try later");
      }
    }
  };

  const onRegister = async (values) => {
    try {
      const body = {
        ...values,
        userType: "parent",
        method: "normal",
      };
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();
      if (parseRes.token) {
        localStorage.setItem("token", { token: parseRes.token });
        setAuth(true);
        toast.success("Register successfully");
      } else {
        setAuth(false);
        toast.error("Failed. Please try later");
      }
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  const errorMessage = (error) => {
    console.log(error);
  };

  return (
    <div>
      <Toaster />
      <Title level={3}>Register</Title>
      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={errorMessage}
        theme="outline"
        width="290"
      />

      <Divider>OR</Divider>
      <Form
        name="register"
        className="register-form"
        style={{
          maxWidth: "300px",
        }}
        onFinish={onRegister}
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
          ]}
        >
          <Input
            prefix={<PhoneOutlined className="site-form-item-icon" />}
            placeholder="Phone Number"
            size={"large"}
          />
        </Form.Item>
        {/* verification code for phone */}
        {/* <Form.Item
          name="verifyCode"
          rules={[
            {
              required: true,
              message: "Please input verification code",
            },
          ]}
        >
          <Input
            prefix={<NumberOutlined className="site-form-item-icon" />}
            placeholder="Verification Code"
            size={"large"}
          />
        </Form.Item> */}
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
          <Text>Already have an account? </Text>
          <Link to="/login">Login</Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
