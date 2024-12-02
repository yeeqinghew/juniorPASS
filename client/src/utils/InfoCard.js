import React from "react";
import { Card, Typography } from "antd";
const { Text, Title } = Typography;

const boxStyle = {
  backgroundColor: "#FFE3E3",
  borderRadius: "10px",
  textAlign: "center",
  padding: "20px",
  transition: "transform 0.3s",
  cursor: "pointer",
  height: "300px", // Fixed height
  width: "100%", // Ensure the card spans the full width of its parent column
  maxWidth: "500px", // Optional: set a maximum width for consistency
  display: "flex",
};

const hoverEffect = {
  ...boxStyle,
  transform: "scale(1.05)",
};

function InfoCard({ icon, title, description, hovered, onHover, onLeave }) {
  return (
    <Card
      hoverable
      style={hovered ? hoverEffect : boxStyle}
      onMouseEnter={onHover}
      bodyStyle={{ padding: "30px" }}
      onMouseLeave={onLeave}
    >
      {icon}
      <Title level={4}>{title}</Title>
      <Text>{description}</Text>
    </Card>
  );
}
export default InfoCard;
