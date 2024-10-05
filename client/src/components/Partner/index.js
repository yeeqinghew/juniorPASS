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
    <div className="partner-page" style={{ width: "100%", padding: "0 150px" }}>
      <div className="partner-header">
        <Avatar size={100} src={partner?.picture} />
        <div className="partner-info">
          <Title level={2}>{partner?.partner_name}</Title>
          <Text>{partner?.description}</Text>
        </div>
      </div>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Listings" key="1">
          <Divider orientation="left">Listings</Divider>
          <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={listings}
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
                    style={{ width: "100%", height: "auto" }}
                  />
                  <Text
                    style={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 4,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxHeight: "5.2em",
                      lineHeight: "1.3em",
                    }}
                  >
                    {listing?.description}
                  </Text>
                  {listing?.rating !== 0 && (
                    <Rate disabled defaultValue={listing.reviews}></Rate>
                  )}
                </Card>
              </List.Item>
            )}
          />
        </TabPane>
        <TabPane tab="Reviews" key="2">
          <Divider orientation="left">Reviews</Divider>
          <List
            dataSource={reviews}
            renderItem={(review) => (
              <List.Item>
                <Card>
                  <Rate disabled defaultValue={review?.rating} />
                  <Text>{review?.comment}</Text>
                </Card>
              </List.Item>
            )}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Partner;
