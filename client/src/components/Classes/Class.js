import {
  Avatar,
  Button,
  Card,
  DatePicker,
  Flex,
  Image,
  Space,
  Tag,
  Typography,
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

  const handleDateChange = (dates, dateStrings) => {
    setSelectedDate(dateStrings);
  };

  const handleNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(selectedDate.getDate() + 1);
    setSelectedDate(nextDay);
  };

  const handlePreviousDay = () => {
    const previousDay = new Date(selectedDate);
    previousDay.setDate(selectedDate.getDate() - 1);
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
    <Flex direction="horizontal">
      <Flex vertical>
        <Image
          src={listing?.image}
          preview={false}
          style={{
            width: "500px",
          }}
        />
        <Flex direction={"horizontal"}>
          <Space direction={"vertical"}>
            <Title level={1}>{listing?.listing_title}</Title>
            <Text>{listing?.description}</Text>
            <Text>Pacakage Types</Text>
            {listing?.package_types.map((type) => {
              return <Text>{type}</Text>;
            })}
            {listing?.categories.map((category) => {
              return <Tag>{category}</Tag>;
            })}
            {listing?.age_groups.map((age) => {
              return <Text>{age}</Text>;
            })}
            <Text>Outlets: </Text>
            {listing?.string_outlet_schedules.map((listing) => {
              return (
                <>
                  <Tag>{listing?.nearest_mrt}</Tag>
                  <Text>{listing?.address?.ADDRESS}</Text>
                </>
              );
            })}

            <Title level={5}>Schedules</Title>
            <div>
              {/* TODO: disable this if <  */}
              <Button onClick={handlePreviousDay} disabled={isToday}>
                <LeftOutlined />
              </Button>
              <DatePicker
                value={dayjs(selectedDate)}
                minDate={dayjs(selectedDate)}
                format={dateFormat}
                onChange={handleDateChange}
                allowClear={false}
              />
              <Button onClick={handleNextDay}>
                <RightOutlined />
              </Button>
            </div>
          </Space>
        </Flex>
      </Flex>
      <Card
        style={{
          width: 500,
          marginTop: 16,
          position: "sticky",
          top: "64px",
          zIndex: "10000",
          height: "200px",
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
    </Flex>
  );
};

export default Class;
