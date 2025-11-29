import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Divider,
  Empty,
  List,
  Row,
  Space,
  Spin,
  Statistic,
  Tag,
  Typography,
  Select,
  DatePicker,
} from "antd";
import {
  PlusOutlined,
  MinusOutlined,
  ShoppingOutlined,
  GiftOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import { createFromIconfontCN } from "@ant-design/icons";
import { useUserContext } from "../UserContext";
import TopupModal from "./TopupModal";
import toast from "react-hot-toast";
import getBaseURL from "../../utils/config";

const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

const IconFont = createFromIconfontCN({
  scriptUrl: ["//at.alicdn.com/t/c/font_4957401_wsnyu01fcm.js"],
});

const Credits = () => {
  const { user } = useUserContext();
  const baseURL = getBaseURL();
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [dateRange, setDateRange] = useState(null);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url = `${baseURL}/transactions/user`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched transactions:", data);
        setTransactions(data.transactions || []);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to fetch transaction history");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user, filterType, dateRange]);

  const handleTopUp = () => {
    setIsTopUpModalOpen(true);
  };

  const getTransactionIcon = (type) => {
    switch (type?.toUpperCase()) {
      case "CREDIT":
        return <PlusOutlined style={{ color: "#52c41a" }} />;
      case "DEBIT":
        return <MinusOutlined style={{ color: "#ff4d4f" }} />;
      default:
        return <CreditCardOutlined />;
    }
  };

  const getTransactionColor = (type) => {
    switch (type?.toUpperCase()) {
      case "CREDIT":
        return "green";
      case "DEBIT":
        return "red";
      default:
        return "default";
    }
  };

  const formatAmount = (credits, type) => {
    const prefix = type?.toUpperCase() === "CREDIT" ? "+" : "-";
    return `${prefix}${credits}`;
  };

  const calculateStats = () => {
    const totalSpent = transactions
      .filter((t) => t.transaction_type === "DEBIT")
      .reduce((sum, t) => sum + t.used_credit, 0);

    const totalEarned = transactions
      .filter((t) => t.transaction_type === "CREDIT")
      .reduce((sum, t) => sum + t.used_credit, 0);

    const netSpending = totalSpent - totalEarned;

    return { totalSpent, totalEarned, netSpending };
  };

  const stats = calculateStats();

  const renderTransactionItem = (item) => {
    // Parse images if they're in JSON format
    let imageUrl = null;
    if (item.images) {
      try {
        const imagesArray =
          typeof item.images === "string"
            ? JSON.parse(item.images)
            : item.images;
        imageUrl = imagesArray[0];
      } catch (e) {
        imageUrl = item.partner_picture;
      }
    } else {
      imageUrl = item.partner_picture;
    }

    return (
      <List.Item
        key={item.transaction_id}
        style={{
          padding: "16px 0",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <List.Item.Meta
          avatar={getTransactionIcon(item.transaction_type)}
          title={
            <Space direction="vertical" size={4}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text strong style={{ fontSize: "16px" }}>
                  {item.listing_title || "Transaction"}
                </Text>
                <Text
                  strong
                  style={{
                    fontSize: "16px",
                    color:
                      item.transaction_type === "CREDIT"
                        ? "#52c41a"
                        : "#ff4d4f",
                  }}
                >
                  {formatAmount(item.used_credit, item.transaction_type)}
                </Text>
              </div>
              <Space size="small">
                <Tag color={getTransactionColor(item.transaction_type)}>
                  {item.transaction_type}
                </Tag>
                {item.child_name && (
                  <Tag color="blue">
                    For: {item.child_name}, Age {item.child_age}
                  </Tag>
                )}
                {item.partner_name && (
                  <Tag color="purple">{item.partner_name}</Tag>
                )}
              </Space>
            </Space>
          }
          description={
            <Space direction="vertical" size={4}>
              <Text type="secondary">
                {new Date(item.created_on).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                ID: {item.transaction_id.substring(0, 8)}...
              </Text>
            </Space>
          }
        />
      </List.Item>
    );
  };

  return (
    <div>
      <Title level={4}>Credit & Transactions</Title>

      {/* Credit Balance Card */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={24} align="middle">
          <Col xs={24} md={12}>
            <Space direction="horizontal" size="large">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <IconFont
                  type="icon-money"
                  style={{ fontSize: "32px", color: "#1890ff" }}
                />
                <div>
                  <Text type="secondary">Available Credits</Text>
                  <br />
                  <Text
                    style={{
                      fontSize: "28px",
                      fontWeight: "bold",
                      color: "#1890ff",
                    }}
                  >
                    {user?.credit || 0}
                  </Text>
                </div>
              </div>
            </Space>
          </Col>
          <Col xs={24} md={12} style={{ textAlign: "right" }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={handleTopUp}
            >
              Top Up Credit
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12}>
          <Card size="small">
            <Statistic
              title="Net Spending"
              value={stats.netSpending}
              prefix={stats.netSpending >= 0 ? "-" : "+"}
              valueStyle={{ 
                color: stats.netSpending >= 0 ? "#ff4d4f" : "#52c41a",
                fontSize: "28px"
              }}
              suffix="credits"
            />
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Spent: {stats.totalSpent} • Refunded: {stats.totalEarned}
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card size="small">
            <Statistic
              title="Total Transactions"
              value={transactions.length}
              valueStyle={{ color: "#1890ff", fontSize: "28px" }}
              suffix="transactions"
            />
            <Text type="secondary" style={{ fontSize: "12px" }}>
              All time activity
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Transaction History */}
      <Card
        title="Transaction History"
        extra={
          <Space>
            <Select
              placeholder="Filter by type"
              style={{ width: 120 }}
              value={filterType}
              onChange={setFilterType}
              options={[
                { value: "all", label: "All" },
                { value: "topup", label: "Top-ups" },
                { value: "booking", label: "Bookings" },
                { value: "refund", label: "Refunds" },
              ]}
            />
            <RangePicker
              placeholder={["Start Date", "End Date"]}
              onChange={setDateRange}
              style={{ width: 240 }}
            />
          </Space>
        }
      >
        <Spin spinning={loading}>
          {transactions.length === 0 ? (
            <Empty
              image={
                <ShoppingOutlined style={{ fontSize: 48, color: "#ccc" }} />
              }
              description="No transaction history available"
            >
              <Button type="primary" onClick={handleTopUp}>
                Make Your First Top-up
              </Button>
            </Empty>
          ) : (
            <List
              dataSource={transactions}
              renderItem={renderTransactionItem}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `Total ${total} transactions`,
              }}
            />
          )}
        </Spin>
      </Card>

      <TopupModal
        isTopUpModalOpen={isTopUpModalOpen}
        setIsTopUpModalOpen={setIsTopUpModalOpen}
        onSuccess={fetchTransactions}
      />
    </div>
  );
};

export default Credits;
