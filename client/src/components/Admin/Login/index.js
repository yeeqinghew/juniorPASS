import React from "react";
import { Image } from "antd";
import {
  LockOutlined,
  MailOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Typography } from "antd";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const AdminLogin = ({ setAuth }) => {
  const navigate = useNavigate();
  const handleLogin = async (values) => {
    try {
      const response = await fetch("http://localhost:5000/admin/login", {
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
        // to /admin/home
        navigate("/admin/home");
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

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          margin: "auto",
        }}
      >
        <div
          style={{
            width: "300px",
          }}
        >
          <Toaster />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              src={require("../../../images/logopngResize.png")}
              preview={false}
              style={{
                margin: 8,
                width: "auto",
              }}
            />
          </div>

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
            <Title
              level={3}
              style={{
                textAlign: "center",
              }}
            >
              Admin portal
            </Title>
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your usernmae!",
                },
              ]}
            >
              <Input
                prefix={<MailOutlined className="site-form-item-icon" />}
                placeholder="Username"
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
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
