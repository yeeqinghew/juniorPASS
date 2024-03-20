import React from "react";
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Image, Divider } from "antd";
import { Outlet } from "react-router-dom";
const { Header, Sider, Content } = Layout;

const AdminHomeLayout = () => {
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          width: "200px",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            margin: 24,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            src={require("../../images/logopngResize.png")}
            preview={false}
            width={100}
          />
        </div>
        <Divider />

        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <UserOutlined />,
              label: "users",
              children: [
                {
                  key: "2",
                  label: "parents",
                },
                {
                  key: "3",
                  label: "children",
                },
              ],
            },
            {
              key: "4",
              icon: <VideoCameraOutlined />,
              label: "partners",
            },
            {
              key: "5",
              icon: <UploadOutlined />,
              label: "transactions",
            },
          ]}
          style={{
            flex: 1,
            minWidth: 0,
            hegith: "100vh",
          }}
        />
      </Sider>

      <Layout
        style={{
          marginLeft: 200,
        }}
      >
        <Header
          style={{
            padding: 0,
            display: "flex",
          }}
        >
          <Menu
            mode="horizontal"
            style={{ flex: 1, minWidth: 0, display: "block" }}
          >
            <Menu.Item key="logout" style={{ float: "right" }}>
              <LogoutOutlined
                onClick={() => {
                  // handle Logout
                }}
              />
            </Menu.Item>
            <Menu.Item
              key="notification"
              style={{ float: "right" }}
              onClick={() => {
                // TODO: Popover antd to show a list of notifcations
              }}
            >
              {/* TODO: <Badge> */}
              <i className="fa fa-bell-o"></i>
            </Menu.Item>
          </Menu>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: "white",
            borderRadius: "25px",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminHomeLayout;
