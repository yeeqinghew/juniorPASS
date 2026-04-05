import { Card, Typography } from "antd";
import "./InfoCard.css";

const { Text, Title } = Typography;

function InfoCard({
  icon,
  title,
  description,
  hovered,
  onHover,
  onLeave,
  style,
}) {
  return (
    <Card
      hoverable
      className={`info-card ${hovered ? 'info-card--hovered' : ''}`}
      style={style}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      bodyStyle={{}}
    >
      <div className="info-card__body">
        {/* Gradient overlay that appears on hover */}
        <div className="info-card__overlay" />

        {/* Icon with enhanced animation */}
        <div className="info-card__icon">
          {/* Icon glow effect */}
          <div className="info-card__icon-glow" />
          {icon}
        </div>

        <Title level={3} className="info-card__title">
          {title}
        </Title>

        <Text className="info-card__description">
          {description}
        </Text>
      </div>
    </Card>
  );
}

export default InfoCard;
