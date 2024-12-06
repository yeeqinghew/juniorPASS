import { useEffect, useState } from "react";

// Helper function to get window dimensions and screen size category
function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;

  const isDesktop = width >= 1336; // Desktop: width >= 1024px
  const isTabletLandscape = 980 <= width && width <= 1335.9; // Tablet Landscape: 1024px <= width <= 1336px
  const isTabletPortrait = 768 <= width && width < 979.9; // Tablet Portrait: 768px <= width < 1024px
  const isMobile = width < 768; // Mobile: width < 768px

  return {
    width,
    height,
    isDesktop,
    isTabletLandscape,
    isTabletPortrait,
    isMobile,
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}
