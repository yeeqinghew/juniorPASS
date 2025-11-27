import React, { useEffect, useState } from "react";
import { 
  Button, 
  Card, 
  Col, 
  Form, 
  Image, 
  Input, 
  Modal, 
  Row, 
  Space, 
  Spin, 
  Typography,
  Divider
} from "antd";
import { 
  CreditCardOutlined, 
  DollarOutlined, 
  GiftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from "@ant-design/icons";
import toast from "react-hot-toast";
import getBaseURL from "../../utils/config";
import { useUserContext } from "../UserContext";
import { useRef } from "react";

const { Title, Text } = Typography;

const TopupModal = ({ isTopUpModalOpen, setIsTopUpModalOpen, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalStep, setModalStep] = useState("form");
  const [topUpForm] = Form.useForm();
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const baseURL = getBaseURL();
  const { user, refreshUser } = useUserContext();
  const isPollingRef = useRef(false);

  // Predefined top-up packages
  const topupPackages = [
    { amount: 20, label: '$20', bonus: 0, popular: false },
    { amount: 50, label: '$50', bonus: 5, popular: true },
    { amount: 100, label: '$100', bonus: 15, popular: false },
    { amount: 200, label: '$200', bonus: 40, popular: false },
  ];

  const handleCancel = () => {
    if (modalStep === "loading") return; // Prevent closing during payment
    setIsTopUpModalOpen(false);
    setSelectedAmount(null);
    setCustomAmount('');
    topUpForm.resetFields();
    setModalStep("form");
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sandbox.hit-pay.com/hitpay.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const pollPaymentStatus = (reference_number) => {
    let attempts = 0;
    const maxAttempts = 12;

    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await fetch(
          `${baseURL}/payment/status/${reference_number}`,
          {}
        );
        const data = await res.json();

        if (data.status === "COMPLETED") {
          clearInterval(interval);
          isPollingRef.current = false;
          await refreshUser();
          if (onSuccess) onSuccess();
          setModalStep("success");
          return;
        } else if (data.status === "FAILED") {
          clearInterval(interval);
          isPollingRef.current = false;
          setModalStep("error");
        }

        if (attempts >= maxAttempts) {
          const response = await fetch(
            `${baseURL}/payment/verify/${reference_number}`
          );
          const verifyData = await response.json();

          clearInterval(interval);
          isPollingRef.current = false;
          
          if (verifyData.status === "COMPLETED") {
            await refreshUser();
            if (onSuccess) onSuccess();
            setModalStep("success");
          } else {
            toast.error("Payment verification failed. Please contact support.");
            setModalStep("error");
          }
        }
      } catch (error) {
        clearInterval(interval);
        isPollingRef.current = false;
        toast.error("Failed to check payment status. Please try again later.");
        setModalStep("error");
      }
    }, 5000);
  };

  const getFinalAmount = () => {
    if (selectedAmount) {
      return selectedAmount;
    }
    return parseFloat(customAmount) || 0;
  };

  const getBonusAmount = () => {
    const package1 = topupPackages.find(pkg => pkg.amount === selectedAmount);
    return package1?.bonus || 0;
  };

  const onHandleTopUp = async () => {
    try {
      const amount = getFinalAmount();
      
      if (!amount || amount < 5) {
        toast.error("Minimum top-up amount is $5.");
        return;
      }

      if (amount > 1000) {
        toast.error("Maximum top-up amount is $1000.");
        return;
      }

      setIsLoading(true);
      const response = await fetch(`${baseURL}/payment/init`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          user,
        }),
      });

      const { id, url, reference_number } = await response.json();

      if (window.HitPay) {
        window.HitPay.init(
          url,
          {
            domain: "sandbox.hit-pay.com",
            apiDomain: "sandbox.hit-pay.com",
          },
          {
            onClose: () => {
              if (!isPollingRef.current) {
                setIsLoading(false);
                toast.error("Payment was cancelled.");
              }
            },
            onSuccess: () => {
              isPollingRef.current = true;
              setModalStep("loading");
              pollPaymentStatus(reference_number);
            },
            onError: () => {
              setIsLoading(false);
              toast.error("Payment failed. Please try again.");
            },
          }
        );

        window.HitPay.toggle({
          paymentRequest: id,
        });
      } else {
        throw new Error("HitPay not loaded");
      }
    } catch (error) {
      console.error("Error initializing HitPay:", error);
      toast.error("Failed to initiate payment. Please try again.");
      setIsLoading(false);
    }
  };

  const selectPackage = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    topUpForm.setFieldsValue({ amount: '' });
  };

  const onCustomAmountChange = (e) => {
    const value = e.target.value;
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const renderForm = () => (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <CreditCardOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
        <Title level={3} style={{ margin: 0 }}>Top Up Credit</Title>
        <Text type="secondary">Add credit to your account for class bookings</Text>
      </div>

      <div style={{ marginBottom: 32 }}>
        <Text strong style={{ fontSize: 16, marginBottom: 16, display: 'block' }}>
          Choose Amount
        </Text>
        <Row gutter={[12, 12]}>
          {topupPackages.map((pkg) => (
            <Col span={12} key={pkg.amount}>
              <Card
                hoverable
                style={{ 
                  textAlign: 'center',
                  border: selectedAmount === pkg.amount ? '2px solid #1890ff' : '1px solid #d9d9d9',
                  borderRadius: 8,
                  position: 'relative'
                }}
                bodyStyle={{ padding: 16 }}
                onClick={() => selectPackage(pkg.amount)}
              >
                {pkg.popular && (
                  <div style={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    background: '#ff4d4f',
                    color: 'white',
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: 4,
                    fontWeight: 'bold'
                  }}>
                    POPULAR
                  </div>
                )}
                
                <Title level={4} style={{ margin: '0 0 8px 0', color: '#1890ff' }}>
                  {pkg.label}
                </Title>
                
                {pkg.bonus > 0 && (
                  <div>
                    <Text type="success" style={{ fontWeight: 'bold' }}>
                      +${pkg.bonus} Bonus!
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      Total: ${pkg.amount + pkg.bonus}
                    </Text>
                  </div>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <Divider>OR</Divider>

      <Form form={topUpForm} layout="vertical">
        <Form.Item 
          label={<Text strong>Custom Amount</Text>}
          style={{ marginBottom: 24 }}
        >
          <Input
            placeholder="Enter amount (min $5)"
            value={customAmount}
            onChange={onCustomAmountChange}
            type="number"
            min={5}
            max={1000}
            size="large"
            prefix={<DollarOutlined />}
            style={{ 
              border: customAmount ? '1px solid #1890ff' : undefined
            }}
          />
        </Form.Item>
      </Form>

      {(selectedAmount || customAmount) && (
        <Card style={{ backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Text strong>Amount to pay:</Text>
              <br />
              <Text style={{ fontSize: 18, color: '#1890ff' }}>
                ${getFinalAmount()}
              </Text>
              {getBonusAmount() > 0 && (
                <Text style={{ color: '#52c41a', marginLeft: 8 }}>
                  (+${getBonusAmount()} bonus)
                </Text>
              )}
            </div>
            <GiftOutlined style={{ fontSize: 24, color: '#52c41a' }} />
          </div>
        </Card>
      )}
    </div>
  );

  const renderLoading = () => (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <Spin size="large" style={{ marginBottom: 20 }} />
      <Title level={4}>Processing Payment...</Title>
      <Text type="secondary">
        Please wait while we confirm your payment.
        <br />
        Do not close this window.
      </Text>
    </div>
  );

  const renderSuccess = () => (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <CheckCircleOutlined style={{ fontSize: 64, color: '#52c41a', marginBottom: 20 }} />
      <Title level={3} style={{ color: '#52c41a' }}>Top-up Successful!</Title>
      <Text type="secondary" style={{ fontSize: 16 }}>
        ${getFinalAmount()} has been added to your account.
        {getBonusAmount() > 0 && (
          <>
            <br />
            <Text type="success">Including ${getBonusAmount()} bonus credit!</Text>
          </>
        )}
      </Text>
      <div style={{ marginTop: 24 }}>
        <Button type="primary" onClick={handleCancel}>
          Continue
        </Button>
      </div>
    </div>
  );

  const renderError = () => (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <CloseCircleOutlined style={{ fontSize: 64, color: '#ff4d4f', marginBottom: 20 }} />
      <Title level={3} style={{ color: '#ff4d4f' }}>Payment Failed</Title>
      <Text type="secondary" style={{ fontSize: 16 }}>
        We couldn't process your payment.
        <br />
        Please try again or contact support.
      </Text>
      <div style={{ marginTop: 24 }}>
        <Space>
          <Button onClick={handleCancel}>
            Close
          </Button>
          <Button type="primary" onClick={() => setModalStep("form")}>
            Try Again
          </Button>
        </Space>
      </div>
    </div>
  );

  return (
    <Modal
      title={null}
      open={isTopUpModalOpen}
      onCancel={handleCancel}
      width={520}
      centered
      closable={modalStep !== "loading"}
      maskClosable={modalStep !== "loading"}
      footer={
        modalStep === "form" ? (
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCancel}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                loading={isLoading} 
                onClick={onHandleTopUp}
                disabled={!getFinalAmount() || getFinalAmount() < 5}
                size="large"
              >
                Proceed to Payment
              </Button>
            </Space>
          </div>
        ) : null
      }
    >
      {modalStep === "form" && renderForm()}
      {modalStep === "loading" && renderLoading()}
      {modalStep === "success" && renderSuccess()}
      {modalStep === "error" && renderError()}
    </Modal>
  );
};

export default TopupModal;
