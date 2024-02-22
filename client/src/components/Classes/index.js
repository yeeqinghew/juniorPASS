import React, { useEffect, useState, useMemo } from "react";
import { Avatar, Input, List, Flex, Rate } from "antd";
// import ReactMapboxGl, { Layer, Feature, Marker } from "react-mapbox-gl";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
const { Search } = Input;

const Classes = () => {
  const [popupInfo, setPopupInfo] = useState(null);
  const [vendors, setVendors] = useState([]);
  const getVendors = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/vendors/getAllVendors"
      );
      const jsonData = await response.json();
      setVendors(jsonData);
    } catch (error) {
      console.error(error.message);
    }
  };

  const pins = useMemo(
    () =>
      vendors.map((city, index) => (
        <Marker
          key={`marker-${index}`}
          longitude={city.longitude}
          latitude={city.latitude}
          anchor="top"
          onClick={(e) => {
            // If we let the click event propagates to the map, it will immediately close the popup
            // with `closeOnClick: true`
            e.originalEvent.stopPropagation();
            setPopupInfo(city);
          }}
        ></Marker>
      )),
    [vendors]
  );

  const onSearch = (value, _e, info) => console.log(info?.source, value);

  useEffect(() => {
    getVendors();
  }, []);

  return (
    <>
      <Search
        placeholder="input search text"
        allowClear
        onSearch={onSearch}
        style={{ width: "100vw" }}
      />
      <Flex justify="space-between">
        <List
          itemLayout="horizontal"
          dataSource={vendors}
          style={{
            width: "40%",
          }}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={item.picture} />}
                title={<a href={item.website}>{item.vendor_name}</a>}
                description={item.description}
              ></List.Item.Meta>
              <Rate disabled defaultValue={item.reviews}></Rate>
            </List.Item>
          )}
        ></List>
        <Map
          initialViewState={{
            longitude: 103.8189,
            latitude: 1.3069,
            zoom: 10,
          }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          style={{ width: 600, height: 400 }}
          mapLib={import("mapbox-gl")}
        >
          {pins}

          {popupInfo && (
            <Popup
              anchor="top"
              longitude={Number(popupInfo.longitude)}
              latitude={Number(popupInfo.latitude)}
              onClose={() => setPopupInfo(null)}
            >
              <div>
                {popupInfo.vendor_name}
                <a target="_new" href={``}></a>
              </div>
              <img width="100%" src={popupInfo.picture} />
            </Popup>
          )}
        </Map>
      </Flex>
    </>
  );
};

export default Classes;
