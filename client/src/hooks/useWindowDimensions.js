import { useEffect, useState } from "react";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  const isDesktop = width >= 1024;
  // const isTabletLandscape = 1024 <= width && width <= 1336;
  const isMobile = 375 < width && width < 768;

  return {
    width,
    height,
    isDesktop,
    // isTabletLandscape,
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
