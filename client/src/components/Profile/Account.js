import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Space,
  Typography,
  Upload,
  message,
} from "antd";
import {
  EditOutlined,
  SaveOutlined,
  UserOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { useUserContext } from "../UserContext";
import toast from "react-hot-toast";
import getBaseURL from "../../utils/config";
import "./Account.css";

const { Title, Text } = Typography;

const Account = () => {
  const { user, setUser } = useUserContext();
  const baseURL = getBaseURL();
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        phone: user.phone_number || "",
      });
    }
  }, [user, form]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      phone: user.phone_number || "",
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const response = await fetch(`${baseURL}/users/${user.user_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const parseRes = await response.json();

      if (response.ok) {
        setUser({ ...user, ...values });
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      } else {
        toast.error(parseRes.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (info) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="account-page">
      {/* Header Section */}
      <div className="account-header">
        <Title level={3} className="account-title">
          <UserOutlined /> My Account
        </Title>
        <Text className="account-subtitle">
          Manage your profile information and account settings
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* Profile Picture Section */}
        <Col xs={24} md={8}>
          <Card className="profile-card" bordered={false}>
            <Avatar
              size={120}
              src={user?.display_picture}
              icon={<UserOutlined />}
              className="profile-avatar"
            />
            <Title level={5} className="profile-name">
              {user?.name || "User"}
            </Title>
            <Text className="profile-email">{user?.email}</Text>

            <div className="profile-badge">
              <CheckCircleOutlined />
              Active Account
            </div>

            <Upload
              name="avatar"
              showUploadList={false}
              action={`${baseURL}/upload/avatar`}
              onChange={handleAvatarUpload}
              disabled={!isEditing}
            >
              <Button
                icon={<UploadOutlined />}
                disabled={!isEditing}
                size="small"
                className="upload-button"
              >
                {isEditing ? "Change Photo" : "Photo"}
              </Button>
            </Upload>

            {/* Quick Stats */}
            <div
              className="stats-grid"
              style={{ marginTop: 24, width: "100%" }}
            >
              <div className="stat-item">
                <span className="stat-item-value primary">
                  {user?.credit || 0}
                </span>
                <span className="stat-item-label">Credits</span>
              </div>
              <div className="stat-item">
                <span className="stat-item-value success">
                  {user?.children_count || 0}
                </span>
                <span className="stat-item-label">Children</span>
              </div>
              <div className="stat-item">
                <span className="stat-item-value info">
                  {user?.bookings_count || 0}
                </span>
                <span className="stat-item-label">Bookings</span>
              </div>
            </div>
          </Card>
        </Col>

        {/* User Information Section */}
        <Col xs={24} md={16}>
          <Card
            className="info-card"
            title="Personal Information"
            bordered={false}
            extra={
              <Space className="action-buttons">
                {!isEditing ? (
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={handleEdit}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button
                      type="primary"
                      icon={<SaveOutlined />}
                      loading={loading}
                      onClick={handleSave}
                    >
                      Save Changes
                    </Button>
                  </>
                )}
              </Space>
            }
          >
            <Form
              form={form}
              layout="vertical"
              disabled={!isEditing}
              className="account-form"
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="name"
                    label="Full Name"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your full name",
                      },
                      { min: 2, message: "Name must be at least 2 characters" },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="Enter your full name"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="email"
                    label="Email Address"
                    rules={[
                      { required: true, message: "Please enter your email" },
                      { type: "email", message: "Please enter a valid email" },
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined />}
                      placeholder="Enter your email address"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="phone"
                    label="Phone Number"
                    rules={[
                      {
                        pattern: /^[0-9+\-\s()]*$/,
                        message: "Please enter a valid phone number",
                      },
                    ]}
                  >
                    <Input
                      prefix={<PhoneOutlined />}
                      placeholder="Enter your phone number"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>

            {/* Account Details */}
            <div style={{ marginTop: 24 }}>
              <Text strong style={{ marginBottom: 12, display: "block" }}>
                Account Details
              </Text>
              <div className="detail-row">
                <span className="detail-label">
                  <IdcardOutlined style={{ marginRight: 8 }} />
                  User ID
                </span>
                <span className="detail-value">{user?.user_id || "N/A"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">
                  <CheckCircleOutlined style={{ marginRight: 8 }} />
                  Account Status
                </span>
                <span className="detail-value active">Active</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">
                  <CalendarOutlined style={{ marginRight: 8 }} />
                  Member Since
                </span>
                <span className="detail-value">
                  {formatDate(user?.created_on)}
                </span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Security Section */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24}>
          <Card
            className="security-card"
            title={
              <Space>
                <LockOutlined />
                Security
              </Space>
            }
            bordered={false}
          >
            <div className="security-item">
              <div className="security-item-info">
                <span className="security-item-title">Password</span>
                <span className="security-item-desc">Last changed: Never</span>
              </div>
              <Button type="default">Change Password</Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Account;
