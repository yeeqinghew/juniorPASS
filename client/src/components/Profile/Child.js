import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Empty,
  Flex,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Typography,
} from "antd";
import { useUserContext } from "../UserContext";
import toast from "react-hot-toast";
import _ from "lodash";
import getBaseURL from "../../utils/config";

const { Text, Title } = Typography;

const Child = () => {
  const token = localStorage.getItem("token"); // Read the token fresh
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
  };

  const handleAddChild = () => {
    try {
      addChildForm.validateFields().then(async (values) => {
        const response = await fetch(`${baseURL}/children`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...values, parent_id: user?.user_id }),
        });

        const parseRes = await response.json();
        if (response.status === 201) {
          addChildForm.resetFields();
          toast.success(parseRes.message);
          setIsAddChildModalOpen(false);
          getChildren(); // Fetch the updated list of children
        }
      });
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
        setIsEditChildModalOpen(false);
        setEditingChild(null);
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
      console.log(parseRes);
      setChildren(parseRes);
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) getChildren();
  }, [user?.user_id]);

  return (
    <div>
      <Title level={4}>Children</Title>
      <Flex direction="column" gap={24}>
        {/* children */}
        {_.isEmpty(children) ? (
          <Empty
            image={<PlusOutlined />}
            imageStyle={{ fontSize: "40px", color: "#1890ff" }}
            description={
              <span>
                <Text>
                  You do not have any child profile created. Click the button
                  below to add a new child.
                </Text>
              </span>
            }
          >
            <Button
              type="primary"
              onClick={() => {
                setIsAddChildModalOpen(true);
              }}
            >
              Add Child
            </Button>
          </Empty>
        ) : (
          <Space direction="vertical">
            <Text strong>
              These are your children. Click on your child's name to check their
              progress
            </Text>
            <Flex direction="row" gap={16} wrap="wrap">
              <Space direction="horizontal" size="large">
                {children &&
                  children.map((child, index) => (
                    <Avatar
                      key={child.child_id}
                      size={100}
                      src={require(`../../images/profile/${
                        child.gender === "F" ? "girls" : "boys"
                      }/${child.gender === "F" ? "girl" : "boy"}${index}.png`)}
                      onClick={() => {
                        setEditingChild(child);
                        editChildForm.setFieldsValue({
                          name: child.name,
                          age: child.age,
                          gender: child.gender,
                        });
                        setIsEditChildModalOpen(true);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {child.name}
                    </Avatar>
                  ))}

                {/* CTA button in toolbar */}
                <Avatar
                  size={100}
                  icon={<PlusOutlined />}
                  style={{
                    cursor: "pointer",
                    border: "1px dashed #1890ff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onClick={() => {
                    setIsAddChildModalOpen(true);
                  }}
                />
              </Space>
            </Flex>
          </Space>
        )}
      </Flex>

      {/* Classes section */}
      <Flex style={{ marginBottom: "24px" }}>
        <Title level={4}>Classes</Title>
      </Flex>

      {/* Add child modal */}
      <Modal
        title="Add a new child"
        open={isAddChildModalOpen}
        onCancel={handleCancel}
        centered
        style={{
          borderRadius: "18px",
        }}
        footer={
          <Button
            form="addChildForm"
            key="submit"
            htmlType="submit"
            onClick={handleAddChild}
          >
            Add
          </Button>
        }
      >
        <Form form={addChildForm} autoComplete="off" layout="vertical">
          <Form.Item
            name="name"
            label="Child's Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="age" label="Age" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
            <Select
              options={[
                {
                  value: "F",
                  label: "Female",
                },
                {
                  value: "M",
                  label: "Male",
                },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit child modal */}
      <Modal
        title="Edit child"
        open={isEditChildModalOpen}
        onCancel={handleCancel}
        centered
        style={{
          borderRadius: "18px",
        }}
        footer={
          <Button
            form="editChildForm"
            key="submit"
            htmlType="submit"
            onClick={handleEditChild}
          >
            Save changes
          </Button>
        }
        // TODO: Delete child
      >
        <Form form={editChildForm} autoComplete="off" layout="vertical">
          <Form.Item
            name="name"
            label="Child's Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="age" label="Age" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
            <Select
              options={[
                {
                  value: "F",
                  label: "Female",
                },
                {
                  value: "M",
                  label: "Male",
                },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Child;
