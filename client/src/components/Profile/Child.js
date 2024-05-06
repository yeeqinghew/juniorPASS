import React, { useContext, useEffect, useState } from "react";
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
import UserContext from "../UserContext";
import toast from "react-hot-toast";
import _ from "lodash";

const { Text, Title } = Typography;

const Child = () => {
  const [children, setChildren] = useState([]);
  const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);
  const [isEditChildModalOpen, setIsEditChildModalOpen] = useState(false);
  const [addChildForm] = Form.useForm();
  const [editChildForm] = Form.useForm();
  const { user } = useContext(UserContext);

  const showAddChildModal = () => {
    setIsAddChildModalOpen(true);
  };

  const handleCancel = () => {
    setIsAddChildModalOpen(false);
    setIsEditChildModalOpen(false);
  };

  const handleAddChild = () => {
    addChildForm
      .validateFields()
      .then(async (values) => {
        const response = await fetch(`http://localhost:5000/children`, {
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
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  const handleEditChild = () => {};

  const getChildren = async () => {
    const response = await fetch(
      `http://localhost:5000/children/${user?.user_id}`,
      {
        method: "GET",
      }
    );
    const parseRes = await response.json();
    setChildren(parseRes);
  };

  useEffect(() => {
    if (user) getChildren();
  }, [user?.user_id]);

  return (
    <>
      <Flex>
        {/* children */}
        {_.isEmpty(children) ? (
          <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{ height: 60 }}
            description={
              <span>
                <Text>You do not have any child profile created.</Text>
              </span>
            }
          ></Empty>
        ) : (
          <Text>
            These are your children. Click on your child's name to check their
            progress
          </Text>
        )}
      </Flex>

      <Flex style={{ padding: "24px" }}>
        <Space direction="horizontal" size="large">
          {children &&
            children.map((child, index) => {
              const gender1 = child?.gender === "F" ? "girls" : "boys";
              const gender2 = child?.gender === "F" ? "girl" : "boy";

              return (
                <Space
                  key={child?.child_id}
                  direction="vertical"
                  style={{
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                    src={require(`../../images/profile/${gender1}/${gender2}${index}.png`)}
                    style={{
                      boxShadow:
                        "rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px",
                    }}
                    onClick={() => {
                      editChildForm.setFieldsValue({
                        // Set initial values of the form fields
                        name: child?.name,
                        age: child?.age,
                        gender: child?.gender,
                      });
                      setIsEditChildModalOpen(true);
                    }}
                  />
                  <Text>{child.name}</Text>
                </Space>
              );
            })}
          <Avatar
            size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
            icon={<PlusOutlined />}
            style={{
              cursor: "pointer",
            }}
            onClick={() => {
              setIsAddChildModalOpen(true);
            }}
          ></Avatar>
        </Space>
      </Flex>

      <Flex>
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
    </>
  );
};

export default Child;
