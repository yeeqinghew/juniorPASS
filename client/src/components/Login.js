import React from "react";
import {
  LockOutlined,
  MailOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, Divider, Form, Input, Typography } from "antd";
import { GoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const { Title, Text } = Typography;

const Login = ({ setAuth }) => {
  const baseURL =
    process.env.NODE_ENV === "production"
      ? "auth/login"
      : "http://localhost:5000/auth/login";

  const handleLogin = async (values) => {
    try {
      const response = await fetch(baseURL, {
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
        toast.success("Login successfully");
      } else {
        setAuth(false);
        toast.error("Wrong credential");
      }
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  const handleGoogleLogin = async (values) => {
    console.log(values);
    const { clientId, credential } = values;
    if (credential) {
      // const response = await fetch("http://localhost:5000/auth/login", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     token: credential,
      //     method: "gmail",
      //   }),
      // });
      // const parseRes = await response.json();
      // console.log("parseRes", parseRes);
      // save to DB with available data if this is not found in DB
      //
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
