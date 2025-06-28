import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal } from "antd";
import toast from "react-hot-toast";
import getBaseURL from "../../utils/config";
import { useUserContext } from "../UserContext";

const TopupModal = ({ isTopUpModalOpen, setIsTopUpModalOpen }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [topUpForm] = Form.useForm();
  const [selectedAmount, setSelectedAmount] = useState(null);
  const baseURL = getBaseURL();
  const { user } = useUserContext();

  const handleCancel = () => {
    setIsTopUpModalOpen(false);
    setSelectedAmount(null);
    topUpForm.resetFields();
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

  const pollPaymentStatus = (reference_number) => {
    let attempts = 0;
    const maxAttempts = 24; // 2 minutes polling
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
          toast.success("Top-up successful!");
          handleCancel();
        } else if (data.status === "FAILED") {
          clearInterval(interval);
          toast.error("Top-up failed.");
          handleCancel();
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          toast("No response from payment gateway. Please check later.");
          handleCancel();
        }
      } catch (error) {
        clearInterval(interval);
        toast.error("Failed to check payment status. Please try again later.");
      }
    }, 5000); // Poll every 5 seconds
  };

  const onHandleTopUp = async () => {
    try {
      const amount = topUpForm.getFieldValue("amount");
      if (!amount || amount <= 0) {
        toast.error("Please enter a valid amount to top up.");
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
              toast.error("You have cancelled the top-up.");
            },
            onSuccess: () => {
              toast.success("Waiting for payment confirmation...");
              pollPaymentStatus(reference_number);
            },
            onError: () => {
              toast.error("An error occurred during top-up.");
            },
          }
        );
      }

      window.HitPay.toggle({
        paymentRequest: id,
      });
    } catch (error) {
      console.error("Error initializing HitPay:", error);
      toast.error("Failed to initiate top-up.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal
        title="Top up"
        open={isTopUpModalOpen}
        onCancel={handleCancel}
        style={{
          borderRadius: "18px",
        }}
        footer={
          <Button type="primary" loading={isLoading} onClick={onHandleTopUp}>
            Proceed to Payment
          </Button>
        }
        centered
      >
        {/* TODO: top up packages */}
        {/* TODO: top up custom amount */}
        <Form form={topUpForm} autoComplete="off" layout="vertical">
          <Form.Item name="amount" label="Or enter custom amount">
            <Input
              placeholder="e.g. 30"
              onChange={() => setSelectedAmount(null)}
              type="number"
              min={1}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TopupModal;
