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
      const response = await fetch(`${baseURL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
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
          style={{
            maxWidth: "300px",
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
            <a className="login-form-forgot" href="">
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
          <Link href="www.portal.juniorpass.sg">
            <Text>Partner Login</Text>
          </Link>
        </div>
      </div>
    </section>
  );
};
export default Login;
