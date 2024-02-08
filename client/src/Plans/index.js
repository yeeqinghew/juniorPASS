import { Typography, Card } from "antd";
const { Text } = Typography;

const Plans = () => {
  return (
    <>
      <h1>Avaible Plans</h1>
      <Text>Simple pricing.</Text>
      <Card hoverable style={{ width: 300, boxShadow: 25 }}>
        <h3>12 credits</h3>
        <p>SGD 60</p>
      </Card>

      <Card hoverable style={{ width: 300, boxShadow: 25 }}>
        <h3>25 credits</h3>
        <p>SGD 100</p>
      </Card>
      <Text>Book classes in Singapore</Text>
    </>
  );
};

export default Plans;
