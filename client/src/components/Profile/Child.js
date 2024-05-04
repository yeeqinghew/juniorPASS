import React, { useState } from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Flex,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Typography,
} from "antd";

const { Text } = Typography;

const Child = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addChild] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleAddChild = () => {
    console.log("form", addChild);
    addChild.validateFields().then((values) => {
      console.log("error", values);
    });
  };

  return (
    <>
      <Space direction="horizontal">
        <h1>Child</h1>
        <PlusCircleOutlined onClick={showModal} />
      </Space>

      <Flex>
        <Text>
          These are your children. Click on your child's name to check their
          progress
        </Text>
      </Flex>

      <Modal
        title="Add a new child"
        open={isModalOpen}
        onCancel={handleCancel}
        centered
        style={{
          borderRadius: "18px",
        }}
        footer={
          <Button
            form="addChild"
            key="submit"
            htmlType="submit"
            onClick={handleAddChild}
          >
            Add
          </Button>
        }
      >
        <Form form={addChild} autoComplete="off" layout="vertical">
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
