import React from "react";
import {
  LockOutlined,
  MailOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { Button, Divider, Form, Input, Typography } from "antd";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import getBaseURL from "../utils/config";
import useHandleLogin from "../hooks/useHandleLogin";
import CryptoJS from "crypto-js";

const { Title, Text } = Typography;

const Login = () => {
  const baseURL = getBaseURL();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: "/" } };
  const { handleResponse, handleGoogleLogin } = useHandleLogin({
    from,
  });

  const handleLogin = async (values) => {
    try {
      const { password } = values;
      const encryptedPassword = CryptoJS.SHA256(password).toString(
        CryptoJS.enc.Hex
      );
      const loginData = { ...values, password: encryptedPassword };

      const response = await fetch(`${baseURL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      await handleResponse(response, from);
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  const errorMessage = (error) => {
    console.error(error);
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
          gap: "15px",
        }}
      >
        <Title
          level={3}
          style={{
            textAlign: "center",
          }}
        >
          Welcome back
        </Title>
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={errorMessage}
          theme="outline"
          width="290"
        />
        <Divider>OR</Divider>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={handleLogin}
        >
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
              placeholder="email"
              type={"email"}
              size={"large"}
              required
            />
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
              placeholder="password"
              size={"large"}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              required
            />
          </Form.Item>
          <Form.Item style={{ textAlign: "center" }}>
            <a className="login-form-forgot" href="/forgot-password">
              Forgot password
            </a>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              style={{ width: "100%" }}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: "center" }}>
          Or <Link to="/register">register now!</Link>
          <Divider></Divider>
          <Link to="https://www.portal.juniorpass.sg">
            <Text>Partner Login</Text>
          </Link>
        </div>
      </div>
    </section>
  );
};
export default Login;
