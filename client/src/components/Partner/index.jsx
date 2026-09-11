import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  List,
  Typography,
  Rate,
  Tabs,
  Avatar,
  Row,
  Col,
  Tag,
  Space,
  Spin,
  Empty,
  Button,
  Image,
} from "antd";
import {
  PhoneOutlined,
  GlobalOutlined,
  TagOutlined,
  CalendarOutlined,
  StarOutlined,
  BookOutlined,
  UserOutlined,
  ShopOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { fetchWithAuth, API_ENDPOINTS } from "../../utils/api";
import "./index.css";

const { Title, Text, Paragraph } = Typography;

const Partner = () => {
  const [partner, setPartner] = useState({});
  const [listings, setListings] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { partnerId } = useParams();
  const navigate = useNavigate();

  const getPartnerDetails = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(API_ENDPOINTS.GET_PARTNER(partnerId));
      const { success, data } = await response.json();

      if (success) {
        setPartner(data?.partner);
        setListings(data?.listings);
        setOutlets(data?.outlets || []);
        setReviews(data?.reviews);
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPartnerDetails();
  }, [partnerId]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      Sports: "blue",
      Music: "purple",
    };
    return colors[category] || "default";
  };

  const getListingImage = (listing) => {
    if (!listing?.images) return null;
    try {
      // Handle if images is a JSON string
      const images =
        typeof listing.images === "string"
          ? JSON.parse(listing.images)
          : listing.images;
      return Array.isArray(images) ? images[0] : null;
    } catch (e) {
      return null;
    }
  };

  const parseArray = (value) => {
    if (Array.isArray(value)) return value;
    if (!value) return [];
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const getOutletAddress = (value) => {
    if (!value) return "Address not provided";
    try {
      const parsed = typeof value === "string" ? JSON.parse(value) : value;
      return parsed?.ADDRESS || parsed?.SEARCHVAL || value;
    } catch {
      return value;
    }
  };

  const getAgeGroups = (listing) => {
    if (!listing?.age_groups) return [];
    try {
      // Handle if age_groups is a JSON string
      const ageGroups =
        typeof listing.age_groups === "string"
          ? JSON.parse(listing.age_groups)
          : listing.age_groups;
      return Array.isArray(ageGroups) ? ageGroups : [];
    } catch (e) {
      return [];
    }
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  const tabItems = [
    {
      key: "about",
      label: (
        <span>
          <ShopOutlined /> About
        </span>
      ),
      children: (
        <div className="partner-about-section">
          {/* About Description */}
          <Card className="about-card" bordered={false}>
            <Title level={5} className="about-card-title">
              About {partner?.partner_name}
            </Title>
            <Paragraph className="about-description">
              {partner?.description || "No description available."}
            </Paragraph>
          </Card>

          {/* Contact Info */}
          <Row gutter={[24, 24]}>
            <Col xs={24}>
              <Card className="info-card" bordered={false}>
                <Title level={5} className="info-card-title">
                  <PhoneOutlined /> Contact
                </Title>
                <div className="info-item">
                  <Text className="info-label">Phone</Text>
                  <Text className="info-value">
                    {partner?.contact_number
                      ? `+65 ${partner.contact_number}`
                      : "Not provided"}
                  </Text>
                </div>
                <div className="info-item">
                  <Text className="info-label">Email</Text>
                  <Text className="info-value">
                    {partner?.email || "Not provided"}
                  </Text>
                </div>
                {partner?.website && (
                  <div className="info-item">
                    <Text className="info-label">Website</Text>
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="website-link"
                    >
                      <GlobalOutlined /> Visit Website
                    </a>
                  </div>
                )}
              </Card>
            </Col>
          </Row>

          {/* Categories & Stats */}
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card className="info-card" bordered={false}>
                <Title level={5} className="info-card-title">
                  <TagOutlined /> Categories
                </Title>
                <div className="categories-list">
                  {partner?.categories?.map((cat, idx) => (
                    <Tag
                      key={idx}
                      color={getCategoryColor(cat)}
                      className="category-tag"
                    >
                      {cat}
                    </Tag>
                  )) || <Text type="secondary">No categories</Text>}
                </div>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card className="info-card" bordered={false}>
                <Title level={5} className="info-card-title">
                  <CalendarOutlined /> Partner Since
                </Title>
                <Text className="partner-since">
                  {formatDate(partner?.created_at)}
                </Text>
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: "outlets",
      label: (
        <span>
          <EnvironmentOutlined /> Outlets ({outlets.length})
        </span>
      ),
      children: (
        <div className="partner-outlets-section">
          {outlets.length === 0 ? (
            <Empty
              description="No locations with available classes"
              image={<EnvironmentOutlined className="empty-icon" />}
            />
          ) : (
            <div className="partner-outlets-grid">
              {outlets.map((outlet) => {
                const images = parseArray(outlet.images);
                return (
                  <Card key={outlet.outlet_id} className="partner-outlet-card">
                    <div className="partner-outlet-media">
                      {images.length > 0 ? (
                        <Image
                          src={images[0]}
                          alt={outlet.outlet_name || "Outlet"}
                          preview={{ mask: "View photo" }}
                        />
                      ) : (
                        <div className="partner-outlet-placeholder">
                          <ShopOutlined />
                        </div>
                      )}
                    </div>
                    <div className="partner-outlet-content">
                      <div className="partner-outlet-heading">
                        <Title level={4}>
                          {outlet.outlet_name || "Outlet"}
                        </Title>
                        <Tag className="partner-outlet-class-count">
                          {outlet.available_class_count}{" "}
                          {outlet.available_class_count === 1 ? "class" : "classes"}
                        </Tag>
                      </div>
                      <Text className="partner-outlet-address">
                        <EnvironmentOutlined /> {getOutletAddress(outlet.address)}
                      </Text>
                      {outlet.nearest_mrt && (
                        <Tag className="partner-outlet-mrt">
                          {outlet.nearest_mrt} MRT
                        </Tag>
                      )}
                      {outlet.description && (
                        <Paragraph ellipsis={{ rows: 2 }}>
                          {outlet.description}
                        </Paragraph>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "classes",
      label: (
        <span>
          <BookOutlined /> Classes ({listings.length})
        </span>
      ),
      children: (
        <div className="partner-classes-section">
          {listings.length === 0 ? (
            <Empty
              description="No classes available at the moment"
              image={<BookOutlined className="empty-icon" />}
            />
          ) : (
            <List
              grid={{
                gutter: [24, 24],
                xs: 1,
                sm: 2,
                md: 2,
                lg: 3,
                xl: 3,
                xxl: 4,
              }}
              dataSource={listings}
              renderItem={(listing) => (
                <List.Item>
                  <Card
                    hoverable
                    className="listing-card"
                    onClick={() => navigate(`/class/${listing?.listing_id}`)}
                    cover={
                      <div className="listing-image-wrapper">
                        {getListingImage(listing) ? (
                          <img
                            src={getListingImage(listing)}
                            alt={listing?.listing_title}
                            className="listing-image"
                          />
                        ) : (
                          <div className="listing-image-placeholder">
                            <BookOutlined />
                          </div>
                        )}
                        {listing?.credit && (
                          <div className="listing-credit-badge">
                            {listing.credit} credits
                          </div>
                        )}
                      </div>
                    }
                  >
                    <Card.Meta
                      title={
                        <Text className="listing-title" ellipsis>
                          {listing?.listing_title}
                        </Text>
                      }
                      description={
                        <Space direction="vertical" size={4}>
                          {listing?.rating > 0 && (
                            <div className="listing-rating">
                              <Rate
                                disabled
                                defaultValue={listing.rating}
                                className="listing-rate"
                              />
                              <Text type="secondary">({listing.rating})</Text>
                            </div>
                          )}
                          <div className="listing-tags">
                            {getAgeGroups(listing)
                              .slice(0, 2)
                              .map((age, idx) => (
                                <Tag key={idx} className="age-tag">
                                  {age}
                                </Tag>
                              ))}
                          </div>
                        </Space>
                      }
                    />
                  </Card>
                </List.Item>
              )}
            />
          )}
        </div>
      ),
    },
    {
      key: "reviews",
      label: (
        <span>
          <StarOutlined /> Reviews ({reviews.length})
        </span>
      ),
      children: (
        <div className="partner-reviews-section">
          {reviews.length === 0 ? (
            <Empty
              description="No reviews yet"
              image={<StarOutlined className="empty-icon" />}
            />
          ) : (
            <List
              dataSource={reviews}
              renderItem={(review) => (
                <List.Item className="review-item">
                  <Card className="review-card" bordered={false}>
                    <div className="review-header">
                      <Avatar
                        icon={<UserOutlined />}
                        className="review-avatar"
                      />
                      <div className="review-meta">
                        <Rate
                          disabled
                          defaultValue={review?.rating}
                          className="review-rate"
                        />
                        <Text type="secondary" className="review-date">
                          {formatDate(review?.created_at)}
                        </Text>
                      </div>
                    </div>
                    <Paragraph className="review-comment">
                      {review?.comment}
                    </Paragraph>
                  </Card>
                </List.Item>
              )}
            />
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="partner-page">
        <div className="partner-loading">
          <Spin size="large" />
          <Text>Loading partner details...</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="partner-page">
      <div className="partner-page-inner">
        {/* Partner Header */}
        <div className="partner-header">
          <Avatar
            size={120}
            src={partner?.picture}
            icon={<ShopOutlined />}
            className="partner-avatar"
          />
          <div className="partner-header-info">
            <Title level={2} className="partner-name">
              {partner?.partner_name}
            </Title>
            <div className="partner-header-meta">
              {averageRating > 0 && (
                <div className="partner-rating">
                  <Rate disabled allowHalf value={parseFloat(averageRating)} />
                  <Text className="rating-text">
                    {averageRating} ({reviews.length} reviews)
                  </Text>
                </div>
              )}
              <div className="partner-stats">
                <Tag color="blue" className="stat-tag">
                  <BookOutlined /> {listings.length} Classes
                </Tag>
              </div>
            </div>
            {partner?.website && (
              <Button
                type="primary"
                icon={<GlobalOutlined />}
                href={partner.website}
                target="_blank"
                className="visit-website-btn"
              >
                Visit Website
              </Button>
            )}
          </div>
        </div>

        {/* Tabs Section */}
        <Card className="partner-tabs-card" bordered={false}>
          <Tabs defaultActiveKey="about" items={tabItems} size="large" />
        </Card>
      </div>
    </div>
  );
};

export default Partner;
