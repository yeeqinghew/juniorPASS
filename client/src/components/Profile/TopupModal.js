import React, { useEffect, useState } from "react";
import { Button, Form, Image, Input, Modal, Spin } from "antd";
import toast from "react-hot-toast";
import getBaseURL from "../../utils/config";
import { useUserContext } from "../UserContext";
import { useRef } from "react";

const TopupModal = ({ isTopUpModalOpen, setIsTopUpModalOpen }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalStep, setModalStep] = useState("form"); // form | loading | success | error
  const [topUpForm] = Form.useForm();
  const [selectedAmount, setSelectedAmount] = useState(null);
  const baseURL = getBaseURL();
  const { user, refreshUser } = useUserContext();
  const isPollingRef = useRef(false);

  const handleCancel = () => {
    setIsTopUpModalOpen(false);
    setSelectedAmount(null);
    topUpForm.resetFields();
    setModalStep("form"); // Reset to initial state
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
          isPollingRef.current = false;
          await refreshUser(); // Refresh user data to update credit
          setModalStep("success");
          return;
        } else if (data.status === "FAILED") {
          clearInterval(interval);
          isPollingRef.current = false;
          setModalStep("error");
        }

        //❗Fallback: Call HitPay directly
        if (attempts >= maxAttempts) {
          const response = await fetch(
            `${baseURL}/payment/verify/${reference_number}`
          );
          const data = await response.json();

          clearInterval(interval);
          if (data.status === "COMPLETED") {
            await refreshUser();
            setModalStep("success");
          } else {
            toast.error(
              "No confirmation received from HitPay. Please contact us"
            );
            setModalStep("error");
          }
        }
      } catch (error) {
        clearInterval(interval);
        toast.error("Failed to check payment status. Please try again later.");
        setModalStep("error");
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
              if (!isPollingRef.current) {
                toast.error("You have cancelled the top-up.");
              }
            },
            onSuccess: () => {
              isPollingRef.current = true;
              setModalStep("loading");
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
        title={modalStep === "form" ? "Top up" : ""}
        open={isTopUpModalOpen}
        onCancel={handleCancel}
        style={{
          borderRadius: "18px",
        }}
        footer={
          modalStep === "form" ? (
            <Button type="primary" loading={isLoading} onClick={onHandleTopUp}>
              Proceed to Payment
            </Button>
          ) : null
        }
        maskClosable={false}
        closable={modalStep !== "loading"} // prevent user from closing while loading
        centered
      >
        {/* TODO: top up packages */}
        {/* TODO: top up custom amount */}
        {modalStep === "form" && (
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
        )}

        {modalStep === "loading" && (
          <div style={{ textAlign: "center" }}>
            <Spin />
            <p>Please wait while we process your payment...</p>
          </div>
        )}

        {modalStep === "success" && (
          <div style={{ textAlign: "center", padding: "24px" }}>
            <Image
              src={require("../../images/success.gif")}
              alt="Success"
              style={{ width: "100px", marginBottom: "20px" }}
              preview={false}
            />
            <h3>Top-up Successful!</h3>
            <p>Your credit has been updated.</p>
          </div>
        )}

        {modalStep === "error" && (
          <div style={{ textAlign: "center", padding: "24px" }}>
            <Image
              src={require("../../images/error.gif")}
              alt="Error"
              style={{ width: "100px", marginBottom: "20px" }}
              preview={false}
            />
            <h3>Payment Failed</h3>
            <p>We couldn't confirm the top-up. Please try again later.</p>
          </div>
        )}
      </Modal>
    </>
  );
};

export default TopupModal;
