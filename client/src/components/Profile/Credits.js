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
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState(null);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      let url = `${baseURL}/transactions/user/${user.user_id}`;
      const params = new URLSearchParams();
      
      if (filterType !== 'all') {
        params.append('type', filterType);
      }
      
      if (dateRange && dateRange[0] && dateRange[1]) {
        params.append('start_date', dateRange[0].format('YYYY-MM-DD'));
        params.append('end_date', dateRange[1].format('YYYY-MM-DD'));
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
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
    switch (type?.toLowerCase()) {
      case 'topup':
      case 'purchase':
        return <PlusOutlined style={{ color: '#52c41a' }} />;
      case 'booking':
      case 'payment':
        return <MinusOutlined style={{ color: '#ff4d4f' }} />;
      case 'refund':
        return <GiftOutlined style={{ color: '#1890ff' }} />;
      default:
        return <CreditCardOutlined />;
    }
  };

  const getTransactionColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'topup':
      case 'purchase':
        return 'green';
      case 'booking':
      case 'payment':
        return 'red';
      case 'refund':
        return 'blue';
      default:
        return 'default';
    }
  };

  const formatAmount = (amount, type) => {
    const prefix = ['topup', 'purchase', 'refund'].includes(type?.toLowerCase()) ? '+' : '-';
    return `${prefix}$${Math.abs(amount).toFixed(2)}`;
  };

  const calculateStats = () => {
    const totalSpent = transactions
      .filter(t => ['booking', 'payment'].includes(t.type?.toLowerCase()))
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const totalTopup = transactions
      .filter(t => ['topup', 'purchase'].includes(t.type?.toLowerCase()))
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const totalRefunds = transactions
      .filter(t => t.type?.toLowerCase() === 'refund')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return { totalSpent, totalTopup, totalRefunds };
  };

  const stats = calculateStats();

  const renderTransactionItem = (item) => (
    <List.Item
      key={item.transaction_id}
      style={{
        padding: '16px 0',
        borderBottom: '1px solid #f0f0f0',
      }}
    >
      <List.Item.Meta
        avatar={getTransactionIcon(item.type)}
        title={
          <Space direction="vertical" size={4}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text strong style={{ fontSize: '16px' }}>
                {item.description || item.title || 'Transaction'}
              </Text>
              <Text 
                strong 
                style={{ 
                  fontSize: '16px',
                  color: ['topup', 'purchase', 'refund'].includes(item.type?.toLowerCase()) 
                    ? '#52c41a' 
                    : '#ff4d4f' 
                }}
              >
                {formatAmount(item.amount, item.type)}
              </Text>
            </div>
            <Space size="small">
              <Tag color={getTransactionColor(item.type)}>
                {item.type?.toUpperCase() || 'TRANSACTION'}
              </Tag>
              {item.child_name && (
                <Tag color="blue">For: {item.child_name}</Tag>
              )}
              {item.class_name && (
                <Tag color="purple">{item.class_name}</Tag>
              )}
            </Space>
          </Space>
        }
        description={
          <Space direction="vertical" size={4}>
            <Text type="secondary">
              {new Date(item.created_at || item.transaction_date).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
            {item.payment_method && (
              <Text type="secondary">Payment: {item.payment_method}</Text>
            )}
            {item.reference_id && (
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Ref: {item.reference_id}
              </Text>
            )}
          </Space>
        }
      />
    </List.Item>
  );

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
                <IconFont type="icon-money" style={{ fontSize: '32px', color: '#1890ff' }} />
                <div>
                  <Text type="secondary">Available Credit</Text>
                  <br />
                  <Text style={{ fontSize: '28px', fontWeight: 'bold', color: '#1890ff' }}>
                    ${user?.credit || 0}
                  </Text>
                </div>
              </div>
            </Space>
          </Col>
          <Col xs={24} md={12} style={{ textAlign: 'right' }}>
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
        <Col xs={24} sm={8}>
          <Card size="small">
            <Statistic
              title="Total Spent"
              value={stats.totalSpent}
              precision={2}
              prefix="$"
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small">
            <Statistic
              title="Total Top-ups"
              value={stats.totalTopup}
              precision={2}
              prefix="$"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small">
            <Statistic
              title="Refunds"
              value={stats.totalRefunds}
              precision={2}
              prefix="$"
              valueStyle={{ color: '#1890ff' }}
            />
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
                { value: 'all', label: 'All' },
                { value: 'topup', label: 'Top-ups' },
                { value: 'booking', label: 'Bookings' },
                { value: 'refund', label: 'Refunds' },
              ]}
            />
            <RangePicker
              placeholder={['Start Date', 'End Date']}
              onChange={setDateRange}
              style={{ width: 240 }}
            />
          </Space>
        }
      >
        <Spin spinning={loading}>
          {transactions.length === 0 ? (
            <Empty
              image={<ShoppingOutlined style={{ fontSize: 48, color: '#ccc' }} />}
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
