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
} from "antd";
import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import UserContext from "../UserContext";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Meta } = Card;

const Class = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  // Check if the selected date is today
  const isToday = dayjs(selectedDate).isSame(dayjs(), "day");
  const { state } = useLocation();
  const { listing } = state;
  console.log(listing);
  const { user } = useContext(UserContext);
  const dateFormat = "ddd, D MMM YYYY";
  const navigate = useNavigate();

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

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <div style={{ width: "100%", overflow: "hidden" }}>
        <Carousel autoplay>
          {listing?.images.map((imgUrl, index) => (
            <div key={index}>
              <Image
                alt={`carousel-${index}`}
                src={imgUrl}
                preview={false}
                style={{
                  width: "100%",
                  height: "400px",
                  objectFit: "cover",
                }}
              />
            </div>
          ))}
        </Carousel>
      </div>
      <Space direction="horizontal" style={{ width: "100%" }}>
        <Space direction="vertical" style={{ flex: 1 }}>
          <Title level={1}>{listing?.listing_title}</Title>
          <Text>{listing?.description}</Text>
          <Text>Package Types</Text>
          {listing?.package_types.map((type, index) => (
            <Text key={index}>{type}</Text>
          ))}
          {listing?.categories.map((category, index) => (
            <Tag key={index}>{category}</Tag>
          ))}
          {listing?.age_groups.map((age, index) => (
            <Text key={index}>{age}</Text>
          ))}
          <Text>Outlets: </Text>
          {listing?.string_outlet_schedules.map((schedule, index) => {
            const address = JSON.parse(schedule?.address)?.ADDRESS;
            return (
              <div key={index}>
                <Tag>{schedule?.nearest_mrt}</Tag>
                <Text>{address}</Text>
              </div>
            );
          })}

          <Title level={5}>Schedules</Title>
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
        </Space>
        <Card
          style={{
            width: 500,
            marginTop: 16,
            position: "sticky",
            top: "64px",
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
                  // TODO: pass partner instead of listing
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
      </Space>
    </Space>
  );
};

export default Class;
