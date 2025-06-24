import React, { useEffect } from "react";
import { Button, Form, Input, Modal } from "antd";
import toast from "react-hot-toast";

const TopupModal = ({ isTopUpModalOpen, setIsTopUpModalOpen }) => {
  const [topUpForm] = Form.useForm();
  const handleCancel = () => {
    setIsTopUpModalOpen(false);
  };

  useEffect(() => {
    // Dynamically load the HitPay script
    const script = document.createElement("script");
    script.src = "https://sandbox.hit-pay.com/hitpay.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup
      document.body.removeChild(script);
    };
  }, []);

  const onSuccess = (data) => {
    toast.success("Top up sucessfully");
  };

  const onClose = (data) => {
    toast.error("You have cancelled the top up");
  };

  const onError = (error) => {
    toast.error("An error occurred during the top up");
  };

  const onHandleTopUp = () => {
    if (window.HitPay && !window.HitPay.inited) {
      window.HitPay.init(
        "http://securecheckout.sandbox.hit-pay.com/payment-request/@test-1",
        {
          domain: "sandbox.hit-pay.com",
          apiDomain: "sandbox.hit-pay.com",
        },
        {
          onClose,
          onSuccess,
          onError,
        }
      );
    }
  };

  if (window.HitPay) {
    window.HitPay.toggle({
      paymentRequest: "9e2ae77a-f2c2-4023-828a-7ffce9d23472",
    });
  }

  return (
    <>
      <script src="https://sandbox.hit-pay.com/hitpay.js"></script>
      <Modal
        title={"Top up"}
        open={isTopUpModalOpen}
        onCancel={handleCancel}
        centered
        style={{
          borderRadius: "18px",
        }}
        footer={
          <Button
            form="topUpForm"
            key="submit"
            htmlType="submit"
            onClick={onHandleTopUp}
          >
            Next
          </Button>
        }
      >
        {/* TODO: top up packages */}
        {/* TODO: top up custom amount */}
        <Form form={topUpForm} autoComplete="off" layout="vertical">
          <Form.Item name="amount" label="Top up amount">
            <Input placeholder="Custom amount (e.g. 10, 20)" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TopupModal;
