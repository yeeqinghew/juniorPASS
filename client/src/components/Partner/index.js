import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import getBaseURL from "../../utils/config";

const Partner = () => {
  const baseURL = getBaseURL();
  const [listings, setListings] = useState();
  const [reviews, setReviews] = useState();
  const { state } = useLocation();
  const { partnerId } = useParams();
  const { listing } = state;
  console.log(state);

  const getPartnerDetails = async () => {
    try {
      const response = await fetch(`${baseURL}/partners/${partnerId}`);
      const { success, listings, reviews } = await response.json();
      if (success) {
        setListings(listings);
        setReviews(reviews);
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  useEffect(() => {
    getPartnerDetails();
  }, []);

  return <>{listing?.partner_name}</>;
};

export default Partner;
