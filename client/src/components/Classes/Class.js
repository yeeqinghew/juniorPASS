import { Button, DatePicker, Flex, Image, Space, Tag, Typography } from "antd";
import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import UserContext from "../UserContext";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const _ = require("lodash");

const Class = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { state } = useLocation();
  const { listing } = state;
  console.log(listing);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const dateFormat = "ddd, D MMM YYYY";

  const handleGoBackButton = () => {
    return navigate(-1);
  };

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

  return (
    <Flex vertical>
      <Flex
        style={{
          alignItems: "center",
          padding: "24px",
        }}
      >
        <LeftOutlined
          onClick={handleGoBackButton}
          style={{
            fontSize: "24px",
          }}
        />
        <Title lev={1}>{listing?.listing_title}</Title>
      </Flex>
      <Image
        src={listing?.image}
        preview={false}
        style={{
          width: "500px",
        }}
      />
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
          <LeftOutlined onClick={handlePreviousDay} />
          <DatePicker
            value={dayjs(selectedDate)}
            minDate={dayjs(selectedDate)}
            format={dateFormat}
            onChange={handleDateChange}
          />
          <RightOutlined onClick={handleNextDay} />
        </div>
      </Space>

      {!_.isEmpty(user) && (
        <Button>
          <i class="fa fa-plus" aria-hidden="true">
            Add to cart
          </i>
        </Button>
      )}
    </Flex>
  );
};

export default Class;
