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
  Dropdown,
  Checkbox,
  Menu,
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

const Classes = () => {
  const baseURL = getBaseURL();
  const [popupInfo, setPopupInfo] = useState(null);
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ageGroups, setAgeGroups] = useState([]);
  const [packageTypes, setPackageTypes] = useState([]);
  const [filterInput, setFilterInput] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedAgeGroups, setSelectedAgeGroups] = useState([]);
  const [selectedPackageTypes, setSelectedPackageTypes] = useState([]);
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

  const getCategories = async () => {
    try {
      const response = await fetch(`${baseURL}/misc/getAllCategories`);
      const jsonData = await response.json();
      setCategories(jsonData);
    } catch (error) {
      console.error(error.message);
    }
  };

  const getAgeGroups = async () => {
    try {
      const response = await fetch(`${baseURL}/misc/getAllAgeGroups`);
      const jsonData = await response.json();
      setAgeGroups(jsonData);
    } catch (error) {
      console.error(error.message);
    }
  };

  const getAgeGroupLabel = (min_age, max_age) => {
    if (max_age === null) {
      return `above ${min_age} years old`;
    }
    return `${min_age}-${max_age} years old`;
  };

  const getPackageTypes = async () => {
    try {
      const response = await fetch(`${baseURL}/misc/getAllPackages`);
      const jsonData = await response.json();
      setPackageTypes(jsonData);
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

  const handleCategoryChange = (category) => {
    setSelectedCategories((prevCategories) =>
      prevCategories.includes(category.name)
        ? prevCategories.filter((item) => item !== category.name)
        : [...prevCategories, category.name]
    );
  };

  const handleAgeGroupChange = (ageGroup) => {
    setSelectedAgeGroups((prevAgeGroups) =>
      prevAgeGroups.includes(ageGroup)
        ? prevAgeGroups.filter((item) => item !== ageGroup)
        : [...prevAgeGroups, ageGroup]
    );
  };

  const handlePackageTypeChange = (packageType) => {
    setSelectedPackageTypes((prevSelected) => {
      if (prevSelected.includes(packageType.package_type)) {
        return prevSelected.filter((type) => type !== packageType.package_type);
      } else {
        return [...prevSelected, packageType.package_type];
      }
    });
  };

  const applyFilters = (listings) => {
    console.log(listings);
    console.log(selectedCategories);
    console.log(selectedAgeGroups);
    console.log(selectedPackageTypes);

    return listings.filter((listing) => {
      // Check if the listing matches the selected categories
      const matchesCategory =
        selectedCategories.length === 0 || // If no categories are selected, include all
        listing.categories.some((category) =>
          selectedCategories.includes(category)
        );

      // Check if the listing matches the selected age groups
      const matchesAgeGroup =
        selectedAgeGroups.length === 0 || // If no age groups are selected, include all
        listing.age_groups.some((ageGroup) =>
          selectedAgeGroups.includes(ageGroup)
        );

      // Check if the listing matches the selected package types
      const matchesPackageType =
        selectedPackageTypes.length === 0 || // If no package types are selected, include all
        listing.package_types.some((type) =>
          selectedPackageTypes.includes(type)
        );

      // Return only listings that match all filters
      return matchesCategory && matchesAgeGroup && matchesPackageType;
    });
  };

  const onSearch = (e) => {
    const filteredData = listings.filter((item) => {
      return Object.keys(item).some((key) => {
        return String(item[key])
          .toLowerCase()
          .includes(e.target.value.toLowerCase());
      });
    });
    setFilterInput(applyFilters(filteredData));
  };

  useEffect(() => {
    getListings();
    getCategories();
    getAgeGroups();
    getPackageTypes();
  }, []);

  useEffect(() => {
    setFilterInput(applyFilters(listings));
  }, [listings, selectedCategories, selectedAgeGroups, selectedPackageTypes]);

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
          {/* Categories Filter */}
          <Dropdown
            overlay={
              <Menu>
                {categories.map((category) => (
                  <Menu.Item
                    key={category.id}
                    onClick={() => handleCategoryChange(category)}
                  >
                    <Checkbox
                      checked={selectedCategories.includes(category.name)}
                    >
                      {category.name}
                    </Checkbox>
                  </Menu.Item>
                ))}
              </Menu>
            }
          >
            <Button>
              Categories <DownOutlined />
            </Button>
          </Dropdown>
        </Space>
        <Space direction="horizontal">
          <Dropdown
            overlay={
              <Menu>
                {ageGroups.map((ageGroup) => (
                  <Menu.Item
                    key={ageGroup.id}
                    onClick={() =>
                      handleAgeGroupChange(
                        getAgeGroupLabel(ageGroup.min_age, ageGroup.max_age)
                      )
                    }
                  >
                    <Checkbox
                      checked={selectedAgeGroups.includes(
                        getAgeGroupLabel(ageGroup.min_age, ageGroup.max_age)
                      )}
                    >
                      {getAgeGroupLabel(ageGroup.min_age, ageGroup.max_age)}
                    </Checkbox>
                  </Menu.Item>
                ))}
              </Menu>
            }
          >
            <Button>
              Age groups <DownOutlined />
            </Button>
          </Dropdown>
        </Space>
        <Space direction="horizontal">
          {/* Package Types Filter */}
          <Dropdown
            overlay={
              <Menu>
                {packageTypes.map((packageType) => (
                  <Menu.Item
                    key={packageType.id}
                    onClick={() => handlePackageTypeChange(packageType)}
                  >
                    <Checkbox
                      checked={selectedPackageTypes.includes(
                        packageType.package_type
                      )}
                    >
                      {packageType.name}
                    </Checkbox>
                  </Menu.Item>
                ))}
              </Menu>
            }
          >
            <Button>
              Package types <DownOutlined />
            </Button>
          </Dropdown>
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
