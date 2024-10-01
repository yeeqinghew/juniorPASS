import React from "react";
import { Button } from "antd";
import "./index.css";
import homepageVideo from "../../videos/homepage.mp4"; // Import the video directly

function HomePage() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 1, // The video stays in the background
        }}
      >
        <source src={homepageVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay Content */}
      <div
        style={{
          position: "absolute",
          top: "50%", // Centers vertically
          left: "50%", // Centers horizontally
          transform: "translate(-50%, -50%)", // Centers the content
          zIndex: 2, // Content is above the video
          color: "#fff", // White text
          textAlign: "center",
          backgroundColor: "rgba(0, 0, 0, 0.4)", // Semi-transparent overlay
          padding: "50px",
          borderRadius: "15px",
        }}
      >
        <h1
          style={{
            fontSize: "3rem", // Large font size
            fontWeight: "bold", // Bold to match the screenshot
            lineHeight: "1.2", // Adjusts line spacing for readability
          }}
        >
          Let us help your kids grow into the best versions of themselves.
        </h1>

        <div style={{ marginTop: "20px" }}>
          <Button
            type="primary"
            size="large"
            style={{ margin: "0 10px", backgroundColor: "#fff", color: "#000" }}
          >
            Try for free!
          </Button>
          <Button
            size="large"
            style={{ margin: "0 10px", backgroundColor: "#fff", color: "#000" }}
          >
            About Us
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
