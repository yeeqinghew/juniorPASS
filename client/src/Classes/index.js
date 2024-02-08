import { Avatar, Input, List, Flex } from "antd";
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
          dataSource={data}
          style={{
            width: "40%",
          }}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                  />
                }
                title={<a href="https://ant.design">{item.title}</a>}
                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
              ></List.Item.Meta>
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
