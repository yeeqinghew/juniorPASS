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
  Spin,
  Alert,
  Affix,
  Row,
  Col,
  Divider,
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import UserContext from "../UserContext";
import dayjs from "dayjs";
import getBaseURL from "../../utils/config";
import useParseListings from "../../hooks/useParseListings";

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

const Class = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [listing, setListing] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);

  const { state } = useLocation();
  const { classId } = useParams();
  const { user } = useContext(UserContext);
  const isToday = dayjs(selectedDate).isSame(dayjs(), "day"); // Check if the selected date is today
  const dateFormat = "ddd, D MMM YYYY";
  const navigate = useNavigate();
  const baseURL = getBaseURL();
  const parseListings = useParseListings();

  // Parse string outlet schedules and convert address to object
  const outletSchedules = listing?.string_outlet_schedules.map((schedule) => ({
    ...schedule,
    address: JSON.parse(schedule.address),
  }));

  const filterSchedules = () => {
    if (!listing || !listing.string_outlet_schedules) return [];

    return listing.string_outlet_schedules.filter((schedule) => {
      const day = dayjs(selectedDate).format("dddd");
      return schedule.schedules.find((item) => item.day === day);
    });
  };

  const formatTimeslot = (timeslot) => {
    return `${timeslot[0]} - ${timeslot[1]}`;
  };

  // Function to generate available time slots
  const generateAvailableTimeSlots = () => {
    if (!listing || !listing.string_outlet_schedules) return [];

    const selectedDay = dayjs(selectedDate).format("dddd");

    return listing.string_outlet_schedules.reduce((acc, curr) => {
      curr.schedules.forEach((schedule) => {
        const day = schedule.day;
        const frequency = schedule.frequency;
        const timeslots = schedule.timeslot;

        if (frequency === "Daily") {
          if (dayjs(selectedDate).isValid()) {
            acc.push(formatTimeslot(timeslots));
          }
        } else if (frequency === "Weekly") {
          if (selectedDay === day) {
            acc.push(formatTimeslot(timeslots));
          }
        } else if (frequency === "Biweekly") {
          const startDate = dayjs(listing.long_term_start_date);
          const weeksDifference = dayjs(selectedDate).diff(startDate, "week");
          if (weeksDifference % 2 === 0 && selectedDay === day) {
            acc.push(formatTimeslot(timeslots));
          }
        } else if (frequency === "Monthly") {
          const startDate = dayjs(listing.long_term_start_date);
          if (
            dayjs(selectedDate).date() === startDate.date() &&
            selectedDay === day
          ) {
            acc.push(formatTimeslot(timeslots));
          }
        }
      });

      console.log(acc);
      return acc;
    }, []);
  };

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
        const parsedListings = parseListings([data]);
        setListing(parsedListings[0]);
      } catch (error) {
        setError(error);
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

  // Function to generate time slots for the selected date
  const generateTimeSlots = () => {
    // You can implement your logic here to fetch or generate time slots for the selected date
    // For simplicity, let's just generate some dummy time slots
    const timeSlots = [];
    for (let i = 0; i < 24; i++) {
      timeSlots.push(`${i < 10 ? "0" + i : i}:00`);
    }
    return timeSlots;
  };

  const handleBookNow = () => {
    // TODO: Show modal
    // TODO: show a list of children
    // TODO: purchase using credit
    // TODO: if credit not enough, show alert message saying not enough
  };

  if (loading) {
    return <Spin tip="Loading..." />;
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
    <Row gutter={16} style={{ width: "100%", padding: "0 150px" }}>
      <Col span={16}>
        <Title level={1}>{listing?.listing_title}</Title>
        <Carousel autoplay arrows>
          {listing?.images.map((imgUrl, index) => (
            <div key={index}>
              <Image
                alt={`carousel-${index}`}
                src={imgUrl}
                preview={false}
                style={{
                  margin: 0,
                  // maxHeight: "200px",
                  // width: "100%",
                  // objectFit: "cover",
                  background: "#364d79",
                }}
              />
            </div>
          ))}
        </Carousel>
        {/* Description */}
        <Space direction="vertical" size="large" style={{ flex: 1 }}>
          <Title level={3}>About</Title>
          <Text>{listing?.credit}</Text>
          <Paragraph>{listing?.description}</Paragraph>
          <Text>Package Types</Text>
          {listing?.package_types.map((type, index) => (
            <Text key={`package-type-${index}`}>{type}</Text>
          ))}
          {listing?.categories.map((category, index) => (
            <Tag key={`category-${index}`}>{category}</Tag>
          ))}
          {listing?.age_groups.map((age, index) => (
            <Text key={`age-group-${index}`}>{age}</Text>
          ))}
          <Text>Outlets: </Text>
          {listing?.string_outlet_schedules.map((schedule, index) => {
            const address = JSON.parse(schedule?.address)?.ADDRESS;
            return (
              <div key={`schedule-${index}`}>
                <Tag>{schedule?.nearest_mrt}</Tag>
                <Text>{address}</Text>
              </div>
            );
          })}

          <Title level={5}>Schedule</Title>
          <div>
            <Button onClick={handlePreviousDay} disabled={isToday}>
              <LeftOutlined />
            </Button>
            <DatePicker
              value={dayjs(selectedDate)}
              format={dateFormat}
              onChange={handleDateChange}
              allowClear={false}
            />
            <Button onClick={handleNextDay}>
              <RightOutlined />
            </Button>
          </div>

          <h3>Available Time Slots:</h3>
          <Row gutter={16}>
            {generateAvailableTimeSlots().map((slot, index) => (
              <Col key={index} span={8} style={{ marginBottom: "16px" }}>
                <Card hoverable style={{}}>
                  <div>{slot}</div>
                </Card>
              </Col>
            ))}
          </Row>
        </Space>

        {/* Review */}
        <Divider orienation="left">Reviews</Divider>
      </Col>

      <Col span={8}>
        <Affix offsetTop={200}>
          <Card
            style={{
              width: 500,
              marginTop: 16,
              position: "sticky",
              zIndex: 1000,
            }}
          >
            <Meta
              avatar={
                <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
              }
              onClick={() => {
                navigate(`/partner/${listing?.partner_id}`, {
                  state: {
                    listing,
                  },
                });
              }}
              title={listing?.partner_name}
              description={
                <Space direction="vertical">
                  <Text>{listing?.website}</Text>
                  <Text>{listing?.email}</Text>
                </Space>
              }
            />
            {/* TODO: Map */}
          </Card>
        </Affix>
      </Col>
    </Row>
  );
};

export default Class;
