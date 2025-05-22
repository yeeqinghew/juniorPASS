import React, { useState, useEffect } from "react";
import { ArrowLeftOutlined, NumberOutlined } from "@ant-design/icons";
import { Button, Form, Input, Typography, Divider } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import getBaseURL from "../utils/config";
import { useUserContext } from "./UserContext";
import CryptoJS from "crypto-js";

const { Title } = Typography;

const MAX_OTP_ATTEMPTS = 5;
const COOLDOWN_SECONDS = 60;

const getSessionOtpState = () => ({
  attempts: Number(sessionStorage.getItem("otpAttempts")) || 0,
  locked: sessionStorage.getItem("isOtpLocked") === "true",
  requested: sessionStorage.getItem("hasRequestedOtp") === "true",
});

const saveOtpState = (attempts, locked) => {
  sessionStorage.setItem("otpAttempts", attempts);
  sessionStorage.setItem("isOtpLocked", locked.toString());
};

const clearOtpState = () => {
  sessionStorage.removeItem("otpAttempts");
  sessionStorage.removeItem("isOtpLocked");
  sessionStorage.removeItem("hasRequestedOtp");
};

const setCooldownExpiry = () => {
  const expiresAt = Date.now() + COOLDOWN_SECONDS * 1000;
  sessionStorage.setItem("otpCooldownExpiresAt", expiresAt.toString());
};

const getCooldownTimeLeft = () => {
  const expiresAt = Number(sessionStorage.getItem("otpCooldownExpiresAt") || 0);
  return Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
};

const VerifyOTP = () => {
  const baseURL = getBaseURL();
  const [otpForm] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useUserContext();

  // User Data
  const userData = location.state || {};
  const { name, phoneNumber, email, password } = userData;

  // OTP State
  const [cooldown, setCooldown] = useState(() => getCooldownTimeLeft());
  const [otpAttempts, setOtpAttempts] = useState(
    () => getSessionOtpState().attempts
  );
  const [isOtpLocked, setIsOtpLocked] = useState(
    () => getSessionOtpState().locked
  );
  const [hasRequestedOtp, setHasRequestedOtp] = useState(
    () => getSessionOtpState().requested
  );

  // UI State
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Check whether email/password exists
  useEffect(() => {
    if (!email || !password) {
      toast.error("No user data found, please register again.");
      navigate("/register");
    }
  }, [email, password, navigate]);

  // Countdown Timer
  useEffect(() => {
    if (cooldown > 0) {
      const interval = setInterval(() => {
        const timeLeft = getCooldownTimeLeft();
        setCooldown(timeLeft);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [cooldown]);

  // Auto-unlock after cooldown
  useEffect(() => {
    if (cooldown <= 0 && otpAttempts >= MAX_OTP_ATTEMPTS) {
      clearOtpState();
      setOtpAttempts(0);
      setIsOtpLocked(false);
      setHasRequestedOtp(false);
    }
  }, [cooldown, otpAttempts]);

  // Send OTP Handler
  const sendOtp = async () => {
    setIsResending(true);
    try {
      const response = await fetch(`${baseURL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const parseRes = await response.json();
      if (response.ok) {
        toast.success(parseRes.message || "OTP sent successfully!");
        startCooldown();
        clearOtpState();

        setOtpAttempts(0);
        setIsOtpLocked(false);

        sessionStorage.setItem("hasRequestedOtp", "true");
        setHasRequestedOtp(true);
      } else {
        throw new Error(parseRes.message || "Failed to send OTP.");
      }
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const startCooldown = () => {
    setCooldownExpiry();
    setCooldown(getCooldownTimeLeft());
  };

  // Verify OTP Handler
  const onVerify = async (values) => {
    if (isOtpLocked) {
      toast.error(
        "Verification failed. Please click Resend OTP and try again.",
        {
          autoClose: 8000,
        }
      );
      return;
    }

    setIsVerifying(true);

    try {
      const otp = values.otp;

      const verifyResponse = await fetch(`${baseURL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const verifyRes = await verifyResponse.json();

      if (!verifyResponse.ok) {
        const attempts = otpAttempts + 1;
        const locked = attempts >= MAX_OTP_ATTEMPTS;

        setOtpAttempts(attempts);
        setIsOtpLocked(locked);
        saveOtpState(attempts, locked);

        if (locked) {
          toast.error(
            "Verification failed. Please click Resend OTP and try again."
          );
        } else {
          toast.error(verifyRes.message || "Enter a valid verification code.", {
            autoClose: 8000,
          });
        }
        return;
      }

      const encodedPhoneNumber = btoa(phoneNumber);
      const encryptedPassword = CryptoJS.SHA256(password).toString(
        CryptoJS.enc.Hex
      );

      const registrationData = {
        name,
        phoneNumber: encodedPhoneNumber,
        email,
        password: encryptedPassword,
      };

      const registerResponse = await fetch(`${baseURL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      });

      const registerRes = await registerResponse.json();

      if (!registerResponse.ok || !registerRes.token) {
        toast.error(registerRes.message || "Failed to register user.");
        return;
      }

      localStorage.setItem("token", registerRes.token);
      setAuth(true);
      clearOtpState();
      sessionStorage.removeItem("otpCooldownExpiresAt");
      toast.success("Registration successful! Redirecting...");
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

          <Form.Item>
            <Button
              type="primary"
              onClick={sendOtp}
              disabled={cooldown > 0 || isResending}
              loading={isResending}
              style={{ width: "100%" }}
            >
              {cooldown > 0
                ? `Resend OTP in ${cooldown}s`
                : hasRequestedOtp
                ? "Resend OTP"
                : "Send OTP"}
            </Button>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="verify-button"
              style={{ width: "100%" }}
              loading={isVerifying}
              disabled={isVerifying || isOtpLocked || !hasRequestedOtp}
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
