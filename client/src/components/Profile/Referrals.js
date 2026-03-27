import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Empty,
  Row,
  Spin,
  Tag,
  Typography,
  Modal,
  Input,
  Form,
  Avatar,
  Divider,
} from "antd";
import {
  GiftOutlined,
  LinkOutlined,
  UserAddOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CopyOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useUserContext } from "../UserContext";
import toast from "react-hot-toast";
import getBaseURL from "../../utils/config";
import "./Referrals.css";

const { Text, Title } = Typography;

const Referrals = () => {
  const { user } = useUserContext();
  const baseURL = getBaseURL();
  const [referralData, setReferralData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [form] = Form.useForm();

  const fetchReferralData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${baseURL}/referrals/my-referral`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReferralData(data);
      } else {
        toast.error("Failed to fetch referral data");
      }
    } catch (error) {
      console.error("Error fetching referral data:", error);
      toast.error("Error fetching referral data");
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`${baseURL}/referrals/leaderboard`);
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data.leaderboard);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchReferralData();
      // fetchLeaderboard();
    }
  }, [user]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralData?.referral_code);
      toast.success("Referral code copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy code");
    }
  };

  const handleShareEmail = async (values) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${baseURL}/referrals/share-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: values.email,
          recipient_name: values.recipient_name,
        }),
      });

      if (response.ok) {
        toast.success("Invitation sent successfully!");
        setShareModalOpen(false);
        form.resetFields();
      } else {
        toast.error("Failed to send invitation");
      }
    } catch (error) {
      console.error("Error sharing via email:", error);
      toast.error("Error sending invitation");
    }
  };

  const getReferralLink = () => {
    return `${window.location.origin}/register?referral_code=${referralData?.referral_code}`;
  };

  const stats = referralData?.stats || {};

  return (
    <div className="referrals-page">
      {/* Header */}
      <div className="referrals-header">
        <div className="header-content">
          <Title level={3} className="page-title">
            <GiftOutlined style={{ marginRight: 12 }} /> Earn Credits Through
            Referrals
          </Title>
          <Text className="page-subtitle">
            Share the joy of juniorPASS and earn rewards
          </Text>
        </div>
      </div>

      <Spin spinning={loading}>
        {/* Main Stats Card */}
        {referralData && (
          <>
            <Card className="referral-stats-card" bordered={false}>
              <Row gutter={[32, 32]} align="middle">
                <Col xs={24} md={12}>
                  <div className="referral-code-section">
                    <div className="code-label">
                      <LinkOutlined style={{ fontSize: 16 }} />
                      YOUR REFERRAL CODE
                    </div>
                    <div className="code-display">
                      <span className="code-value">
                        {referralData.referral_code}
                      </span>
                      <Button
                        type="text"
                        icon={<CopyOutlined style={{ fontSize: 18 }} />}
                        onClick={handleCopyCode}
                        className="copy-button"
                        title="Copy code"
                      />
                    </div>
                    <Text className="code-hint">
                      ✨ Share this code with friends to earn rewards
                    </Text>
                  </div>
                </Col>

                <Col xs={24} md={12}>
                  <div className="referral-actions">
                    <Button
                      type="primary"
                      icon={
                        <MailOutlined
                          style={{ marginRight: 8, fontSize: 16 }}
                        />
                      }
                      size="large"
                      onClick={() => setShareModalOpen(true)}
                      block
                      style={{
                        height: 48,
                        fontSize: 16,
                        fontWeight: 600,
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        border: "none",
                        boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                      }}
                    >
                      Invite Friends via Email
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Statistics */}
            {stats && (
              <Row gutter={[16, 16]} className="stats-row">
                <Col xs={24} sm={12} md={6}>
                  <Card className="stat-card referral-stat" bordered={false}>
                    <div className="stat-icon total">
                      <UserAddOutlined />
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">
                        {stats.total_referrals || 0}
                      </div>
                      <div className="stat-label">Total Invited</div>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card className="stat-card referral-stat" bordered={false}>
                    <div className="stat-icon completed">
                      <CheckCircleOutlined />
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">
                        {stats.completed_referrals || 0}
                      </div>
                      <div className="stat-label">Completed</div>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card className="stat-card referral-stat" bordered={false}>
                    <div className="stat-icon pending">
                      <ClockCircleOutlined />
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">
                        {stats.pending_referrals || 0}
                      </div>
                      <div className="stat-label">Pending</div>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card className="stat-card referral-stat" bordered={false}>
                    <div className="stat-icon earned">
                      <GiftOutlined />
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">
                        {stats.total_credits_earned || 0}
                      </div>
                      <div className="stat-label">Credits Earned</div>
                    </div>
                  </Card>
                </Col>
              </Row>
            )}

            {/* Referral List */}
            <Card className="referrals-list-card" bordered={false}>
              <div className="list-header">
                <Title
                  level={5}
                  style={{
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <UserAddOutlined style={{ fontSize: 20 }} /> Recent Referrals
                </Title>
              </div>

              {!referralData.recent_referrals ||
              referralData.recent_referrals.length === 0 ? (
                <div style={{ padding: "40px 24px" }}>
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No referrals yet"
                    style={{ marginTop: 20 }}
                  >
                    <Text style={{ color: "#999", fontSize: 14 }}>
                      Start inviting friends to earn rewards!
                    </Text>
                  </Empty>
                </div>
              ) : (
                <div className="referrals-list">
                  {referralData.recent_referrals.map((referral) => (
                    <div className="referral-item" key={referral.id}>
                      <div className="referral-info">
                        <div className="referral-header">
                          <span>{referral.referee_name}</span>
                          <Tag
                            color={
                              referral.status === "completed"
                                ? "#52c41a"
                                : "#faad14"
                            }
                            icon={
                              referral.status === "completed" ? (
                                <CheckCircleOutlined />
                              ) : (
                                <ClockCircleOutlined />
                              )
                            }
                            style={{
                              marginLeft: 12,
                              textTransform: "capitalize",
                              fontWeight: 600,
                            }}
                          >
                            {referral.status}
                          </Tag>
                        </div>
                        <div className="referral-email">
                          {referral.referee_email}
                        </div>
                      </div>

                      <div className="referral-reward">
                        <div className="reward-amount">
                          <GiftOutlined className="reward-icon" />+
                          {referral.reward_credits} credits
                        </div>
                        <div className="reward-date">
                          {new Date(referral.created_on).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Leaderboard */}
            {/* {leaderboard.length > 0 && (
              <Card className="leaderboard-card" bordered={false}>
                <div className="leaderboard-header">
                  <Title
                    level={5}
                    style={{
                      margin: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <TrophyOutlined
                      style={{ fontSize: 20, color: "#ffd700" }}
                    />{" "}
                    Top Referrers
                  </Title>
                </div>

                <div className="leaderboard-list">
                  {leaderboard.map((referrer, index) => (
                    <div className="leaderboard-item" key={referrer.user_id}>
                      <div className="rank">
                        <div className={`rank-badge rank-${index + 1}`}>
                          #{index + 1}
                        </div>
                      </div>

                      <div className="referrer-info">
                        <Avatar
                          src={referrer.display_picture}
                          icon={<UserOutlined />}
                          className="referrer-avatar"
                        />
                        <div className="referrer-details">
                          <span>{referrer.name}</span>
                          <span className="referrer-stats">
                            {referrer.completed_referrals} completed
                            {referrer.total_referrals >
                              referrer.completed_referrals &&
                              ` (${referrer.total_referrals - referrer.completed_referrals} pending)`}
                          </span>
                        </div>
                      </div>

                      <div className="referrer-reward">
                        <div className="reward-value">
                          {referrer.total_credits_earned}
                        </div>
                        <div className="reward-label">credits</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )} */}

            {/* How it Works */}
            <Card className="how-it-works-card" bordered={false}>
              <Title
                level={4}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 24,
                }}
              >
                <GiftOutlined style={{ fontSize: 24, color: "#667eea" }} /> How
                It Works
              </Title>

              <div className="steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <span>Share Your Code</span>
                    <span>
                      Copy your referral code or send invitations via email
                    </span>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <span>Friend Signs Up</span>
                    <span>They use your code during registration</span>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <span>They Top Up First Time</span>
                    <span>Your friend completes their first payment</span>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <span>Earn 100 Credits</span>
                    <span>Both you and your friend get 100 bonus credits!</span>
                  </div>
                </div>
              </div>
            </Card>
          </>
        )}
      </Spin>

      {/* Share Email Modal */}
      <Modal
        title="Invite Friends"
        open={shareModalOpen}
        onCancel={() => {
          setShareModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleShareEmail}
          className="share-form"
        >
          <Form.Item
            label="Friend's Name"
            name="recipient_name"
            rules={[
              { required: true, message: "Please enter your friend's name" },
            ]}
          >
            <Input placeholder="John Doe" />
          </Form.Item>

          <Form.Item
            label="Friend's Email"
            name="email"
            rules={[
              { required: true, message: "Please enter email address" },
              { type: "email", message: "Please enter valid email" },
            ]}
          >
            <Input placeholder="john@example.com" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Send Invitation
            </Button>
          </Form.Item>
        </Form>

        <Divider />

        {
          <div className="share-link-section">
            <Text type="secondary" style={{ fontSize: 12 }}>
              Or share this link:
            </Text>
            <div className="share-link">
              <Input value={getReferralLink()} readOnly />
              <Button
                type="text"
                icon={<CopyOutlined />}
                onClick={() => {
                  navigator.clipboard.writeText(getReferralLink());
                  toast.success("Link copied!");
                }}
              />
            </div>
          </div>
        }
      </Modal>
    </div>
  );
};

export default Referrals;
