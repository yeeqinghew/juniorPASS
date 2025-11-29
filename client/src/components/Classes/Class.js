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
  const [slotAvailability, setSlotAvailability] = useState({});
  const [userBookings, setUserBookings] = useState([]);

  const { state } = useLocation();
  const { classId } = useParams();
  const { user, reauthenticate } = useUserContext();
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

  // Fetch user's bookings
  useEffect(() => {
    async function fetchUserBookings() {
      if (!user) return;
      
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${baseURL}/bookings/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserBookings(data.bookings || []);
        }
      } catch (error) {
        console.error("Error fetching user bookings:", error);
      }
    }

    fetchUserBookings();
  }, [user, baseURL]);

  // Fetch slot availability
  useEffect(() => {
    async function fetchSlotAvailability() {
      if (!listing || !listing.schedule_info || !selectedDate) return;

      const slots = generateAvailableTimeSlots();
      if (!slots.length) return;

      const availability = {};

      for (const slot of slots) {
        const startDate = dayjs(selectedDate)
          .hour(parseInt(slot.location.timeslot[0].split(":")[0]))
          .minute(parseInt(slot.location.timeslot[0].split(":")[1]))
          .format("YYYY-MM-DDTHH:mm:ss");

        const endDate = dayjs(selectedDate)
          .hour(parseInt(slot.location.timeslot[1].split(":")[0]))
          .minute(parseInt(slot.location.timeslot[1].split(":")[1]))
          .format("YYYY-MM-DDTHH:mm:ss");

        try {
          const response = await fetch(
            `${baseURL}/bookings/availability/${slot.location.schedule_id}?start_date=${startDate}&end_date=${endDate}`
          );

          if (response.ok) {
            const data = await response.json();
            const key = `${slot.location.schedule_id}-${startDate}`;
            availability[key] = {
              isFull: data.is_full,
              availableSpots: data.available_spots,
              maxSlots: data.max_slots,
            };
          }
        } catch (error) {
          console.error("Error fetching availability:", error);
        }
      }

      setSlotAvailability(availability);
    }

    fetchSlotAvailability();
  }, [listing, selectedDate, baseURL]);

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
        selectedDate: dayjs(selectedDate).format("YYYY-MM-DD"),
      });
      setIsBuyNowModalOpen(true);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  // Callback to refresh user data after successful booking
  const handleBookingSuccess = async (updatedCredit) => {
    // Re-fetch user data to get updated credit balance
    await reauthenticate();
    
    // Re-fetch user bookings to update the "Booked" indicators
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${baseURL}/bookings/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserBookings(data.bookings || []);
      }
    } catch (error) {
      console.error("Error fetching user bookings:", error);
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
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#f8f9fa",
        padding: "120px 24px 48px 24px",
      }}
    >
      <Row gutter={[24, 24]} style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <Col xs={24} sm={24} md={24} lg={16} xl={16}>
          {/* Hero Image Carousel */}
          <Card
            bordered={false}
            style={{
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              marginBottom: "24px",
            }}
          >
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
                      height: "400px",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
                      padding: "40px 24px 24px",
                      color: "white",
                    }}
                  >
                    <Title
                      level={2}
                      style={{
                        color: "white",
                        margin: 0,
                        textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                      }}
                    >
                      {listing?.listing_title}
                    </Title>
                  </div>
                </div>
              ))}
            </Carousel>
          </Card>

          {/* Description Card */}
          <Card
            bordered={false}
            style={{
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
              background: "white",
              marginBottom: "24px",
            }}
          >
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              {/* Tags */}
              <Space wrap>
                {listing?.package_types &&
                  listing.package_types
                    .replace(/[{}]/g, "")
                    .split(",")
                    .map((type, index) => (
                      <Tag
                        key={`package-type-${index}`}
                        color="blue"
                        style={{
                          fontSize: "13px",
                          padding: "4px 12px",
                          borderRadius: "12px",
                          border: "none",
                        }}
                      >
                        {type.trim()}
                      </Tag>
                    ))}

                {listing?.partner_info?.categories?.map((category, index) => (
                  <Tag
                    key={`category-${index}`}
                    color="purple"
                    style={{
                      fontSize: "13px",
                      padding: "4px 12px",
                      borderRadius: "12px",
                      border: "none",
                    }}
                  >
                    {category}
                  </Tag>
                ))}
              </Space>

              <Paragraph
                style={{
                  fontSize: "15px",
                  lineHeight: "1.8",
                  color: "#4a5568",
                  marginTop: "8px",
                }}
              >
                {listing?.description}
              </Paragraph>
            </Space>
          </Card>

          {/* Schedule Card */}
          <Card
            bordered={false}
            style={{
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
              background: "white",
              marginBottom: "24px",
            }}
          >
            <Title level={4} style={{ marginBottom: "20px", color: "#2d3748" }}>
              📅 Select a Date & Time
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
                emptyText:
                  "There are no upcoming classes available on this day",
              }}
              style={{ marginTop: "20px" }}
              renderItem={(item) => {
                const startDate = dayjs(selectedDate)
                  .hour(parseInt(item.location.timeslot[0].split(":")[0]))
                  .minute(parseInt(item.location.timeslot[0].split(":")[1]))
                  .format("YYYY-MM-DDTHH:mm:ss");

                const availabilityKey = `${item.location.schedule_id}-${startDate}`;
                const availability = slotAvailability[availabilityKey];
                const isSoldOut = availability?.isFull || false;
                const spotsLeft = availability?.availableSpots;

                // Check if user has already booked this slot (compare without seconds)
                const isBooked = userBookings.some((booking) => {
                  const bookingStart = dayjs(booking.start_date).format("YYYY-MM-DDTHH:mm");
                  const targetStart = dayjs(startDate).format("YYYY-MM-DDTHH:mm");
                  const matchesListing = booking.listing_id === classId;
                  const matchesTime = bookingStart === targetStart;
                  
                  return matchesListing && matchesTime;
                });

                return (
                  <List.Item
                    style={{
                      padding: "16px",
                      background: isBooked ? "#e6f7ff" : isSoldOut ? "#f5f5f5" : "#fafafa",
                      borderRadius: "12px",
                      marginBottom: "12px",
                      border: `1px solid ${isBooked ? "#1890ff" : isSoldOut ? "#d9d9d9" : "#e8e8e8"}`,
                      opacity: isSoldOut ? 0.7 : 1,
                    }}
                    actions={[
                      isBooked ? (
                        <Tag
                          color="blue"
                          style={{
                            fontSize: "14px",
                            padding: "6px 16px",
                            fontWeight: "bold",
                          }}
                        >
                          ✓ BOOKED
                        </Tag>
                      ) : isSoldOut ? (
                        <Tag
                          color="red"
                          style={{
                            fontSize: "14px",
                            padding: "6px 16px",
                            fontWeight: "bold",
                          }}
                        >
                          SOLD OUT
                        </Tag>
                      ) : (
                        <Button
                          type="primary"
                          size="large"
                          onClick={() => handleBookNow(item)}
                          style={{
                            borderRadius: "8px",
                            height: "40px",
                            fontWeight: "500",
                          }}
                        >
                          Book Now
                        </Button>
                      ),
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "12px",
                            background: isSoldOut ? "#d9d9d9" : "#1890ff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "20px",
                          }}
                        >
                          {isSoldOut ? "❌" : "🕐"}
                        </div>
                      }
                      title={
                        <Space>
                          <Text strong style={{ fontSize: "16px" }}>
                            {item.timeRange}
                          </Text>
                          <Tag color="gold" style={{ fontWeight: "bold" }}>
                            💰 {item.location.credit || listing?.credit} Credits
                          </Tag>
                          {!isSoldOut &&
                            spotsLeft !== undefined &&
                            spotsLeft <= 3 &&
                            spotsLeft > 0 && (
                              <Tag color="orange">
                                Only {spotsLeft}{" "}
                                {spotsLeft === 1 ? "spot" : "spots"} left!
                              </Tag>
                            )}
                        </Space>
                      }
                      description={
                        <Space size="small">
                          <Tag>{item.duration}</Tag>
                          <Tag color="blue">{item.location.nearest_mrt}</Tag>
                        </Space>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          </Card>

          {/* Review Card */}
          <Card
            bordered={false}
            style={{
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
              background: "white",
              marginBottom: "24px",
            }}
          >
            <Title level={4} style={{ color: "#2d3748" }}>
              ⭐ Reviews
            </Title>
            <Text type="secondary">Reviews coming soon...</Text>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
          <Affix offsetTop={120}>
            <Card
              bordered={false}
              style={{
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                background: "white",
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.3s ease",
                maxWidth: "100%",
              }}
              hoverable
              onClick={() => {
                navigate(`/partner/${listing?.partner_info?.partner_id}`, {});
              }}
            >
              {/* Partner Header */}
              <Space
                align="center"
                size="middle"
                style={{ marginBottom: "20px" }}
              >
                <Avatar
                  size={64}
                  src={listing?.partner_info?.picture}
                  style={{
                    border: "2px solid #e8e8e8",
                  }}
                />
                <div>
                  <Title level={4} style={{ margin: 0 }}>
                    {listing?.partner_name}
                  </Title>
                  <Text type="secondary" style={{ fontSize: "13px" }}>
                    Verified Partner
                  </Text>
                </div>
              </Space>

              <Divider style={{ margin: "16px 0" }} />

              {/* Contact Information */}
              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                <Space>
                  <ShopOutlined
                    style={{ fontSize: "16px", color: "#8c8c8c" }}
                  />
                  <div>
                    <Text
                      type="secondary"
                      style={{ fontSize: "12px", display: "block" }}
                    >
                      Website
                    </Text>
                    <Text strong style={{ fontSize: "14px" }}>
                      {listing?.partner_info?.website || "N/A"}
                    </Text>
                  </div>
                </Space>

                <Space>
                  <MailOutlined
                    style={{ fontSize: "16px", color: "#8c8c8c" }}
                  />
                  <div>
                    <Text
                      type="secondary"
                      style={{ fontSize: "12px", display: "block" }}
                    >
                      Email
                    </Text>
                    <Text strong style={{ fontSize: "14px" }}>
                      {listing?.partner_info?.email}
                    </Text>
                  </div>
                </Space>

                <Space>
                  <PhoneOutlined
                    style={{ fontSize: "16px", color: "#8c8c8c" }}
                  />
                  <div>
                    <Text
                      type="secondary"
                      style={{ fontSize: "12px", display: "block" }}
                    >
                      Phone
                    </Text>
                    <Text strong style={{ fontSize: "14px" }}>
                      {listing?.partner_info?.contact_number}
                    </Text>
                  </div>
                </Space>
              </Space>

              <Divider style={{ margin: "16px 0" }} />

              {/* View Profile Button */}
              <Button
                type="primary"
                block
                size="large"
                style={{
                  height: "44px",
                  borderRadius: "8px",
                  fontWeight: "500",
                }}
              >
                View Partner Profile
              </Button>
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
        onBookingSuccess={handleBookingSuccess}
      />
    </div>
  );
};

export default Class;
