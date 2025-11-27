import React from "react";
import { Card, Typography } from "antd";
const { Text, Title } = Typography;

const boxStyle = {
  backgroundColor: "#fff",
  borderRadius: "20px",
  textAlign: "center",
  padding: "32px 24px",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  cursor: "pointer",
  minHeight: "320px",
  width: "100%",
  maxWidth: "400px",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  border: "2px solid rgba(0,0,0,0.06)",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
};

const hoverEffect = {
  ...boxStyle,
  transform: "translateY(-8px)",
  boxShadow: "0 12px 28px rgba(152, 189, 210, 0.25)",
  borderColor: "#98BDD2",
};

function InfoCard({
  icon,
  title,
  description,
  hovered,
  onHover,
  onLeave,
  style,
}) {
  const overrideBoxStyle = { ...boxStyle, ...style };
  return (
    <Card
      hoverable
      style={hovered ? hoverEffect : overrideBoxStyle}
      onMouseEnter={onHover}
      bodyStyle={{ 
        padding: "40px 28px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%"
      }}
      onMouseLeave={onLeave}
    >
      <div style={{ 
        marginBottom: "24px",
        transform: hovered ? "scale(1.1)" : "scale(1)",
        transition: "transform 0.3s ease"
      }}>
        {icon}
      </div>
      <Title level={3} style={{ 
        marginBottom: "16px",
        color: "#333",
        fontSize: "24px",
        fontWeight: "700"
      }}>
        {title}
      </Title>
      <Text style={{ 
        fontSize: "15px",
        lineHeight: "1.6",
        color: "#555"
      }}>
        {description}
      </Text>
    </Card>
  );
}
export default InfoCard;
