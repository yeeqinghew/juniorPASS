import React, { useEffect, useState, useMemo } from "react";
import { Avatar, Input, List, Flex, Rate } from "antd";
// import ReactMapboxGl, { Layer, Feature, Marker } from "react-mapbox-gl";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import CITIES from "./cities.json";
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

  const geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: { type: "Point", coordinates: [103.9884945, 1.35601825] },
      },
    ],
  };

  const pins = useMemo(
    () =>
      CITIES.map((city, index) => (
        <Marker
          key={`marker-${index}`}
          longitude={city.longitude}
          latitude={city.latitude}
          anchor="bottom"
          onClick={(e) => {
            // If we let the click event propagates to the map, it will immediately close the popup
            // with `closeOnClick: true`
            e.originalEvent.stopPropagation();
            setPopupInfo(city);
          }}
        ></Marker>
      )),
    []
  );

  const layerStyle = {
    id: "point",
    type: "circle",
    paint: {
      "circle-radius": 10,
      "circle-color": "#007cbf",
    },
  };

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
              <Rate defaultValue={item.reviews}></Rate>
            </List.Item>
          )}
        ></List>
        {/* <Map
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          mapLib={import("mapbox-gl")}
          initialViewState={{
            longitude: 103.9884945,
            latitude: 1.35601825,
            zoom: 3.5,
            bearing: 0,
            pitch: 0,
          }}
          style={{ width: 600, height: 400 }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
        > */}
        {/* <Marker
            longitude={103.8189}
            latitude={1.3069}
            type="symbol"
            id="marker"
            layout={{ "icon-image": "marker-15" }}
            onClick={() => {
              setShowPopup(true);
            }}
          >
            {showPopup && (
              <Popup
                longitude={103.8189}
                latitude={1.3069}
                onClose={() => setShowPopup(false)}
              >
                vbleh
              </Popup>
            )}
          </Marker>
           */}
        {/* <Source id="my-data" type="geojson" data={geojson}>
            <Layer {...layerStyle} onClick={mapOnClick} />
          </Source>
        </Map> */}

        <Map
          initialViewState={{
            longitude: 103.8189,
            latitude: 1.3069,
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
                {popupInfo.city}, {popupInfo.state}
                <a
                  target="_new"
                  href={`http://en.wikipedia.org/w/index.php?title=Special:Search&search=${popupInfo.city}, ${popupInfo.state}`}
                ></a>
              </div>
              <img width="100%" src={popupInfo.image} />
            </Popup>
          )}
        </Map>
      </Flex>
    </>
  );
};

export default Classes;
