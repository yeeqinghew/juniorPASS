import { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Card,
  Form,
  Input,
  Space,
  Typography,
  Upload,
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
  const { user, reauthenticate } = useUserContext();
  const baseURL = getBaseURL();
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        phone_number: user.phone_number || "",
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
      phone_number: user.phone_number || "",
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const token = localStorage.getItem("token");

      const response = await fetch(`${baseURL}/auth/${user.user_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      const parseRes = await response.json();

      if (response.ok) {
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

  const handleAvatarUpload = async ({ file, onSuccess, onError }) => {
    try {
      setUploadLoading(true);
      const token = localStorage.getItem("token");
      const oldDisplayPicture = user?.display_picture;

      const res = await fetch(`${baseURL}/media/upload/user-dp`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to get upload signature");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", data.apiKey);
      formData.append("timestamp", data.allowedParams.timestamp);
      formData.append("signature", data.signature);
      formData.append("folder", data.allowedParams.folder);
      formData.append("public_id", data.allowedParams.public_id);
      formData.append("overwrite", data.allowedParams.overwrite);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${data.cloudName}/image/upload`,
        { method: "POST", body: formData }
      );
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error.message || "Upload failed");

      const updateRes = await fetch(`${baseURL}/auth/${user.user_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ display_picture: uploadData?.secure_url }),
      });
      const updateData = await updateRes.json();
      if (!updateRes.ok) throw new Error(updateData.message || "Failed to update profile picture");

      if (oldDisplayPicture && oldDisplayPicture.includes("cloudinary.com")) {
        try {
          const urlParts = oldDisplayPicture.split("/upload/");
          if (urlParts.length === 2) {
            const pathAfterUpload = urlParts[1];
            const pathWithoutVersion = pathAfterUpload.replace(/^v\d+\//, "");
            const publicId = pathWithoutVersion.substring(0, pathWithoutVersion.lastIndexOf("."));
            await fetch(`${baseURL}/media/delete`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ publicIds: [publicId] }),
            });
          }
        } catch (deleteError) {
          console.error("Failed to delete old image:", deleteError);
        }
      }

      await reauthenticate();
      toast.success("Profile picture updated successfully!");
      onSuccess(null, file);
    } catch (error) {
      onError(error);
      toast.error(error.message || "Failed to upload profile picture");
    } finally {
      setUploadLoading(false);
    }
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      toast.error("You can only upload image files!");
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      toast.error("Image must be smaller than 5MB!");
      return false;
    }
    return true;
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
      {/* Header */}
      <div className="account-header">
        <Title level={3} className="account-title">
          <UserOutlined /> My Account
        </Title>
        <Text className="account-subtitle">
          Manage your profile information and account settings
        </Text>
      </div>

      {/* Profile + Info cards */}
      <div className="account-cards-row">
        <div className="profile-card-wrapper">
          <Card className="profile-card" bordered={false}>
            <div className="profile-card-content">
              <Avatar
                size={100}
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
                customRequest={handleAvatarUpload}
                beforeUpload={beforeUpload}
                disabled={!isEditing || uploadLoading}
                accept="image/*"
              >
                <Button
                  icon={<UploadOutlined />}
                  disabled={!isEditing || uploadLoading}
                  loading={uploadLoading}
                  size="small"
                  className="upload-button"
                >
                  {uploadLoading ? "Uploading..." : isEditing ? "Change Photo" : "Photo"}
                </Button>
              </Upload>

              <div className="profile-member-since">
                <CalendarOutlined className="member-icon" />
                <span>Member since {formatDate(user?.created_at)}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Info card — no extra prop; button lives inside body to avoid header overflow */}
        <div className="info-card-wrapper">
          <Card
            bordered={false}
          >
            {/* Card header built manually so we fully control wrapping */}
            <div className="info-card-header">
              <span className="info-card-title">Personal Information</span>
              <div className="action-buttons">
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
              </div>
            </div>

            <Form
              form={form}
              layout="vertical"
              disabled={!isEditing}
              className="account-form"
            >
              <div className="form-grid">
                <Form.Item
                  name="name"
                  label="Full Name"
                  rules={[
                    { required: true, message: "Please enter your full name" },
                    { min: 2, message: "Name must be at least 2 characters" },
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Enter your full name" />
                </Form.Item>

                <Form.Item name="email" label="Email Address">
                  <Input disabled prefix={<MailOutlined />} />
                </Form.Item>

                <Form.Item
                  name="phone_number"
                  label="Phone Number"
                  rules={[
                    {
                      pattern: /^[0-9+\-\s()]*$/,
                      message: "Please enter a valid phone number",
                    },
                  ]}
                >
                  <Input prefix={<PhoneOutlined />} placeholder="Enter your phone number" />
                </Form.Item>
              </div>
            </Form>

            {/* Account Details */}
            <div className="account-details-section">
              <Text strong className="account-details-title">
                Account Details
              </Text>
              <div className="detail-row">
                <span className="detail-label">
                  <IdcardOutlined className="detail-icon" /> User ID
                </span>
                <span className="detail-value">{user?.user_id || "N/A"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">
                  <CheckCircleOutlined className="detail-icon" /> Account Status
                </span>
                <span className="detail-value active">Active</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Security — plain div, no Ant Row/Col */}
      <div className="security-row">
        <Card
          className="security-card"
          title={
            <Space>
              <LockOutlined /> Security
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
      </div>
    </div>
  );
};

export default Account;