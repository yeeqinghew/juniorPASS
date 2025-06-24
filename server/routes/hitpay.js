router.get("/", async (req, res) => {
  // sandbox env
  const { amount, user } = req.body;
  const { email, name } = user;
  const res = await fetch(
    "https://api.sandbox.hit-pay.com/v1/payment-requests",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-BUSINESS-API-KEY": process.env.hitPaySandboxApiKey,
      },
      body: JSON.stringify({
        amount,
        currency: "SGD",
        email,
        name,
        purpose: "",
        description: "Top up store credit",
        paymentMethods: ["hitpay_wallet", "card"],
        reference_number: "", // TODO: generate unique reference number
        redirect_url: "", // TODO
        webhook_url: "", // TODO
        expiry_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // TODO: 15 mins expiry
      }),
    }
  );

  const response = await res.json();
  const {
    id,
    name: resName,
    email: resEmail,
    phone,
    amount: resAmount,
    currency,
    status,
    purpose,
    reference_number,
    payment_methods,
    url,
    redirect_url,
    webhook,
    send_sms,
    send_email,
    sms_status,
    email_status,
    allow_repeated_payments,
    expiry_date,
    created_at,
    updated_at,
  } = response;

  // TODO: return the url to the client for init
  // TODO: return the id to the client for paymentRequest, amount, method for toggle
});

module.exports = router;
