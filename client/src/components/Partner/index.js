import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, List, Typography, Rate, Divider, Tabs, Avatar } from "antd";
import getBaseURL from "../../utils/config";
import "./index.css"; // Create a separate CSS file for styling

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const Partner = () => {
  const baseURL = getBaseURL();
  const [partner, setPartner] = useState({});
  const [listings, setListings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const { partnerId } = useParams();
  const navigate = useNavigate();

  const getPartnerDetails = async () => {
    try {
      const response = await fetch(`${baseURL}/partners/${partnerId}`);
      const { success, data } = await response.json();

      if (success) {
        setPartner(data?.partner);
        setListings(data?.listings);
        setReviews(data?.reviews);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getPartnerDetails();
  }, []);

  return (
    <div className="partner-page">
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div className="partner-header">
          <Avatar size={120} src={partner?.picture} />
          <div className="partner-info">
            <Title level={2}>{partner?.partner_name}</Title>
            <Text>{partner?.description}</Text>
          </div>
        </div>

        <Tabs defaultActiveKey="1">
          <TabPane tab="Listings" key="1">
            <Divider orientation="left">Our Classes</Divider>
            <List
              grid={{ 
                gutter: [24, 24],
                xs: 1,
                sm: 2,
                md: 2,
                lg: 3,
                xl: 4,
                xxl: 4
              }}
              dataSource={listings}
              locale={{
                emptyText: "No listings available at the moment"
              }}
              renderItem={(listing) => (
                <List.Item>
                  <Card
                    title={listing?.listing_title}
                    hoverable
                    onClick={() => {
                      navigate(`/class/${listing?.listing_id}`);
                    }}
                  >
                    <img
                      src={listing?.images[0]}
                      alt={listing?.listing_title}
                    />
                    <Text
                      style={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 3,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        lineHeight: "1.6",
                      }}
                    >
                      {listing?.description}
                    </Text>
                    {listing?.rating !== 0 && (
                      <Rate disabled defaultValue={listing.reviews} />
                    )}
                  </Card>
                </List.Item>
              )}
            />
          </TabPane>
          <TabPane tab="Reviews" key="2">
            <Divider orientation="left">Customer Reviews</Divider>
            <List
              dataSource={reviews}
              locale={{
                emptyText: "No reviews yet"
              }}
              renderItem={(review) => (
                <List.Item>
                  <div className="review-card">
                    <Rate disabled defaultValue={review?.rating} />
                    <Text>{review?.comment}</Text>
                  </div>
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default Partner;
