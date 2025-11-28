import React, { useState, useEffect } from "react";
import {
  Card,
  Empty,
  List,
  Typography,
  Tag,
  Space,
  Avatar,
  Button,
  Row,
  Col,
  Spin,
  Collapse,
  Segmented,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  BookOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useUserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import getBaseURL from "../../utils/config";

const { Title, Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

const ChildrenClasses = () => {
  const { user } = useUserContext();
  const baseURL = getBaseURL();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [children, setChildren] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [filterType, setFilterType] = useState("upcoming");
  const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);
  const [editingChild, setEditingChild] = useState(null);
  const [form] = Form.useForm();

  const fetchChildrenAndBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Fetch children
      const childrenResponse = await fetch(`${baseURL}/children/${user.user_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Fetch bookings
      const bookingsResponse = await fetch(`${baseURL}/bookings/user`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (childrenResponse.ok && bookingsResponse.ok) {
        const childrenData = await childrenResponse.json();
        const bookingsData = await bookingsResponse.json();
        
        setChildren(childrenData);
        setBookings(bookingsData.bookings || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchChildrenAndBookings();
    }
  }, [user]);

  const handleAddChild = () => {
    setEditingChild(null);
    form.resetFields();
    setIsAddChildModalOpen(true);
  };

  const handleEditChild = (child) => {
    setEditingChild(child);
    form.setFieldsValue({
      name: child.name,
      age: child.age,
      gender: child.gender,
    });
    setIsAddChildModalOpen(true);
  };

  const handleDeleteChild = async (childId) => {
    Modal.confirm({
      title: 'Delete Child Profile',
      content: 'Are you sure you want to delete this child profile? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(`${baseURL}/children/${childId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            toast.success("Child profile deleted successfully");
            fetchChildrenAndBookings();
          } else {
            toast.error("Failed to delete child profile");
          }
        } catch (error) {
          console.error("Error deleting child:", error);
          toast.error("Failed to delete child profile");
        }
      },
    });
  };

  const handleSaveChild = async (values) => {
    try {
      const token = localStorage.getItem("token");
      const url = editingChild
        ? `${baseURL}/children/${editingChild.child_id}`
        : `${baseURL}/children`;
      
      const method = editingChild ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...values,
          parent_id: user.user_id,
        }),
      });

      if (response.ok) {
        toast.success(
          editingChild
            ? "Child profile updated successfully"
            : "Child profile added successfully"
        );
        setIsAddChildModalOpen(false);
        form.resetFields();
        fetchChildrenAndBookings();
      } else {
        toast.error("Failed to save child profile");
      }
    } catch (error) {
      console.error("Error saving child:", error);
      toast.error("Failed to save child profile");
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${baseURL}/bookings/${bookingId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Booking cancelled successfully");
        fetchChildrenAndBookings();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getFilteredBookings = (childId) => {
    const now = new Date();
    let filtered = bookings;

    if (filterType === "upcoming") {
      filtered = bookings.filter(b => new Date(b.start_date) >= now);
    } else if (filterType === "past") {
      filtered = bookings.filter(b => new Date(b.start_date) < now);
    }

    // For now, return all filtered bookings (will need child_id in bookings table to properly filter)
    return filtered;
  };

  const getChildImage = (child) => {
    if (child.display_picture) {
      return child.display_picture;
    }
    try {
      return child.gender === "M" 
        ? require("../../images/profile/boys/boy0.png")
        : require("../../images/profile/girls/girl0.png");
    } catch (e) {
      return null;
    }
  };

  const renderBookingItem = (booking) => {
    let imageUrl = null;
    if (booking.images) {
      try {
        const imagesArray = typeof booking.images === 'string' 
          ? JSON.parse(booking.images) 
          : booking.images;
        imageUrl = imagesArray[0];
      } catch (e) {
        imageUrl = booking.partner_picture;
      }
    } else {
      imageUrl = booking.partner_picture;
    }

    const isPast = new Date(booking.start_date) < new Date();

    return (
      <List.Item
        key={booking.booking_id}
        actions={
          !isPast ? [
            <Button 
              type="link" 
              danger
              onClick={() => handleCancelBooking(booking.booking_id)}
            >
              Cancel
            </Button>
          ] : []
        }
      >
        <List.Item.Meta
          avatar={
            <Avatar
              size={64}
              src={imageUrl}
              icon={<UserOutlined />}
              style={{ borderRadius: "8px" }}
            />
          }
          title={
            <Space direction="vertical" size={4}>
              <Text strong style={{ fontSize: "16px" }}>
                {booking.listing_title}
              </Text>
              <Space size="small">
                <Tag color={isPast ? "default" : "green"}>
                  {isPast ? "Completed" : "Confirmed"}
                </Tag>
                {booking.partner_name && (
                  <Tag color="purple">{booking.partner_name}</Tag>
                )}
              </Space>
            </Space>
          }
          description={
            <Space direction="vertical" size={8} style={{ width: "100%" }}>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Space size="small">
                    <CalendarOutlined style={{ color: "#666" }} />
                    <Text type="secondary">
                      {formatDate(booking.start_date)}
                    </Text>
                  </Space>
                </Col>
                <Col xs={24} sm={12}>
                  <Space size="small">
                    <ClockCircleOutlined style={{ color: "#666" }} />
                    <Text type="secondary">
                      {formatTime(booking.start_date)} - {formatTime(booking.end_date)}
                    </Text>
                  </Space>
                </Col>
              </Row>
            </Space>
          }
        />
      </List.Item>
    );
  };

  const renderChildPanel = (child) => {
    const childBookings = getFilteredBookings(child.child_id);
    
    return (
      <Panel
        header={
          <Space>
            <Avatar 
              size={48} 
              src={getChildImage(child)} 
              icon={<UserOutlined />}
            />
            <div>
              <Text strong style={{ fontSize: "16px" }}>
                {child.name}
              </Text>
              <br />
              <Text type="secondary">
                Age {child.age} • {child.gender === "M" ? "Male" : "Female"}
              </Text>
            </div>
            <Tag color="blue">
              {childBookings.length} {childBookings.length === 1 ? 'Class' : 'Classes'}
            </Tag>
          </Space>
        }
        key={child.child_id}
        extra={
          <Space onClick={(e) => e.stopPropagation()}>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleEditChild(child);
              }}
            />
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteChild(child.child_id);
              }}
            />
          </Space>
        }
      >
        {childBookings.length === 0 ? (
          <Empty
            description={`No ${filterType} classes`}
            image={<BookOutlined style={{ fontSize: 48, color: '#ccc' }} />}
          >
            {filterType === "upcoming" && (
              <Button type="primary" onClick={() => navigate('/classes')}>
                Browse Classes
              </Button>
            )}
          </Empty>
        ) : (
          <List
            dataSource={childBookings}
            renderItem={renderBookingItem}
          />
        )}
      </Panel>
    );
  };

  const upcomingCount = bookings.filter(b => new Date(b.start_date) >= new Date()).length;
  const pastCount = bookings.filter(b => new Date(b.start_date) < new Date()).length;

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>Children & Their Classes</Title>
          <Text type="secondary">
            Manage your children and view their booked classes
          </Text>
        </Col>
        <Col>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAddChild}
          >
            Add Child
          </Button>
        </Col>
      </Row>

      {/* Summary Stats */}
      {!loading && children.length > 0 && (
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col xs={12} sm={6}>
            <Card size="small">
              <div style={{ textAlign: "center" }}>
                <Text style={{ fontSize: "24px", color: "#1890ff" }}>
                  {children.length}
                </Text>
                <br />
                <Text type="secondary">
                  {children.length === 1 ? 'Child' : 'Children'}
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small">
              <div style={{ textAlign: "center" }}>
                <Text style={{ fontSize: "24px", color: "#52c41a" }}>
                  {upcomingCount}
                </Text>
                <br />
                <Text type="secondary">Upcoming</Text>
              </div>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small">
              <div style={{ textAlign: "center" }}>
                <Text style={{ fontSize: "24px", color: "#8c8c8c" }}>
                  {pastCount}
                </Text>
                <br />
                <Text type="secondary">Completed</Text>
              </div>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small">
              <div style={{ textAlign: "center" }}>
                <Text style={{ fontSize: "24px", color: "#ff4d4f" }}>
                  {user?.credit || 0}
                </Text>
                <br />
                <Text type="secondary">Credits</Text>
              </div>
            </Card>
          </Col>
        </Row>
      )}

      <Card style={{ marginBottom: 16 }}>
        <Segmented
          value={filterType}
          onChange={setFilterType}
          options={[
            { label: `Upcoming (${upcomingCount})`, value: 'upcoming' },
            { label: `Past (${pastCount})`, value: 'past' },
            { label: `All (${bookings.length})`, value: 'all' },
          ]}
          block
        />
      </Card>

      <Spin spinning={loading}>
        {children.length === 0 ? (
          <Card>
            <Empty
              description="No children profiles found"
              image={<UserOutlined style={{ fontSize: 48, color: '#ccc' }} />}
            >
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddChild}>
                Add Your First Child
              </Button>
            </Empty>
          </Card>
        ) : (
          <Collapse 
            defaultActiveKey={children.map(c => c.child_id)}
            expandIconPosition="end"
          >
            {children.map((child) => renderChildPanel(child))}
          </Collapse>
        )}
      </Spin>


      {/* Add/Edit Child Modal */}
      <Modal
        title={editingChild ? "Edit Child Profile" : "Add Child Profile"}
        open={isAddChildModalOpen}
        onCancel={() => {
          setIsAddChildModalOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText={editingChild ? "Update" : "Add"}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveChild}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter child name' }]}
          >
            <Input placeholder="Enter child's name" />
          </Form.Item>

          <Form.Item
            label="Age"
            name="age"
            rules={[{ required: true, message: 'Please enter age' }]}
          >
            <InputNumber 
              min={0} 
              max={18} 
              style={{ width: '100%' }}
              placeholder="Enter age"
            />
          </Form.Item>

          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: 'Please select gender' }]}
          >
            <Select placeholder="Select gender">
              <Option value="M">Male</Option>
              <Option value="F">Female</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ChildrenClasses;
