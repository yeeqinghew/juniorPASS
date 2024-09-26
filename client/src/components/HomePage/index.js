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
          objectFit: "cover", // Ensures the video covers the area without distortion
          zIndex: 1, // set video z-index to 1, so it stays in the background
        }}
      >
        <source src={homepageVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay Content */}
      <div
        style={{
          position: "relative", // set relative to ensure it sits over the video
          zIndex: 2, // higher than the video to be visible
          color: "white",
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black overlay
          padding: "50px",
          borderRadius: "15px",
          textAlign: "center",
        }}
      >
        <h1>
          Let us help your kids grow into the best versions of themselves.
        </h1>

        <div style={{ marginTop: "20px" }}>
          <Button type="primary" size="large" style={{ margin: "0 10px" }}>
            Try for free!
          </Button>
          <Button size="large" style={{ margin: "0 10px" }}>
            About Us
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
