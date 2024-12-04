import React from "react";
import { Form, Input, Typography, Button, Space, Row, Col } from "antd";

const { Title, Text } = Typography;

const ContactUs = () => {
  const [contactUsForm] = Form.useForm();

  return (
    <div
      style={{
        padding: "50px",
        borderRadius: "8px",
        maxWidth: "600px",
        margin: "0 auto",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Title level={3} style={{ textAlign: "center", color: "#1890ff" }}>
          Ready to grow your business?
        </Title>
        <Text
          type="secondary"
          style={{ textAlign: "center", display: "block" }}
        >
          Interested in joining our platform or learning more about how we can
          grow your business? Fill out the form below, and we’ll be in touch!
        </Text>
        <Form
          form={contactUsForm}
          layout="vertical"
          style={{
            width: "100%",
          }}
        >
          <Form.Item
            name="companyName"
            label="Company Name"
            rules={[
              { required: true, message: "Please enter your company name" },
            ]}
          >
            <Input placeholder="Enter your company name" size="large" />
          </Form.Item>
          <Form.Item
            name="companyPersonName"
            label="Contact Person's Name"
            rules={[{ required: true, message: "Please enter a contact name" }]}
          >
            <Input placeholder="Enter the contact person's name" size="large" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input placeholder="Enter your email" size="large" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              style={{ width: "100%" }}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Space>
    </div>
  );
};

export default ContactUs;
