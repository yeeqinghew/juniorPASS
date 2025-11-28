import React from "react";
import { Modal, Select, Space, Typography } from "antd";
import { 
  EnvironmentOutlined, 
  ClockCircleOutlined, 
  CalendarOutlined,
  DollarOutlined 
} from "@ant-design/icons";
import "./BuyNow.css";
import Map, { Marker } from "react-map-gl";

const { Text } = Typography;

const BuyNow = ({
  isBuyNowModalOpen,
  setIsBuyNowModalOpen,
  selected,
  user,
  children,
}) => {
  const handleCancel = () => {
    setIsBuyNowModalOpen(false);
  };

  return (
    <Modal
      title="Book Your Class"
      open={isBuyNowModalOpen}
      onCancel={handleCancel}
      centered
      className="buynow-modal"
      okText="Confirm Booking"
      cancelText="Cancel"
      width={600}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        {/* Credit Display */}
        <div className="credit-display">
          <DollarOutlined className="info-icon" />
          <Text>Available Credit:</Text>
          <Text className="credit-amount">$ {user?.credit}</Text>
        </div>

        {/* Select child */}
        <div>
          <Text strong style={{ display: "block", marginBottom: "8px", color: "#64748b" }}>
            Select Child
          </Text>
          <Select
            placeholder="Choose which child will attend this class"
            style={{ width: "100%" }}
            size="large"
          >
            {children.map((child) => (
              <Select.Option key={child?.child_id} value={child?.child_id}>
                {child.name}
              </Select.Option>
            ))}
          </Select>
        </div>

        {/* Map */}
        <div className="buynow-map-container">
          <Map
            mapStyle="mapbox://styles/mapbox/streets-v8"
            mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
            initialViewState={{
              longitude:
                selected &&
                JSON.parse(selected?.location?.outlet_address)?.LONGITUDE,
              latitude:
                selected &&
                JSON.parse(selected?.location?.outlet_address)?.LATITUDE,
              zoom: 15,
            }}
            style={{
              width: "100%",
              height: "200px",
            }}
            mapLib={import("mapbox-gl")}
            scrollZoom={false}
            dragPan={false}
          >
            <Marker
              longitude={
                selected &&
                JSON.parse(selected?.location?.outlet_address)?.LONGITUDE
              }
              latitude={
                selected &&
                JSON.parse(selected?.location?.outlet_address)?.LATITUDE
              }
              anchor="top"
            ></Marker>
          </Map>
        </div>

        {/* Class Information Cards */}
        <div className="class-info-card">
          <div className="class-info-row">
            <EnvironmentOutlined className="info-icon" />
            <Text className="class-info-label">Location:</Text>
            <Text className="class-info-value">
              {selected &&
                JSON.parse(selected?.location?.outlet_address)?.SEARCHVAL}
            </Text>
          </div>

          <div className="class-info-row">
            <ClockCircleOutlined className="info-icon" />
            <Text className="class-info-label">Time:</Text>
            <Text className="class-info-value">{selected?.timeRange}</Text>
          </div>

          <div className="class-info-row">
            <CalendarOutlined className="info-icon" />
            <Text className="class-info-label">Duration:</Text>
            <Text className="class-info-value">{selected?.duration}</Text>
          </div>
        </div>
      </Space>
    </Modal>
  );
};

export default BuyNow;
