import { Button, Card, Space, Typography } from "antd";

const { Title, Text } = Typography;

const HomePage = () => {
  return (
    <div>
      <img
        src={require("../images/cover.jpg")}
        alt="cover"
        style={{
          // height: "700px",
          width: "100%",
          backgroundSize: "contain",
          filter: "brightness(50%)",
        }}
      ></img>

      <Card
        style={{
          backgroundColor: "#FFDEDE",
          height: "500px",
          width: "500px",
          borderRadius: "5%",
          position: "absolute",
          margin: "0 auto",
          right: "120px",
          top: "250px",
        }}
      >
        <Space direction="vertical">
          <Title style={{ color: "#98BDD2", fontWeight: 1000, fontSize: 48 }}>
            Preparing preschoolers for life
          </Title>
          <Text style={{ fontFamily: "Poppins", fontSize: 14 }}>
            Unleashing potential through diverse classes for young minds
          </Text>
          <Button>Find out more</Button>
        </Space>
      </Card>
    </div>
  );
};

export default HomePage;
