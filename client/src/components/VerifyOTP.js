import React, { useState, useEffect } from "react";
import { ArrowLeftOutlined, NumberOutlined } from "@ant-design/icons";
import { Button, Form, Input, Typography, Divider } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import getBaseURL from "../utils/config";
import { useUserContext } from "./UserContext";
import CryptoJS from "crypto-js";

const { Title } = Typography;

const VerifyOTP = () => {
  const baseURL = getBaseURL();
  const [otpForm] = Form.useForm();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useUserContext();

  // Retrieve user details from Register page
  const userData = location.state || {};
  const { name, phoneNumber, email, password } = userData; // Extract user data

  useEffect(() => {
    if (!email || !password) {
      toast.error("No user data found, please register again.");
      navigate("/register");
    } else {
      startCooldown(); // Start cooldown on page load
    }
  }, [email, password, navigate]);

  // Start OTP cooldown timer
  const startCooldown = () => {
    let time = 60;
    setCooldown(time);
    const interval = setInterval(() => {
      time -= 1;
      setCooldown(time);
      if (time === 0) {
        clearInterval(interval);
      }
    }, 1000);
  };

  // Resend OTP
  const onResendOTP = async () => {
    if (cooldown > 0) {
      toast.error(`Please wait ${cooldown} seconds before resending OTP.`);
      return;
    }

    setIsResending(true);
    try {
      const response = await fetch(`${baseURL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const parseRes = await response.json();
      if (response.ok) {
        toast.success(parseRes.message || "OTP resent successfully!");
        startCooldown();
      } else {
        throw new Error(parseRes.message || "Failed to resend OTP.");
      }
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  // Verify OTP & Register User
  const onVerify = async (values) => {
    setIsVerifying(true);
    try {
      const otp = values.otp;

      // Step 1: Verify OTP
      const verifyResponse = await fetch(`${baseURL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const verifyRes = await verifyResponse.json();

      if (!verifyResponse.ok) {
        throw new Error(verifyRes.message || "Failed to verify OTP.");
      }

      toast.success("OTP verified successfully! Registering your account...");

      // Step 2: Register the User
      const encryptedPassword = CryptoJS.SHA256(password).toString(
        CryptoJS.enc.Hex
      );

      const registerResponse = await fetch(`${baseURL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phoneNumber,
          email,
          password: encryptedPassword,
        }),
      });

      const registerRes = await registerResponse.json();

      if (!registerResponse.ok || !registerRes.token) {
        throw new Error(registerRes.message || "Failed to register user.");
      }

      // Step 3: Store token & log in the user
      localStorage.setItem("token", registerRes.token);
      setAuth(true); // Update authentication state

      toast.success("Registration successful! Redirecting...");

      // Step 4: Redirect to dashboard
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "An error occurred.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <section
      style={{
        padding: "0 140px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          padding: "30px 40px",
          borderRadius: "10px",
          maxWidth: "600px",
          margin: "50px auto",
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "15px",
          position: "relative",
        }}
      >
        {/* Back Button */}
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            fontSize: "16px",
          }}
          onClick={() => navigate("/register")}
        >
          Back
        </Button>

        <Title level={3} style={{ textAlign: "center" }}>
          Verify OTP
        </Title>

        <Divider>Enter the OTP sent to your email</Divider>

        <Form
          name="verify-otp"
          form={otpForm}
          className="verify-otp-form"
          style={{ maxWidth: "100%", margin: "0 auto", width: "290px" }}
          onFinish={onVerify}
        >
          <Form.Item
            name="otp"
            rules={[
              { required: true, message: "Please enter the OTP!" },
              { pattern: /^\d{6}$/, message: "OTP must be 6 digits." },
            ]}
          >
            <Input
              prefix={<NumberOutlined />}
              placeholder="Enter OTP"
              size="large"
            />
          </Form.Item>

          {/* Resend OTP Button (same style as Verify, starts disabled) */}
          <Form.Item>
            <Button
              type="primary"
              onClick={onResendOTP}
              disabled={cooldown > 0 || isResending}
              loading={isResending}
              style={{ width: "100%" }}
            >
              {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
            </Button>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="verify-button"
              style={{ width: "100%" }}
              loading={isVerifying}
              disabled={isVerifying}
            >
              Verify & Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};

export default VerifyOTP;
