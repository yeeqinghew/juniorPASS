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
  Modal,
  Select,
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
import Map, { Marker } from "react-map-gl";
import { useUserContext } from "../UserContext";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import getBaseURL from "../../utils/config";
import Spinner from "../../utils/Spinner";
import toast from "react-hot-toast";
import "./Class.css";

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

  const handleCancel = () => {
    setIsBuyNowModalOpen(false);
  };

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
    console.log(listing?.schedule_info);
    return listing?.schedule_info.reduce((acc, curr) => {
      console.log("curr", curr);
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
        const startDate = dayjs(listing.long_term_start_date);
        const weeksDifference = dayjs(selectedDate).diff(startDate, "week");
        if (weeksDifference % 2 === 0 && selectedDay === day) {
          acc.push({ ...formatTimeslot(timeslot), location: curr });
        }
      } else if (frequency === "Monthly") {
        const startDate = dayjs(listing.long_term_start_date);
        if (
          dayjs(selectedDate).date() === startDate.date() &&
          selectedDay === day
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

  const handleBookNow = (item) => {
    if (user) {
      setIsBuyNowModalOpen(true);
      setSelected(item);
    } else {
      // Navigate to login page with state to remember the class after login
      navigate("/login", { state: { from: `/class/${classId}` } });
      toast.error("Please login to book the class");
    }
  };

  const getChildren = async () => {
    try {
      const response = await fetch(`${baseURL}/children/${user?.user_id}`, {
        method: "GET",
      });
      const parseRes = await response.json();
      setChildren(parseRes);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!isBuyNowModalOpen) return;

    // fetch all children by the specific user
    getChildren();
  }, [isBuyNowModalOpen]);

  console.log("listing", listing);

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
    <Row gutter={16} style={{ width: "100%", padding: "0 200px" }}>
      <Col span={16}>
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
            $ {listing?.credit}
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

      <Col span={8}>
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
      <Modal
        title={"Buy now"}
        open={isBuyNowModalOpen}
        onCancel={handleCancel}
        centered
        style={{
          borderRadius: "18px",
        }}
      >
        <Space direction="vertical">
          <Text>$ {user?.credit}</Text>
          {/* Select child */}
          {/* TODO: need to check the age limit before they can confirm */}
          <Select
            placeholder="Select the child"
            style={{ width: "100%", marginBottom: "1rem" }}
          >
            {children.map((child) => (
              <Select.Option key={child?.child_id} value={child?.child_id}>
                {child.name}
              </Select.Option>
            ))}
          </Select>
          {/* TODO: Select Package Type */}

          <Map
            className={"map"}
            mapStyle="mapbox://styles/mapbox/streets-v8"
            mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
            initialViewState={{
              longitude:
                selected && JSON.parse(selected?.location?.address)?.LONGITUDE,
              latitude:
                selected && JSON.parse(selected?.location?.address)?.LATITUDE,
              zoom: 15,
            }}
            style={{
              width: "100%",
              height: "200px",
            }}
            mapLib={import("mapbox-gl")}
            scrollZoom={false}
          >
            <Marker
              longitude={
                selected && JSON.parse(selected?.location?.address)?.LONGITUDE
              }
              latitude={
                selected && JSON.parse(selected?.location?.address)?.LATITUDE
              }
              anchor="top"
            ></Marker>
          </Map>
          {/* Info about the class */}
          <Space direction="horizontal">
            <Text>Location:</Text>
            <Text>
              {selected && JSON.parse(selected?.location?.address)?.SEARCHVAL}
            </Text>
          </Space>
          <Space direction="">
            <Text>Timeslot:</Text>
            <Text> {selected?.timeRange}</Text>
          </Space>
          <Space direction="horizontal">
            <Text>Duration:</Text>
            <Text> {selected?.duration}</Text>
          </Space>
        </Space>

        {/* TODO: Memo for partner to know */}
      </Modal>
    </Row>
  );
};

export default Class;
