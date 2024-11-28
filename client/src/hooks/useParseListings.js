// hooks/useParseListings.js
import useParseArrayString from "./useParseArrayString";

const useParseListings = () => {
  const parseArrayString = useParseArrayString();

  const parseListings = (listings) => {
    return listings.map((listing) => {
      return {
        ...listing,
      };
    });
  };

  return parseListings;
};

export default useParseListings;
