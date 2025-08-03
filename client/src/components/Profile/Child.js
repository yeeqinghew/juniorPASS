import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
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
import rrulePlugin from "@fullcalendar/rrule";
import { RRule } from "rrule";

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

  const calculateDuration = ([start, end]) => {
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    const hours = eh - sh;
    const minutes = em - sm;
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  };

  const dayMap = {
    Sunday: RRule.SU,
    Monday: RRule.MO,
    Tuesday: RRule.TU,
    Wednesday: RRule.WE,
    Thursday: RRule.TH,
    Friday: RRule.FR,
    Saturday: RRule.SA,
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
        <div className="calendar-wrapper">
          <FullCalendar
            plugins={[timeGridPlugin, dayGridPlugin, rrulePlugin]}
            initialView="timeGridWeek"
            allDaySlot={false}
            headerToolbar={{
              left: "prev,next",
              center: "title",
              right: "timeGridWeek,dayGridMonth",
            }}
            events={schedule
              .filter((item) => item.active)
              .map((item) => ({
                title: `${item.listing_title} (S${item.postal_code})`,
                rrule: {
                  freq: RRule.WEEKLY,
                  byweekday: [dayMap[item.day]],
                  dtstart: `${getNextDayOfWeek(item.day)}T${
                    item.class_time[0]
                  }:00`,
                },
                duration: calculateDuration(item.class_time),
              }))}
            slotMinTime="08:00:00"
            slotMaxTime="23:00:00"
            slotDuration="00:30:00"
            slotLabelInterval="01:00"
            height="100%"
            eventDidMount={(info) => {
              const time = info.timeText;
              const title = info.event.title;
              info.el.setAttribute("title", `${time}\n${title}`);
            }}
          />
        </div>
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
