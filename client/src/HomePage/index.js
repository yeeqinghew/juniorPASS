import { Button, Card, Space, Typography } from "antd";

const { Title, Text } = Typography;

const HomePage = () => {
  return (
    <div>
      <img
        src={require("../images/cover.jpg")}
        alt="cover"
        style={{
          width: "100%",
          backgroundSize: "contain",
          filter: "brightness(50%)",
        }}
      ></img>

      <Card
        style={{
          backgroundColor: "#FFDEDE",
          height: "460px",
          width: "550px",
          borderRadius: "5%",
          position: "absolute",
          margin: "0 auto",
          right: "120px",
          top: "250px",
          boxShadow: "12px",
        }}
      >
        <Space direction="vertical" size={"large"}>
          <Title style={{ color: "#98BDD2", fontWeight: 1000, fontSize: 48 }}>
            Preparing preschoolers for life
          </Title>
          <Text>
            Unleashing potential through diverse classes for young minds
          </Text>
          <Button size="large">Find out more</Button>
        </Space>
      </Card>
    </div>
  );
};

export default HomePage;
