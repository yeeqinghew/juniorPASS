import React, { useEffect, useMemo, useState } from "react";
import {
  Space,
  Input,
  List,
  Rate,
  Image,
  Typography,
  Tag,
  Divider,
  Button,
} from "antd";
import {
  SearchOutlined,
  EnvironmentTwoTone,
  DownOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import Map, {
  Marker,
  Popup,
  NavigationControl,
  GeolocateControl,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useNavigate } from "react-router-dom";
import getBaseURL from "../../utils/config";
import useParseListings from "../../hooks/useParseListings";

const { Text } = Typography;

const Classes = () => {
  const baseURL = getBaseURL();
  const [popupInfo, setPopupInfo] = useState(null);
  const [listings, setListings] = useState([]);
  const [filterInput, setFilterInput] = useState(null);
  const parseListings = useParseListings();
  const navigate = useNavigate();

  const getListings = async () => {
    try {
      const response = await fetch(`${baseURL}/listings`);
      const jsonData = await response.json();
      const parsedListings = parseListings(jsonData);
      setListings(parsedListings);
    } catch (error) {
      console.error(error.message);
    }
  };

  const pins = useMemo(() => {
    return listings.map((listing) => {
      const color = "#98BDD2";
      return listing?.string_outlet_schedules.map((outlet, index) => {
        const parsedAddress = JSON.parse(outlet?.address);
        return (
          <Marker
            key={`${listing?.listing_id}-${index}`}
            longitude={parsedAddress.LONGITUDE}
            latitude={parsedAddress.LATITUDE}
            anchor="top"
            onClick={(e) => {
              // If we let the click event propagates to the map, it will immediately close the popup
              // with `closeOnClick: true`
              e.originalEvent.stopPropagation();
              setPopupInfo(listing);
            }}
          >
            <EnvironmentTwoTone
              twoToneColor={color}
              style={{
                fontSize: "36px",
              }}
            />
          </Marker>
        );
      });
    });
  }, [listings]);

  const onSearch = (e) => {
    const filteredData = listings.filter((item) => {
      return Object.keys(item).some((key) => {
        return String(item[key])
          .toLowerCase()
          .includes(e.target.value.toLowerCase());
      });
    });
    setFilterInput(filteredData);
  };

  useEffect(() => {
    getListings();
  }, []);

  const handleListHover = (listingId) => {
    // Find the listing with the matching listingId
    const listing = listings.find(
      (listing) => listing?.listing_id === listingId
    );
    if (listing) {
      // Set popupInfo to the details of the listing
      setPopupInfo(listing);
    }
  };

  const handleListLeave = () => {
    setPopupInfo(null); // Clear popupInfo when leaving the list item
  };

  // TODO: if listing is created less than 7 days, get a NEW tag

  return (
    <Space direction="vertical">
      <Input
        size="large"
        allowClear
        onChange={onSearch}
        style={{
          margin: "12px auto",
          padding: "0 1.6rem",
          borderRadius: "0.7rem",
          height: "3rem",
        }}
        prefix={<SearchOutlined />}
        placeholder="Search by location, classes, category"
      />
      <Space direction="horizontal" size={"large"}>
        <Space direction="horizontal">
          <Text>Categories</Text>
          <DownOutlined />
        </Space>
        <Space direction="horizontal">
          <Text>Age groups</Text>
          <DownOutlined />
        </Space>
        <Space direction="horizontal">
          <Text>Package types</Text>
          <DownOutlined />
        </Space>
      </Space>
      <Space direction="horizontal">
        <Button block>
          Clear All <CloseOutlined />
        </Button>
      </Space>
      <Divider />

      <div style={{ display: "flex" }}>
        <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
          <List
            itemLayout="horizontal"
            dataSource={filterInput == null ? listings : filterInput}
            style={{
              width: "40vw",
            }}
            size="large"
            pagination={{
              position: "bottom",
              align: "end",
              pageSize: "10.5",
            }}
            renderItem={(listing, index) => (
              <List.Item
                key={index}
                onClick={() => {
                  navigate(`/class/${listing?.listing_id}`, {
                    state: {
                      listing,
                    },
                  });
                }}
                onMouseEnter={() => handleListHover(listing?.listing_id)}
                onMouseLeave={handleListLeave}
              >
                <List.Item.Meta
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  avatar={
                    <Image
                      src={listing?.images[0]}
                      width={240}
                      preview={false}
                    />
                  }
                  title={
                    <Space direction="vertical">
                      <Space direction="horizontal">
                        {listing?.categories.map((category, index) => {
                          return <Tag key={index}>{category}</Tag>;
                        })}
                      </Space>
                      <a href={listing?.website}>{listing?.listing_title}</a>
                    </Space>
                  }
                  description={
                    <Space direction="vertical">
                      <div
                        style={{
                          display: "-webkit-box",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxHeight: "5em",
                          lineClamp: 3,
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {listing?.description}
                      </div>

                      <Space>
                        <Image
                          src={require("../../images/graduation-hat.png")}
                          width={24}
                          height={24}
                          preview={false}
                        />
                        {listing?.age_groups}
                      </Space>

                      {listing?.rating !== 0 && (
                        <Rate disabled defaultValue={listing?.reviews}></Rate>
                      )}
                    </Space>
                  }
                ></List.Item.Meta>
              </List.Item>
            )}
          ></List>
        </div>

        <div style={{ height: "70vh" }}>
          <Map
            className={"map"}
            initialViewState={{
              longitude: 103.8189,
              latitude: 1.3069,
              zoom: 11,
            }}
            mapStyle="mapbox://styles/mapbox/streets-v8"
            mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
            style={{
              width: "40vw",
              height: "70vh",
            }}
            mapLib={import("mapbox-gl")}
          >
            <GeolocateControl position="top-left" />
            <NavigationControl position="top-left" />
            {pins}

            {/* Display popups for popupInfo */}
            {popupInfo &&
              popupInfo.string_outlet_schedules.map((outlet, index) => (
                <Popup
                  key={`${popupInfo.listing_id}-${index}`}
                  longitude={JSON.parse(outlet.address).LONGITUDE}
                  latitude={JSON.parse(outlet.address).LATITUDE}
                  onClose={() => setPopupInfo(null)}
                >
                  <Space direction="vertical">
                    {/* <a target="_new" href={popupInfo.website}> */}
                    {popupInfo?.listing_title}
                    {JSON.parse(outlet.address).SEARCHVAL}
                    {/* </a> */}
                    <img width="100%" src={popupInfo.images[0]} />
                  </Space>
                </Popup>
              ))}
          </Map>
        </div>
      </div>
    </Space>
  );
};

export default Classes;
