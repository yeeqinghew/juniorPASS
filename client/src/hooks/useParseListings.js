// hooks/useParseListings.js
import useParseArrayString from "./useParseArrayString";

const useParseListings = () => {
  const parseArrayString = useParseArrayString();

  const parseListings = (listings) => {
    return listings.map((listing) => {
      return {
        ...listing,
        categories: parseArrayString(listing?.categories),
        package_types: parseArrayString(listing?.package_types),
        age_groups: parseArrayString(listing?.age_groups),
      };
    });
  };

  return parseListings;
};

export default useParseListings;
