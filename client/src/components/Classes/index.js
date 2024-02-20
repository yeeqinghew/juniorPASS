import React, { useEffect, useState } from "react";
import { Avatar, Input, List, Flex, Rate } from "antd";
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const { Search } = Input;

const onSearch = (value, _e, info) => console.log(info?.source, value);
const data = [
  {
    title: "Ant Design Title 1",
  },
  {
    title: "Ant Design Title 2",
  },
  {
    title: "Ant Design Title 3",
  },
  {
    title: "Ant Design Title 4",
  },
];

const Classes = () => {
  const [vendors, setVendors] = useState([]);
  const getVendors = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/vendors/getAllVendors"
      );
      const jsonData = await response.json();
      setVendors(jsonData);
      console.log(jsonData);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getVendors();
  }, []);

  const Map = ReactMapboxGl({
    accessToken: process.env.REACT_APP_MAPBOX_TOKEN,
    center: [1.35601825, 103.9884945],
  });

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
                title={<a href="https://ant.design">{item.vendor_name}</a>}
                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
              ></List.Item.Meta>
              <Rate defaultValue={item.reviews}></Rate>
            </List.Item>
          )}
        ></List>
        <Map
          style="mapbox://styles/mapbox/streets-v9"
          containerStyle={{
            // height: "100vh",
            width: "60%",
          }}
        >
          <Layer
            type="symbol"
            id="marker"
            layout={{ "icon-image": "marker-15" }}
          >
            <Feature coordinates={[103.9884945, 1.35601825]} />
          </Layer>
        </Map>
      </Flex>
    </>
  );
};

export default Classes;
