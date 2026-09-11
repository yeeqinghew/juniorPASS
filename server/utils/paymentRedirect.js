const PRODUCTION_FRONTEND_URL = "https://www.juniorpass.sg";
const STAGING_FRONTEND_URL = "https://staging.juniorpass.sg";

const withoutTrailingSlash = (value) => value.replace(/\/+$/, "");

const isLocalUrl = (value) => {
  try {
    const { hostname } = new URL(value);
    return hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return false;
  }
};

const isValidHttpUrl = (value) => {
  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
};

function getPaymentRedirectUrl(req, env = process.env) {
  const environment = env.NODE_ENV || "development";
  const isDeployed = environment === "production" || environment === "staging";
  const allowedOrigins = new Set(
    (env.ALLOWED_ORIGINS || "")
      .split(",")
      .map((origin) => withoutTrailingSlash(origin.trim()))
      .filter(Boolean),
  );
  const requestOrigin = withoutTrailingSlash((req?.get?.("origin") || "").trim());
  const configuredOrigin = withoutTrailingSlash(
    (env.FRONTEND_URL || env.CLIENT_URL || "").trim(),
  );

  const originIsUsable = (origin) =>
    origin &&
    isValidHttpUrl(origin) &&
    (!isDeployed || !isLocalUrl(origin));

  let frontendOrigin;
  if (originIsUsable(requestOrigin) && allowedOrigins.has(requestOrigin)) {
    frontendOrigin = requestOrigin;
  } else if (originIsUsable(configuredOrigin)) {
    frontendOrigin = configuredOrigin;
  } else if (environment === "staging") {
    frontendOrigin = STAGING_FRONTEND_URL;
  } else if (environment === "production") {
    frontendOrigin = PRODUCTION_FRONTEND_URL;
  } else {
    frontendOrigin = "http://localhost:5173";
  }

  return `${frontendOrigin}/profile`;
}

module.exports = { getPaymentRedirectUrl };
