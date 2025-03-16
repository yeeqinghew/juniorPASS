import React, { useEffect, useState } from "react";
import { FallOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Empty,
  Flex,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Typography,
} from "antd";
import { useUserContext } from "../UserContext";
import toast from "react-hot-toast";
import _ from "lodash";
import getBaseURL from "../../utils/config";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./Child.css";

const { Text, Title } = Typography;

const Child = () => {
  const baseURL = getBaseURL();
  const [children, setChildren] = useState([]);
  const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);
  const [isEditChildModalOpen, setIsEditChildModalOpen] = useState(false);
  const [addChildForm] = Form.useForm();
  const [editChildForm] = Form.useForm();
  const { user } = useUserContext();
  const [selectedChild, setSelectedChild] = useState(null);
  const [schedule, setSchedule] = useState([]);

  const handleCancel = () => {
    setIsAddChildModalOpen(false);
    setIsEditChildModalOpen(false);
  };

  const handleAddChild = () => {
    try {
      addChildForm.validateFields().then(async (values) => {
        const response = await fetch(`${baseURL}/children`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...values, parent_id: user?.user_id }),
        });

        const parseRes = await response.json();
        if (response.status === 201) {
          addChildForm.resetFields();
          toast.success(parseRes.message);
          setIsAddChildModalOpen(false);
          getChildren(); // Fetch the updated list of children
        }
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEditChild = () => {};

  const getChildren = async () => {
    try {
      const response = await fetch(`${baseURL}/children/${user?.user_id}`, {
        method: "GET",
      });
      const parseRes = await response.json();
      setChildren(parseRes);
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  const fetchChildSchedule = async (childId) => {
    try {
      const response = await fetch(`${baseURL}/children/${childId}/schedule`);
      const data = await response.json();
      setSchedule(data);
    } catch (error) {
      console.error("Error fetching schedule:", error);
    }
  };

  const getNextDayOfWeek = (dayName) => {
    const daysOfWeek = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };

    const today = new Date();
    const todayDayNumber = today.getDay();
    const targetDayNumber = daysOfWeek[dayName];

    let daysUntilNextTargetDay = targetDayNumber - todayDayNumber;
    if (daysUntilNextTargetDay < 0) {
      daysUntilNextTargetDay += 7;
    }

    const nextClassDate = new Date();
    nextClassDate.setDate(today.getDate() + daysUntilNextTargetDay);

    return nextClassDate.toISOString().split("T")[0];
  };

  const getListData = (value) => {
    const dateString = value.format("YYYY-MM-DD");

    return schedule
      .filter((classItem) => getNextDayOfWeek(classItem.day) === dateString)
      .map((classItem) => ({
        title: classItem.listing_title,
        time: `${classItem.class_time[0]} - ${classItem.class_time[1]}`,
        location: classItem.address.ADDRESS,
      }));
  };

  const generateWeeklyOccurrences = (dayName, time, weeks = 8) => {
    const daysOfWeek = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };

    const today = new Date();
    const todayDayNumber = today.getDay();
    const targetDayNumber = daysOfWeek[dayName];

    let daysUntilTargetDay = targetDayNumber - todayDayNumber;
    if (daysUntilTargetDay < 0) {
      daysUntilTargetDay += 7; // Move to the next week's occurrence
    }

    const occurrences = [];
    for (let i = 0; i < weeks; i++) {
      const classDate = new Date();
      classDate.setDate(today.getDate() + daysUntilTargetDay + i * 7);
      const dateStr = classDate.toISOString().split("T")[0];

      occurrences.push(`${dateStr}T${time}`);
    }

    return occurrences;
  };

  useEffect(() => {
    if (user) getChildren();
  }, [user?.user_id]);

  useEffect(() => {
    if (selectedChild) {
      fetchChildSchedule(selectedChild);
    }
  }, [selectedChild]);

  return (
    <>
      <Title level={4}>Children</Title>
      <Flex direction="column" gap={24} style={{ padding: "24px" }}>
        {/* children */}
        {_.isEmpty(children) ? (
          <Empty
            image={<PlusOutlined />}
            imageStyle={{ fontSize: "40px", color: "#1890ff" }}
            description={
              <span>
                <Text>
                  You do not have any child profile created. Click the button
                  below to add a new child.
                </Text>
              </span>
            }
          >
            <Button
              type="primary"
              onClick={() => {
                setIsAddChildModalOpen(true);
              }}
            >
              Add Child
            </Button>
          </Empty>
        ) : (
          <Space direction="vertical">
            <Text strong>
              These are your children. Click on your child's name to check their
              progress
            </Text>
            <Flex direction="row" gap={16} wrap="wrap">
              <Space direction="horizontal" size="large">
                {children.map((child, index) => (
                  <Avatar
                    key={child.child_id}
                    size={100}
                    src={require(`../../images/profile/${
                      child.gender === "F" ? "girls" : "boys"
                    }/${child.gender === "F" ? "girl" : "boy"}${index}.png`)}
                    onClick={() => {
                      editChildForm.setFieldsValue({
                        name: child.name,
                        age: child.age,
                        gender: child.gender,
                      });
                      setIsEditChildModalOpen(true);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {child.name}
                  </Avatar>
                ))}

                {/* CTA button in toolbar */}
                <Avatar
                  size={100}
                  icon={<PlusOutlined />}
                  style={{
                    cursor: "pointer",
                    border: "1px dashed #1890ff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onClick={() => {
                    setIsAddChildModalOpen(true);
                  }}
                />
              </Space>
            </Flex>
          </Space>
        )}
      </Flex>

      {/* Classes section */}
      {/* <Flex style={{ marginBottom: "24px" }}>
        <Title level={4}>Classes</Title>
      </Flex> */}

      <Flex
        style={{
          marginBottom: "24px",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={4}>Classes</Title>

        {/* Child selection dropdown (aligned to right) */}
        <Select
          style={{ width: 200 }}
          onChange={(childId) => {
            setSelectedChild(childId);
            fetchChildSchedule(childId);
          }}
          placeholder="Select Child"
        >
          {children.map((child) => (
            <Select.Option key={child.child_id} value={child.child_id}>
              {child.name}
            </Select.Option>
          ))}
        </Select>
      </Flex>

      {selectedChild && (
        <FullCalendar
          plugins={[timeGridPlugin, dayGridPlugin]}
          initialView="timeGridWeek" // Shows a weekly vertical schedule
          allDaySlot={false}
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "timeGridWeek,dayGridMonth", // Allows switching between week & month views
          }}
          events={schedule.flatMap((classItem) =>
            generateWeeklyOccurrences(
              classItem.day,
              classItem.class_time[0]
            ).map((startTime) => {
              const endTime = new Date(startTime);
              const [startHour, startMin] = classItem.class_time[0]
                .split(":")
                .map(Number);
              const [endHour, endMin] = classItem.class_time[1]
                .split(":")
                .map(Number);
              endTime.setHours(endHour, endMin);

              return {
                title: `${classItem.listing_title} (S${classItem.postal_code})`,
                start: startTime,
                end: endTime.toISOString(),
              };
            })
          )}
          slotMinTime="08:00:00" // Customize start time (e.g., 8 AM)
          slotMaxTime="22:00:00" // Customize end time (e.g., 10 PM)
          height="auto"
        />
      )}

      {/* Add child modal */}
      <Modal
        title="Add a new child"
        open={isAddChildModalOpen}
        onCancel={handleCancel}
        centered
        style={{
          borderRadius: "18px",
        }}
        footer={
          <Button
            form="addChildForm"
            key="submit"
            htmlType="submit"
            onClick={handleAddChild}
          >
            Add
          </Button>
        }
      >
        <Form form={addChildForm} autoComplete="off" layout="vertical">
          <Form.Item
            name="name"
            label="Child's Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="age" label="Age" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
            <Select
              options={[
                {
                  value: "F",
                  label: "Female",
                },
                {
                  value: "M",
                  label: "Male",
                },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit child modal */}
      <Modal
        title="Edit child"
        open={isEditChildModalOpen}
        onCancel={handleCancel}
        centered
        style={{
          borderRadius: "18px",
        }}
        footer={
          <Button
            form="editChildForm"
            key="submit"
            htmlType="submit"
            onClick={handleEditChild}
          >
            Save changes
          </Button>
        }
        // TODO: Delete child
      >
        <Form form={editChildForm} autoComplete="off" layout="vertical">
          <Form.Item
            name="name"
            label="Child's Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="age" label="Age" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
            <Select
              options={[
                {
                  value: "F",
                  label: "Female",
                },
                {
                  value: "M",
                  label: "Male",
                },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Child;
