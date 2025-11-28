import {
  Avatar,
  Button,
  Card,
  Carousel,
  DatePicker,
  Space,
  Tag,
  Typography,
  Image,
  Alert,
  Affix,
  Row,
  Col,
  Divider,
  List,
} from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  LeftOutlined,
  RightOutlined,
  MailOutlined,
  ShopOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useUserContext } from "../UserContext";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import getBaseURL from "../../utils/config";
import Spinner from "../../utils/Spinner";
import toast from "react-hot-toast";
import "./Class.css";
import BuyNow from "./BuyNow";

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

dayjs.extend(duration);

const Class = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [listing, setListing] = useState(null);
  const [isBuyNowModalOpen, setIsBuyNowModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [children, setChildren] = useState([]);

  const { state } = useLocation();
  const { classId } = useParams();
  const { user } = useUserContext();
  const isToday = dayjs(selectedDate).isSame(dayjs(), "day"); // Check if the selected date is today
  const dateFormat = "ddd, D MMM YYYY";
  const navigate = useNavigate();
  const baseURL = getBaseURL();

  const formatTimeslot = (timeslot) => {
    const startTime = dayjs(timeslot[0], "HH:mm");
    const endTime = dayjs(timeslot[1], "HH:mm");
    const duration = dayjs.duration(endTime.diff(startTime)).asMinutes();

    return {
      timeRange: `${timeslot[0]} - ${timeslot[1]}`,
      duration: `${duration} mins`,
    };
  };

  // Function to generate available time slots
  const generateAvailableTimeSlots = () => {
    if (!listing || !listing?.schedule_info) return [];

    const selectedDay = dayjs(selectedDate).format("dddd");
    const startDate =
      dayjs(listing?.long_term_start_date) ||
      dayjs(listing?.short_term_start_date);
    return listing?.schedule_info.reduce((acc, curr) => {
      const { frequency, day, timeslot } = curr;
      if (frequency === "Daily") {
        if (dayjs(selectedDate).isValid()) {
          acc.push({ ...formatTimeslot(timeslot), location: curr });
        }
      } else if (frequency === "Weekly") {
        if (selectedDay === day) {
          acc.push({ ...formatTimeslot(timeslot), location: curr });
        }
      } else if (frequency === "Biweekly") {
        const weeksDifference = dayjs(selectedDate).diff(startDate, "week");
        if (
          weeksDifference >= 0 &&
          weeksDifference % 2 === 0 &&
          selectedDay === day
        ) {
          acc.push({ ...formatTimeslot(timeslot), location: curr });
        }
      } else if (frequency === "Monthly") {
        const selected = dayjs(selectedDate);
        const monthsDiff = selected.diff(startDate, "month");

        if (
          monthsDiff >= 0 &&
          monthsDiff % 1 === 0 &&
          selected.date() === Math.min(startDate.date(), selected.daysInMonth()) // handle month that does not have the day (e.g. 31st February)
        ) {
          acc.push({ ...formatTimeslot(timeslot), location: curr });
        }
      }

      return acc;
    }, []);
  };

  const availableTimeSlots = generateAvailableTimeSlots();

  useEffect(() => {
    async function fetchListing() {
      try {
        const response = await fetch(`${baseURL}/listings/${classId}`, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Network response was not okay");
        }

        const data = await response.json();
        setListing(data);
      } catch (error) {
        setError(error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (!state) {
      fetchListing();
    } else {
      setListing(state.listing);
      setLoading(false);
    }
  }, [classId, state]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleNextDay = () => {
    const nextDay = dayjs(selectedDate).add(1, "day").toDate();
    setSelectedDate(nextDay);
  };

  const handlePreviousDay = () => {
    const previousDay = dayjs(selectedDate).subtract(1, "day").toDate();
    setSelectedDate(previousDay);
  };
  const handleBookNow = async (item) => {
    if (!listing || !item) {
      toast.error(
        "Class information is not available. Please try again later."
      );
      return;
    }

    if (!user) {
      toast.error("Please login to book the class");
      navigate("/login", { state: { from: `/class/${classId}` } });
      return;
    }

    if (user.credit < listing.credit) {
      toast.error("Insufficient credits to book this class.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${baseURL}/children/${user.user_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (response.status === 401 || response.status === 403) {
        toast.error("Please login again to access your children profiles.");
        navigate(`/login`, { state: { from: `/class/${classId}` } });
        return;
      }
      const childrenData = await response.json();

      if (!Array.isArray(childrenData) || childrenData.length === 0) {
        toast.error("No child profile found. Please add one before booking.");
        return;
      }

      setChildren(childrenData);
      setSelected({
        ...item,
        selectedDate: dayjs(selectedDate).format('YYYY-MM-DD')
      });
      setIsBuyNowModalOpen(true);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error.message}
        type="error"
        showIcon
      />
    );
  }

  return (
    <div style={{ 
      width: "100%", 
      minHeight: "100vh",
      background: "linear-gradient(to bottom, #f8fafc 0%, #ffffff 100%)",
      padding: "120px 48px 48px 48px"
    }}>
      <Row gutter={[32, 32]} style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <Col xs={24} sm={24} md={24} lg={16} xl={16}>
        <Carousel autoplay arrows dots>
          {listing?.images.map((imgUrl, index) => (
            <div key={index} style={{ position: "relative" }}>
              <Image
                alt={`carousel-${index}`}
                src={imgUrl}
                preview={false}
                style={{
                  margin: 0,
                  width: "100%",
                  maxHeight: "300px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                }}
              />
            </div>
          ))}
        </Carousel>

        {/* Description */}
        <Space direction="vertical" size="large" style={{ flex: 1 }}>
          <Title level={4}>{listing?.listing_title}</Title>

          <Space direction="horizontal">
            {/* Package Types */}
            {listing?.package_types &&
              listing.package_types
                .replace(/[{}]/g, "")
                .split(",")
                .map((type, index) => (
                  <Tag key={`package-type-${index}`}># {type.trim()}</Tag>
                ))}

            {/* Categories */}
            {listing?.partner_info?.categories?.map((category, index) => (
              <Tag key={`category-${index}`}>{category}</Tag>
            ))}
          </Space>

          <Title level={5} style={{ marginTop: 0 }}>
            Credits: {listing?.credit}
          </Title>

          <Paragraph>{listing?.description}</Paragraph>

          <Divider />
          <Title level={5} style={{ marginTop: 0 }}>
            Schedule
          </Title>
          {/* Date Navigation */}
          <Space
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Button
              onClick={handlePreviousDay}
              disabled={isToday}
              style={{ border: "none", flexShrink: 0 }}
            >
              <LeftOutlined />
            </Button>
            <DatePicker
              value={dayjs(selectedDate)}
              format={dateFormat}
              onChange={handleDateChange}
              allowClear={false}
              style={{
                border: "none",
                width: "100%",
                flexGrow: 1, // Ensures it expands
                maxWidth: "200px",
              }}
              open={false}
              inputReadOnly
              suffixIcon={null}
              className="custom-date-picker"
            />
            <Button
              onClick={handleNextDay}
              style={{ border: "none", flexShrink: 0 }}
            >
              <RightOutlined />
            </Button>
          </Space>

          {/* Available Classes List */}
          <List
            itemLayout="horizontal"
            dataSource={availableTimeSlots}
            locale={{
              emptyText: "There are no upcoming classes available on this day",
            }}
            renderItem={(item) => (
              <List.Item
                style={{
                  width: "100%",
                }}
                actions={[
                  <Button type="primary" onClick={() => handleBookNow(item)}>
                    Book now
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={`${item.timeRange} ${item.location.nearest_mrt}`}
                  description={`${item.duration}`}
                />
              </List.Item>
            )}
          />
        </Space>

        {/* Review */}
        <Divider />
        <Title level={5}>Reviews</Title>
        </Col>

        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
        <Affix offsetTop={100}>
          <Card
            style={{
              width: 500,
              marginTop: 16,
              position: "sticky",
              zIndex: 1000,
              cursor: "pointer",
            }}
          >
            <Meta
              avatar={<Avatar src={listing?.partner_info?.picture} />}
              onClick={() => {
                navigate(`/partner/${listing?.partner_info?.partner_id}`, {});
              }}
              title={listing?.partner_name}
              description={
                <Space direction="vertical">
                  <Space>
                    <ShopOutlined />
                    <Text>{listing?.partner_info?.website}</Text>
                  </Space>

                  <Space>
                    <MailOutlined />

                    <Text>{listing?.partner_info?.email}</Text>
                  </Space>

                  <Space>
                    <PhoneOutlined />

                    <Text>{listing?.partner_info?.contact_number}</Text>
                  </Space>
                </Space>
              }
            />
            {/* TODO: Map */}
          </Card>
          </Affix>
        </Col>
      </Row>
      <BuyNow
        isBuyNowModalOpen={isBuyNowModalOpen}
        setIsBuyNowModalOpen={setIsBuyNowModalOpen}
        selected={selected}
        listing={listing}
        user={user}
        children={children}
      />
    </div>
  );
};

export default Class;
