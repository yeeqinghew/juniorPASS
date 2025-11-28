import React, { useEffect, useState } from "react";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Typography,
  Tag,
} from "antd";
import { useUserContext } from "../UserContext";
import toast from "react-hot-toast";
import _ from "lodash";
import getBaseURL from "../../utils/config";

const { Text, Title } = Typography;

const Child = () => {
  const token = localStorage.getItem("token");
  const baseURL = getBaseURL();
  const [children, setChildren] = useState([]);
  const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);
  const [isEditChildModalOpen, setIsEditChildModalOpen] = useState(false);
  const [editingChild, setEditingChild] = useState(null);
  const [addChildForm] = Form.useForm();
  const [editChildForm] = Form.useForm();
  const { user } = useUserContext();

  const handleCancel = () => {
    setIsAddChildModalOpen(false);
    setIsEditChildModalOpen(false);
    setEditingChild(null);
    addChildForm.resetFields();
    editChildForm.resetFields();
  };

  const handleAddChild = async () => {
    try {
      const values = await addChildForm.validateFields();
      const response = await fetch(`${baseURL}/children`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...values }),
      });

      const parseRes = await response.json();
      if (response.status === 201) {
        toast.success(parseRes.message || "Child added successfully!");
        handleCancel();
        getChildren();
      } else {
        toast.error(parseRes.message || "Failed to add child");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEditChild = async () => {
    try {
      const values = await editChildForm.validateFields();
      const response = await fetch(
        `${baseURL}/children/${editingChild.child_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      const parseRes = await response.json();
      if (response.ok) {
        toast.success("Child updated successfully!");
        handleCancel();
        getChildren();
      } else {
        toast.error(parseRes.message || "Failed to update child");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getChildren = async () => {
    try {
      const response = await fetch(`${baseURL}/children/${user?.user_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const parseRes = await response.json();
      setChildren(parseRes);
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) getChildren();
  }, [user?.user_id]);

  const openEditModal = (child) => {
    setEditingChild(child);
    editChildForm.setFieldsValue({
      name: child.name,
      age: child.age,
      gender: child.gender,
    });
    setIsEditChildModalOpen(true);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          My Children
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsAddChildModalOpen(true)}
        >
          Add Child
        </Button>
      </div>

      {_.isEmpty(children) ? (
        <Card>
          <Empty
            image={<UserOutlined style={{ fontSize: 64, color: "#d9d9d9" }} />}
            imageStyle={{ height: 80, marginBottom: 16 }}
            description={
              <div>
                <Text type="secondary" style={{ fontSize: 16 }}>
                  No children profiles yet
                </Text>
                <br />
                <Text type="secondary">
                  Add your first child to start booking classes
                </Text>
              </div>
            }
          >
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => setIsAddChildModalOpen(true)}
            >
              Add Your First Child
            </Button>
          </Empty>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {children.map((child, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={child.child_id}>
              <Card
                hoverable
                style={{ textAlign: "center", borderRadius: 12 }}
                bodyStyle={{ padding: 20 }}
                actions={[
                  <EditOutlined
                    key="edit"
                    onClick={() => openEditModal(child)}
                    style={{ fontSize: 16, color: "#1890ff" }}
                  />,
                ]}
              >
                <Avatar
                  size={80}
                  src={require(`../../images/profile/${
                    child.gender === "F" ? "girls" : "boys"
                  }/${child.gender === "F" ? "girl" : "boy"}${index % 4}.png`)}
                  style={{ marginBottom: 16 }}
                />
                <div>
                  <Title level={5} style={{ margin: "0 0 8px 0" }}>
                    {child.name}
                  </Title>
                  <Space direction="vertical" size={4}>
                    <Tag color={child.gender === "F" ? "pink" : "blue"}>
                      {child.gender === "F" ? "Girl" : "Boy"}
                    </Tag>
                    <Text type="secondary">Age {child.age}</Text>
                  </Space>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Add Child Modal */}
      <Modal
        title={
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <Avatar
              size={64}
              icon={<UserOutlined />}
              style={{ backgroundColor: "#1890ff", marginBottom: 16 }}
            />
            <br />
            <Title level={4} style={{ margin: 0 }}>
              Add New Child
            </Title>
            <Text type="secondary">Create a profile for your child</Text>
          </div>
        }
        open={isAddChildModalOpen}
        onCancel={handleCancel}
        width={480}
        centered
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleAddChild}
            style={{ minWidth: 100 }}
          >
            Add Child
          </Button>,
        ]}
      >
        <Form form={addChildForm} layout="vertical" style={{ marginTop: 24 }}>
          <Form.Item
            name="name"
            label="Child's Name"
            rules={[
              { required: true, message: "Please enter child's name" },
              { min: 2, message: "Name must be at least 2 characters" },
            ]}
          >
            <Input placeholder="Enter your child's full name" size="large" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="age"
                label="Age"
                rules={[
                  { required: true, message: "Please enter age" },
                  { pattern: /^\d+$/, message: "Please enter a valid age" },
                ]}
              >
                <Input placeholder="Age" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="gender"
                label="Gender"
                rules={[{ required: true, message: "Please select gender" }]}
              >
                <Select
                  placeholder="Select gender"
                  size="large"
                  options={[
                    { value: "F", label: "Girl" },
                    { value: "M", label: "Boy" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Edit Child Modal */}
      <Modal
        title={
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <Avatar
              size={64}
              src={
                editingChild &&
                require(`../../images/profile/${
                  editingChild.gender === "F" ? "girls" : "boys"
                }/${editingChild.gender === "F" ? "girl" : "boy"}0.png`)
              }
              style={{ marginBottom: 16 }}
            />
            <br />
            <Title level={4} style={{ margin: 0 }}>
              Edit Child Profile
            </Title>
            <Text type="secondary">
              Update {editingChild?.name}'s information
            </Text>
          </div>
        }
        open={isEditChildModalOpen}
        onCancel={handleCancel}
        width={480}
        centered
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleEditChild}
            style={{ minWidth: 100 }}
          >
            Save Changes
          </Button>,
        ]}
      >
        <Form form={editChildForm} layout="vertical" style={{ marginTop: 24 }}>
          <Form.Item
            name="name"
            label="Child's Name"
            rules={[
              { required: true, message: "Please enter child's name" },
              { min: 2, message: "Name must be at least 2 characters" },
            ]}
          >
            <Input placeholder="Enter your child's full name" size="large" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="age"
                label="Age"
                rules={[
                  { required: true, message: "Please enter age" },
                  { pattern: /^\d+$/, message: "Please enter a valid age" },
                ]}
              >
                <Input placeholder="Age" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="gender"
                label="Gender"
                rules={[{ required: true, message: "Please select gender" }]}
              >
                <Select
                  placeholder="Select gender"
                  size="large"
                  options={[
                    { value: "F", label: "Girl" },
                    { value: "M", label: "Boy" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default Child;
