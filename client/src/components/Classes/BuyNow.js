import React from "react";
import { Modal, Select, Space, Typography } from "antd";
import "./index.css";
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
      title={"Buy now"}
      open={isBuyNowModalOpen}
      onCancel={handleCancel}
      centered
      style={{
        borderRadius: "18px",
      }}
    >
      <Space direction="vertical">
        <Text>Available credit: $ {user?.credit}</Text>
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
        {/* Info about the class */}
        <Space direction="horizontal">
          <Text>Location:</Text>
          <Text>
            {selected &&
              JSON.parse(selected?.location?.outlet_address)?.SEARCHVAL}
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
  );
};

export default BuyNow;
