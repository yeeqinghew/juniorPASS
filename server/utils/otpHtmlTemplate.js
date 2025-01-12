const otpHtmlTemplate = (otp) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your OTP</title>
  <style>
    body {
      font-family: "Arial", sans-serif;
      background-color: #FCFBF8; /* Neutral background */
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #FFFFFF; /* Clean white background */
      border-radius: 10px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      border: 1px solid #D2E7F5; /* Subtle blue border */
    }
    .email-header {
      background-color: #98BDD2; /* Calm blue */
      color: white;
      text-align: center;
      padding: 20px 15px;
    }
    .email-header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: bold;
    }
    .email-body {
      padding: 25px;
      text-align: center;
      color: #444444; /* Neutral text color */
    }
    .email-body p {
      margin: 10px 0;
      line-height: 1.6;
    }
    .otp-code {
      display: inline-block;
      font-size: 28px;
      font-weight: bold;
      color: #ED8092; /* Elegant pink for emphasis */
      background-color: #FFE3E3; /* Soft pink background for contrast */
      padding: 10px 20px;
      border-radius: 8px;
      letter-spacing: 3px;
      margin: 20px 0;
    }
    .email-footer {
      padding: 15px;
      font-size: 14px;
      text-align: center;
      background-color: #F4F8FC; /* Soft blue-gray footer */
      color: #666666; /* Subdued text */
    }
    .email-footer a {
      color: #98BDD2; /* Match header blue */
      text-decoration: none;
    }
    .btn {
      display: inline-block;
      background-color: #ED8092; /* Elegant pink button */
      color: white;
      text-decoration: none;
      padding: 12px 30px;
      border-radius: 6px;
      font-size: 16px;
      margin-top: 20px;
      transition: all 0.3s;
    }
    .btn:hover {
      background-color: #FFDEDE; /* Softer pink on hover */
      color: #ED8092; /* Match pink text */
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="email-header">
      <h1>Verify Your OTP</h1>
    </div>

    <!-- Body -->
    <div class="email-body">
      <p>Hello,</p>
      <p>We received a request to register your email with our service. Please use the OTP below to complete the verification process:</p>
      <div class="otp-code">${otp}</div>
      <p>If you didn’t request this, you can safely ignore this email.</p>
    </div>

    <!-- Footer -->
    <div class="email-footer">
      <p>Thank you for choosing our service!</p>
      <p><a href="https://www.juniorpass.sg">Visit our website</a></p>
    </div>
  </div>
</body>
</html>
`;
};

module.exports = {
  otpHtmlTemplate,
};
