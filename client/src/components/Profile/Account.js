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
  Divider,
} from "antd";
import { EditOutlined, SaveOutlined, UserOutlined, UploadOutlined } from "@ant-design/icons";
import { useUserContext } from "../UserContext";
import toast from "react-hot-toast";
import getBaseURL from "../../utils/config";

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
        phone: user.phone || '',
        address: user.address || '',
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
      phone: user.phone || '',
      address: user.address || '',
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
    // This would handle avatar upload
    // Implementation depends on your file upload setup
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  return (
    <div>
      <Title level={4}>Account Information</Title>
      
      <Row gutter={[24, 24]}>
        {/* Profile Picture Section */}
        <Col xs={24} md={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <Avatar
                size={120}
                src={user?.display_picture}
                icon={<UserOutlined />}
                style={{ marginBottom: 16 }}
              />
              <br />
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
                >
                  {isEditing ? 'Change Photo' : 'Photo'}
                </Button>
              </Upload>
            </div>
          </Card>
        </Col>

        {/* User Information Section */}
        <Col xs={24} md={16}>
          <Card
            title="Personal Information"
            extra={
              <Space>
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
                    <Button onClick={handleCancel}>
                      Cancel
                    </Button>
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
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="name"
                    label="Full Name"
                    rules={[
                      { required: true, message: 'Please enter your full name' },
                      { min: 2, message: 'Name must be at least 2 characters' }
                    ]}
                  >
                    <Input placeholder="Enter your full name" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="email"
                    label="Email Address"
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Please enter a valid email' }
                    ]}
                  >
                    <Input placeholder="Enter your email address" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="phone"
                    label="Phone Number"
                    rules={[
                      { pattern: /^[0-9+\-\s()]*$/, message: 'Please enter a valid phone number' }
                    ]}
                  >
                    <Input placeholder="Enter your phone number" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="address"
                    label="Address"
                  >
                    <Input placeholder="Enter your address" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* Account Details */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24}>
          <Card title="Account Details">
            <Row gutter={16}>
              <Col xs={24} sm={8}>
                <Text strong>User ID:</Text>
                <br />
                <Text type="secondary">{user?.user_id}</Text>
              </Col>
              <Col xs={24} sm={8}>
                <Text strong>Account Status:</Text>
                <br />
                <Text style={{ color: '#52c41a' }}>Active</Text>
              </Col>
              <Col xs={24} sm={8}>
                <Text strong>Member Since:</Text>
                <br />
                <Text type="secondary">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </Text>
              </Col>
            </Row>
            
            <Divider />
            
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Text strong>Current Credit Balance:</Text>
                <br />
                <Text style={{ fontSize: '18px', color: '#1890ff' }}>
                  ${user?.credit || 0}
                </Text>
              </Col>
              <Col xs={24} sm={12}>
                <Text strong>Total Children Profiles:</Text>
                <br />
                <Text style={{ fontSize: '18px', color: '#52c41a' }}>
                  {user?.children_count || 0}
                </Text>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Password Change Section */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24}>
          <Card title="Security">
            <Space direction="vertical" size="middle">
              <div>
                <Text strong>Password</Text>
                <br />
                <Text type="secondary">Last changed: Never</Text>
              </div>
              <Button type="default">
                Change Password
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Account;
