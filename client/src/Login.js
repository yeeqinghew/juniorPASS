import React, { useEffect } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Divider, Form, Input, Typography } from "antd";
import { GoogleLogin } from "@react-oauth/google";

const { Text, Title } = Typography;

const Login = () => {
  useEffect(() => {
    console.log("pricess", process.env.REACT_APP_GOOGLE_CLIENT_ID);
  }, []);
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const googleButtonHandle = () => {};

  const responseMessage = (response) => {
    console.log(response);
  };
  const errorMessage = (error) => {
    console.log(error);
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
        <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
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
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your Username!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
              size={"large"}
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
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
              size={"large"}
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
            Or <a href="">register now!</a>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};
export default Login;
