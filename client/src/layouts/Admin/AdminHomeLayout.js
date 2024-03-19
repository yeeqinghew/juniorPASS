import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme, Image } from "antd";
const { Header, Sider, Content } = Layout;

const AdminHomeLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout
      hasSider={true}
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
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

      <Layout>
        <Header
          style={{
            padding: 0,
            display: "flex",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />

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
          Content
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminHomeLayout;
