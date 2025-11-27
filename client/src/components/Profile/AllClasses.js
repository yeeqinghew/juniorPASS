import React, { useState, useEffect } from "react";
import {
  Card,
  Empty,
  List,
  Segmented,
  Typography,
  Tag,
  Space,
  Avatar,
  Button,
  Row,
  Col,
  Spin,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  HeartOutlined,
  HeartFilled,
  UserOutlined,
} from "@ant-design/icons";
import { useUserContext } from "../UserContext";
import toast from "react-hot-toast";
import getBaseURL from "../../utils/config";

const { Title, Text } = Typography;

const AllClasses = () => {
  const { user } = useUserContext();
  const baseURL = getBaseURL();
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favourites, setFavourites] = useState([]);

  const fetchClasses = async (type) => {
    setLoading(true);
    try {
      let endpoint = '';
      switch (type) {
        case 'Upcoming':
          endpoint = `/bookings/user/${user.user_id}/upcoming`;
          break;
        case 'History':
          endpoint = `/bookings/user/${user.user_id}/history`;
          break;
        case 'Favourite':
          endpoint = `/bookings/user/${user.user_id}/favourites`;
          break;
        default:
          endpoint = `/bookings/user/${user.user_id}/upcoming`;
      }

      const response = await fetch(`${baseURL}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setClasses(data);
      } else {
        setClasses([]);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("Failed to fetch classes");
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavourite = async (classId) => {
    try {
      const isFavourited = favourites.includes(classId);
      const method = isFavourited ? "DELETE" : "POST";
      
      const response = await fetch(`${baseURL}/favourites`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.user_id,
          listing_id: classId,
        }),
      });

      if (response.ok) {
        if (isFavourited) {
          setFavourites(prev => prev.filter(id => id !== classId));
          toast.success("Removed from favourites");
        } else {
          setFavourites(prev => [...prev, classId]);
          toast.success("Added to favourites");
        }
      }
    } catch (error) {
      toast.error("Failed to update favourites");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'green';
      case 'pending':
        return 'orange';
      case 'cancelled':
        return 'red';
      case 'completed':
        return 'blue';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    if (user) {
      fetchClasses(activeTab);
    }
  }, [user, activeTab]);

  const renderClassItem = (item) => (
    <List.Item
      key={item.booking_id || item.listing_id}
      actions={[
        activeTab !== 'Favourite' && (
          <Button
            type="text"
            icon={
              favourites.includes(item.listing_id) ? 
              <HeartFilled style={{ color: '#ff4d4f' }} /> : 
              <HeartOutlined />
            }
            onClick={() => toggleFavourite(item.listing_id)}
          />
        ),
        activeTab === 'Upcoming' && item.status !== 'cancelled' && (
          <Button type="link" danger>
            Cancel
          </Button>
        ),
      ].filter(Boolean)}
    >
      <List.Item.Meta
        avatar={
          <Avatar
            size={64}
            src={item.listing_image || item.image}
            icon={<UserOutlined />}
          />
        }
        title={
          <Space direction="vertical" size={4}>
            <Text strong style={{ fontSize: '16px' }}>
              {item.listing_title || item.title}
            </Text>
            <Space size="small">
              <Tag color={getStatusColor(item.status)}>
                {item.status || 'Confirmed'}
              </Tag>
              {item.child_name && (
                <Tag color="blue">For: {item.child_name}</Tag>
              )}
            </Space>
          </Space>
        }
        description={
          <Space direction="vertical" size={8} style={{ width: '100%' }}>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Space size="small">
                  <CalendarOutlined style={{ color: '#666' }} />
                  <Text type="secondary">
                    {formatDate(item.class_date || item.date)}
                  </Text>
                </Space>
              </Col>
              <Col xs={24} sm={12}>
                <Space size="small">
                  <ClockCircleOutlined style={{ color: '#666' }} />
                  <Text type="secondary">
                    {formatTime(item.start_time)} - {formatTime(item.end_time)}
                  </Text>
                </Space>
              </Col>
            </Row>
            
            {item.location && (
              <Row>
                <Col xs={24}>
                  <Space size="small">
                    <EnvironmentOutlined style={{ color: '#666' }} />
                    <Text type="secondary">{item.location}</Text>
                  </Space>
                </Col>
              </Row>
            )}

            {item.price && (
              <Text strong style={{ color: '#1890ff', fontSize: '16px' }}>
                ${item.price}
              </Text>
            )}
          </Space>
        }
      />
    </List.Item>
  );

  return (
    <div>
      <Title level={4}>My Classes</Title>
      
      <Card>
        <Segmented
          options={["Upcoming", "History", "Favourite"]}
          value={activeTab}
          onChange={setActiveTab}
          block
          style={{ marginBottom: 24 }}
        />

        <Spin spinning={loading}>
          {classes.length === 0 ? (
            <Empty
              description={
                activeTab === 'Upcoming' ? 
                "No upcoming classes" : 
                activeTab === 'History' ? 
                "No class history" : 
                "No favourite classes"
              }
            >
              {activeTab === 'Upcoming' && (
                <Button type="primary" href="/classes">
                  Browse Classes
                </Button>
              )}
            </Empty>
          ) : (
            <List
              itemLayout="vertical"
              dataSource={classes}
              renderItem={renderClassItem}
              pagination={{
                pageSize: 5,
                showSizeChanger: false,
                showQuickJumper: false,
              }}
            />
          )}
        </Spin>
      </Card>

      {/* Quick Stats */}
      {!loading && classes.length > 0 && (
        <Row gutter={16} style={{ marginTop: 24 }}>
          <Col xs={8}>
            <Card size="small">
              <div style={{ textAlign: 'center' }}>
                <Text style={{ fontSize: '24px', color: '#1890ff' }}>
                  {classes.filter(c => c.status === 'confirmed').length}
                </Text>
                <br />
                <Text type="secondary">
                  {activeTab === 'Upcoming' ? 'Confirmed' : 'Completed'}
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={8}>
            <Card size="small">
              <div style={{ textAlign: 'center' }}>
                <Text style={{ fontSize: '24px', color: '#52c41a' }}>
                  {classes.length}
                </Text>
                <br />
                <Text type="secondary">Total</Text>
              </div>
            </Card>
          </Col>
          <Col xs={8}>
            <Card size="small">
              <div style={{ textAlign: 'center' }}>
                <Text style={{ fontSize: '24px', color: '#ff4d4f' }}>
                  {favourites.length}
                </Text>
                <br />
                <Text type="secondary">Favourites</Text>
              </div>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default AllClasses;
