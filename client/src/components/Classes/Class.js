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
  List,
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  LeftOutlined,
  RightOutlined,
  MailOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import UserContext from "../UserContext";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import getBaseURL from "../../utils/config";
import useParseListings from "../../hooks/useParseListings";
import Spinner from "../../utils/Spinner";
import "./Class.css";

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

dayjs.extend(duration);

const Class = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [listing, setListing] = useState(null);

  const { state } = useLocation();
  const { classId } = useParams();
  const { user } = useContext(UserContext);
  const isToday = dayjs(selectedDate).isSame(dayjs(), "day"); // Check if the selected date is today
  const dateFormat = "ddd, D MMM YYYY";
  const navigate = useNavigate();
  const baseURL = getBaseURL();
  const parseListings = useParseListings();

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
    if (!listing || !listing.string_outlet_schedules) return [];
    console.log(listing.string_outlet_schedules);

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

  const handleBookNow = () => {
    // TODO: Show modal
    // TODO: show a list of children
    // TODO: purchase using credit
    // TODO: if credit not enough, show alert message saying not enough
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
    <Row gutter={16} style={{ width: "100%", padding: "0 150px" }}>
      <Col span={16}>
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
          <Title level={4}>{listing?.listing_title}</Title>
          <Title level={5}>$ {listing?.credit}</Title>
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

          <Divider />
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

          <Divider />
          <Title level={5}>Schedule</Title>
          <div>
            <Button
              onClick={handlePreviousDay}
              disabled={isToday}
              style={{ border: "none" }}
            >
              <LeftOutlined />
            </Button>
            <DatePicker
              value={dayjs(selectedDate)}
              format={dateFormat}
              onChange={handleDateChange}
              allowClear={false}
              style={{ border: "none", width: 380, textAlign: "center" }}
              open={false}
              inputReadOnly
              suffixIcon={null}
              className="custom-date-picker"
            />
            <Button onClick={handleNextDay} style={{ border: "none" }}>
              <RightOutlined />
            </Button>
          </div>

          <List
            itemLayout="horizontal"
            dataSource={availableTimeSlots}
            locale={{
              emptyText: "There are no upcoming classes available on this day",
            }}
            renderItem={(item) => (
              <List.Item
                style={{ width: "300" }}
                actions={[<Button type="primary">Book now</Button>]}
              >
                <List.Item.Meta
                  title={item.timeRange}
                  description={item.duration}
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
                  <Space>
                    <ShopOutlined />
                    <Text>{listing?.website}</Text>
                  </Space>

                  <Space direction="horizontal">
                    <MailOutlined />

                    <Text>{listing?.email}</Text>
                  </Space>
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
