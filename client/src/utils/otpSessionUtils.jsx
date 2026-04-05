const MAX_OTP_ATTEMPTS = 5;
const COOLDOWN_SECONDS = 60;

export const SESSION_KEYS = {
  attempts: "register_otpAttempts",
  locked: "register_isOtpLocked",
  requested: "register_hasRequestedOtp",
  cooldownExpiresAt: "register_otpCooldownExpiresAt",
};

export const getSessionOtpState = () => ({
  attempts: Number(sessionStorage.getItem(SESSION_KEYS.attempts)) || 0,
  locked: sessionStorage.getItem(SESSION_KEYS.locked) === "true",
  requested: sessionStorage.getItem(SESSION_KEYS.requested) === "true",
});

export const saveOtpState = (attempts, locked) => {
  sessionStorage.setItem(SESSION_KEYS.attempts, attempts);
  sessionStorage.setItem(SESSION_KEYS.locked, locked.toString());
};

export const clearOtpState = () => {
  Object.values(SESSION_KEYS).forEach((key) => sessionStorage.removeItem(key));
};

export const setCooldownExpiry = () => {
  const expiresAt = Date.now() + COOLDOWN_SECONDS * 1000;
  sessionStorage.setItem(SESSION_KEYS.cooldownExpiresAt, expiresAt.toString());
};

export const getCooldownTimeLeft = () => {
  const expiresAt = Number(
    sessionStorage.getItem(SESSION_KEYS.cooldownExpiresAt) || 0
  );
  return Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
};

export { MAX_OTP_ATTEMPTS, COOLDOWN_SECONDS };
