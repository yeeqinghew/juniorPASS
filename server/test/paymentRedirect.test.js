const test = require("node:test");
const assert = require("node:assert/strict");
const { getPaymentRedirectUrl } = require("../utils/paymentRedirect");

const requestFrom = (origin) => ({
  get: (header) => (header === "origin" ? origin : undefined),
});

test("uses the allowed requesting frontend in development", () => {
  assert.equal(
    getPaymentRedirectUrl(requestFrom("http://localhost:5173"), {
      NODE_ENV: "development",
      ALLOWED_ORIGINS: "http://localhost:5173,http://localhost:5174",
    }),
    "http://localhost:5173/profile",
  );
});

test("uses the deployed requesting frontend", () => {
  assert.equal(
    getPaymentRedirectUrl(requestFrom("https://www.juniorpass.sg"), {
      NODE_ENV: "production",
      ALLOWED_ORIGINS: "https://www.juniorpass.sg",
      FRONTEND_URL: "http://localhost:5173",
    }),
    "https://www.juniorpass.sg/profile",
  );
});

test("never returns localhost in production", () => {
  assert.equal(
    getPaymentRedirectUrl(requestFrom("http://localhost:5173"), {
      NODE_ENV: "production",
      ALLOWED_ORIGINS: "http://localhost:5173",
      FRONTEND_URL: "http://localhost:5173",
    }),
    "https://www.juniorpass.sg/profile",
  );
});

test("uses the staging fallback instead of localhost", () => {
  assert.equal(
    getPaymentRedirectUrl(requestFrom("http://localhost:5173"), {
      NODE_ENV: "staging",
      ALLOWED_ORIGINS: "http://localhost:5173",
    }),
    "https://staging.juniorpass.sg/profile",
  );
});
