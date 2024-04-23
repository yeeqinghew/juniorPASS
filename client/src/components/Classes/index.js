import React, { useEffect, useMemo, useState } from "react";
import { Space, Input, List, Flex, Rate, Image } from "antd";
import { SearchOutlined, EnvironmentTwoTone } from "@ant-design/icons";
import Map, {
  Marker,
  Popup,
  NavigationControl,
  GeolocateControl,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useNavigate } from "react-router-dom";

const Classes = () => {
  const [popupInfo, setPopupInfo] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [filterInput, setFilterInput] = useState(null);
  const navigate = useNavigate();

  const getVendors = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/listing/getAllListings"
      );
      const jsonData = await response.json();
      setVendors(jsonData);
    } catch (error) {
      console.error(error.message);
    }
  };

  // Function to parse PostgreSQL array string to array
  const parseArrayString = (arrayString) => {
    // Remove curly brackets and split the string by commas
    const trimmedString = arrayString.replace(/[{}]/g, "");
    const arrayValues = trimmedString.split(",");
    // Trim whitespace from each value and return the array
    const returnArray = arrayValues.map((value) => value.trim());
    return returnArray;
  };

  const parsedListings = vendors.map((listing) => {
    return {
      ...listing,
      category: parseArrayString(listing.category),
      package_types: parseArrayString(listing.package_types),
      age_group: parseArrayString(listing.age_group),
    };
  });

  const pins = useMemo(() => {
    return vendors.map((listing) => {
      const color =
        "#" + (Math.random().toString(16) + "000000").substring(2, 8);
      return listing.string_outlet_schedules.map((outlet, index) => {
        return (
          <Marker
            key={`${listing.listing_id}-${index}`}
            longitude={outlet.address.LONGITUDE}
            latitude={outlet.address.LATITUDE}
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
  }, [vendors]);

  const onSearch = (e) => {
    const filteredData = vendors.filter((item) => {
      return Object.keys(item).some((key) => {
        return String(item[key])
          .toLowerCase()
          .includes(e.target.value.toLowerCase());
      });
    });
    setFilterInput(filteredData);
  };

  useEffect(() => {
    getVendors();
  }, []);

  const handleListHover = (listingId) => {
    // Find the listing with the matching listingId
    const listing = vendors.find((listing) => listing.listing_id === listingId);
    if (listing) {
      // Set popupInfo to the details of the listing
      setPopupInfo(listing);
    }
  };

  const handleListLeave = () => {
    setPopupInfo(null); // Clear popupInfo when leaving the list item
  };

  return (
    <>
      <Input
        size="large"
        allowClear
        onChange={onSearch}
        style={{
          margin: "0 auto",
          padding: "0 1.6rem",
          borderRadius: "0.7rem",
          height: "3rem",
        }}
        prefix={<SearchOutlined />}
        placeholder="Search by location, classes, category"
      />

      <Flex justify="space-between" style={{ margin: "24px 0" }}>
        <List
          itemLayout="horizontal"
          dataSource={filterInput == null ? parsedListings : filterInput}
          style={{
            width: "40vw",
          }}
          size="large"
          pagination={{
            position: "bottom",
            align: "end",
            pageSize: "2",
          }}
          renderItem={(item, index) => (
            <List.Item
              key={index}
              onClick={(e) => {
                navigate(`/class/${item.vendor_id}`, {
                  state: {
                    item,
                  },
                });
              }}
              onMouseEnter={() => handleListHover(item.listing_id)}
              onMouseLeave={handleListLeave}
            >
              <List.Item.Meta
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                avatar={<Image src={item?.image} width={240} preview={false} />}
                title={
                  <Space direction="vertical">
                    <>{item?.category}</>
                    <a href={item?.website}>{item?.listing_title}</a>
                  </Space>
                }
                description={
                  <Space direction="vertical">
                    {item.description}
                    <Space>
                      <Image
                        src={require("../../images/location.png")}
                        width={24}
                        height={24}
                        preview={false}
                      />
                      {item.region}
                    </Space>
                    <Space>
                      <Image
                        src={require("../../images/graduation-hat.png")}
                        width={24}
                        height={24}
                        preview={false}
                      />
                      {item.age_group}
                    </Space>

                    {/* TODO: if review is null, it should be shown none */}
                    <Rate disabled defaultValue={item.reviews}></Rate>
                  </Space>
                }
              ></List.Item.Meta>
            </List.Item>
          )}
        ></List>

        <Map
          initialViewState={{
            longitude: 103.8189,
            latitude: 1.3069,
            zoom: 10,
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
                longitude={outlet.address.LONGITUDE}
                latitude={outlet.address.LATITUDE}
                onClose={() => setPopupInfo(null)}
              >
                <div>
                  {/* <a target="_new" href={popupInfo.website}> */}
                  {popupInfo.listing_title}
                  {outlet.address.SEARCHVAL}
                  {/* </a> */}
                </div>
                {/* <img width="100%" src={popupInfo.image} /> */}
              </Popup>
            ))}
        </Map>
      </Flex>
    </>
  );
};

export default Classes;
