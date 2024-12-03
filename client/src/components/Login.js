import React from "react";
import {
  LockOutlined,
  MailOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, Divider, Form, Input, Typography } from "antd";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import getBaseURL from "../utils/config";

const { Title, Text } = Typography;

const Login = ({ setAuth }) => {
  const baseURL = getBaseURL();
  const navigate = useNavigate();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: "/" } };

  const handleResponse = async (response, navigatePath) => {
    try {
      const parseRes = await response.json();

      if (response.ok && parseRes.token) {
        localStorage.setItem("token", parseRes.token);
        setAuth(true);
        toast.success("Login successfully");
        navigate(navigatePath);
      } else {
        setAuth(false);
        toast.error(parseRes.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Error parsing response:", error.message);
      toast.error("An error occurred while processing the response.");
    }
  };

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

  const handleGoogleLogin = async (values) => {
    try {
      const { clientId, credential, select_by } = values;
      if (credential) {
        const response = await fetch(`${baseURL}/auth/login/google`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            googleCredential: credential,
          }),
        });
        await handleResponse(response, from);
      }
    } catch (error) {
      console.error(error.message);
      toast.error("An error has occured during Google Login.");
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
      <Toaster />
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
              placeholder="Password"
              size={"large"}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              required
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <a className="login-form-forgot" href="" style={{ float: "right" }}>
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
          <Link to="/partner/login">
            <Text>Partner Login</Text>
          </Link>
        </div>
      </div>
    </section>
  );
};
export default Login;
