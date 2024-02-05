import { Avatar, Input, List } from "antd";
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const { Search } = Input;
const Map = ReactMapboxGl({
  accessToken:
    "pk.eyJ1IjoibWltaXFpbmc1NSIsImEiOiJjbHM4c2F0ZnAwMDV1MnBwY3UyNXI2MmNiIn0.H6YOxtN1uRH5Xv_elAD6iQ",
});

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
  return (
    <>
      <Search
        placeholder="input search text"
        allowClear
        onSearch={onSearch}
        style={{ width: 200 }}
      />
      <List
        itemLayout="horizontal"
        dataSource={data}
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
          height: "100vh",
          width: "100vw",
        }}
      >
        <Layer type="symbol" id="marker" layout={{ "icon-image": "marker-15" }}>
          <Feature coordinates={[103.8198, 1.3521]} />
        </Layer>
      </Map>
    </>
  );
};

export default Classes;
