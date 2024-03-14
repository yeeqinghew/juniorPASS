import { Image } from "antd";
import React from "react";
import {
  LockOutlined,
  MailOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Typography } from "antd";
import toast, { Toaster } from "react-hot-toast";

const { Title } = Typography;

const PartnerLogin = () => {
  const handleLogin = async (values) => {
    console.log("handleLogin");
  };

  return (
    <>
      <section
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          margin: "auto",
        }}
      >
        <Toaster />
        <div
          style={{
            width: "300px",
          }}
        >
          <Image
            src={require("../../../images/logopngResize.png")}
            preview={false}
            style={{
              margin: 24,
              textAlign: "center",
              width: "auto",
            }}
          />
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
                placeholder="Email"
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
              <Button
                type="primary"
                htmlType="submit"
                style={{ borderRadius: "0", width: "100%", margin: "12px 0" }}
              >
                Log in
              </Button>
              <a className="login-form-forgot" href="">
                Forgot password
              </a>
            </Form.Item>
          </Form>
        </div>
      </section>
    </>
  );
};

export default PartnerLogin;
