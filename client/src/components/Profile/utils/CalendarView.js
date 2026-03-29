import React, { useState, useMemo } from "react";
import {
  Calendar,
  Modal,
  Button,
  Tag,
  Space,
  Typography,
  List,
  Empty,
  Card,
  Row,
  Col,
  Tooltip,
  message,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  MailOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import "./CalendarView.css";

dayjs.extend(isBetween);

const { Text, Title } = Typography;

const CalendarView = ({ bookings = [], onAddToEmail }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const bookingsByDate = useMemo(() => {
    const grouped = {};
    bookings.forEach((booking) => {
      const date = dayjs(booking.start_date).format("YYYY-MM-DD");
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(booking);
    });
    return grouped;
  }, [bookings]);

  const getListData = (value) => {
    const dateStr = value.format("YYYY-MM-DD");
    return bookingsByDate[dateStr] || [];
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    if (listData.length === 0) return null;

    return (
      <div className="calendar-events">
        {listData.slice(0, 2).map((booking) => (
          <div key={booking.booking_id} className="calendar-event-item">
            <Tag
              color={
                new Date(booking.start_date) < new Date()
                  ? "default"
                  : "green"
              }
              className="calendar-event-tag"
            >
              {booking.listing_title?.substring(0, 15)}
              {booking.listing_title?.length > 15 ? "..." : ""}
            </Tag>
          </div>
        ))}
        {listData.length > 2 && (
          <div className="calendar-more-events">
            +{listData.length - 2} more
          </div>
        )}
      </div>
    );
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const selectedDateBookings = useMemo(() => {
    if (!selectedDate) return [];
    const dateStr = selectedDate.format("YYYY-MM-DD");
    return (bookingsByDate[dateStr] || []).sort(
      (a, b) => new Date(a.start_date) - new Date(b.start_date)
    );
  }, [selectedDate, bookingsByDate]);

  const handleAddToEmail = (booking) => {
    const eventData = {
      title: booking.listing_title,
      start: new Date(booking.start_date),
      end: new Date(booking.end_date),
      description: `Class: ${booking.listing_title}\nPartner: ${booking.partner_name || "N/A"}\nChild: ${booking.child_name || "N/A"}`,
      location: booking.outlet_address || "TBD",
    };

    // Generate iCal format
    const icalContent = generateICalContent(eventData);

    // Download ICS file
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      `data:text/calendar;charset=utf-8,${encodeURIComponent(icalContent)}`
    );
    element.setAttribute(
      "download",
      `${booking.listing_title.replace(/\s+/g, "_")}.ics`
    );
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    if (onAddToEmail) {
      onAddToEmail(booking);
    }

    message.success(
      "Calendar event downloaded! You can import it to your email calendar."
    );
  };

  const generateICalContent = (event) => {
    const formatDate = (date) => {
      return dayjs(date).format("YYYYMMDDTHHmmss");
    };

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//juniorPASS//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
DTSTART:${formatDate(event.start)}
DTEND:${formatDate(event.end)}
DTSTAMP:${formatDate(new Date())}
UID:${event.title}-${formatDate(event.start)}@juniorpass.com
CREATED:${formatDate(new Date())}
DESCRIPTION:${event.description}
LOCATION:${event.location}
SUMMARY:${event.title}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;
  };

  const formatTime = (dateTimeString) => {
    return dayjs(dateTimeString).format("HH:mm");
  };

  return (
    <div className="calendar-view-container">
      <Card className="calendar-card" bordered={false}>
        <Title level={4} className="calendar-title">
          <CalendarOutlined /> Class Calendar
        </Title>
        <Calendar
          fullscreen={false}
          dateCellRender={dateCellRender}
          onSelect={handleDateSelect}
          className="custom-calendar"
        />
      </Card>

      <Modal
        title={
          selectedDate && (
            <Space>
              <CalendarOutlined />
              <span>
                Classes on {selectedDate.format("dddd, MMMM D, YYYY")}
              </span>
            </Space>
          )
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
        className="calendar-modal"
      >
        {selectedDateBookings.length === 0 ? (
          <Empty
            description="No classes scheduled for this date"
            style={{ marginTop: 48, marginBottom: 48 }}
          />
        ) : (
          <List
            dataSource={selectedDateBookings}
            renderItem={(booking) => {
              const isPast =
                new Date(booking.start_date) < new Date();
              return (
                <List.Item
                  key={booking.booking_id}
                  actions={[
                    <Tooltip title="Add to email calendar">
                      <Button
                        type="primary"
                        ghost
                        icon={<MailOutlined />}
                        size="small"
                        onClick={() => handleAddToEmail(booking)}
                      >
                        Add to Calendar
                      </Button>
                    </Tooltip>,
                  ]}
                  className={isPast ? "booking-item-past" : ""}
                >
                  <List.Item.Meta
                    title={
                      <Space>
                        <Text strong>{booking.listing_title}</Text>
                        <Tag
                          color={isPast ? "default" : "green"}
                        >
                          {isPast ? "Completed" : "Upcoming"}
                        </Tag>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size={4}>
                        <Space size="small">
                          <ClockCircleOutlined />
                          <Text type="secondary">
                            {formatTime(booking.start_date)} -{" "}
                            {formatTime(booking.end_date)}
                          </Text>
                        </Space>
                        <Text type="secondary" className="booking-child">
                          Child: {booking.child_name || "N/A"}
                        </Text>
                        <Text type="secondary" className="booking-partner">
                          Partner: {booking.partner_name || "N/A"}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              );
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default CalendarView;