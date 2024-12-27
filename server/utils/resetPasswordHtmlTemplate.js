const resetPasswordHtmlTemplate = (resetURL) => `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forgot Password</title>
    <link rel="stylesheet" href="styles.css">
</head>

<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #d2e7f5">
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
        <div style="width: 400px; padding: 20px; text-align: center; border-radius: 10px; box-shadown: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="margin-bottom: 20px; text-align: center;">
                <img src="https://juniorpass.s3.ap-southeast-1.amazonaws.com/private/logopngResize.png" alt="Junior Pass Icon" style="width: 100px;" />
            </div>
            <div style="margin-bottom: 20px;">
                <img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/3996/Forgot_Password.gif" alt="Polar Bear Icon" style="" />
            </div>
            <h3 style="color: #333; margin-bottom: 10px;">Forgot Your Password?</h3>
            <p style="font-size: 14px; color: #666; margin-bottom: 20px;">
                We received a request to reset the password for your account associated with this email address.
                If you made this request, please click the button below to reset your password:
            </p>
            <button style="padding: 10px 15px; background-color: #98bdd2; color: white; border: none; border-radius: 5px; cursor: pointer; margin-bottom: 15px; width: 100%;" href=${resetURL}>Reset Password</button>
            
            <div style="display: block; text-align: start; ">
                <p style="font-size: 12px; color: #666; margin-bottom: 10px;">
                    If the button above doesn’t work, copy and paste the following link into your browser:
                </p>
                <input type="text" value=${resetURL} readonly style=" margin-top: 10px; width: 100%; padding: 5px; border: 1px solid #ddd; border-radius: 5px; text-align: center; font-size: 14px; background-color: #d2e7f5" />
                <p style="font-size: 12px; color: #999; margin-top: 10px;">
                    This link will expire in 15 minutes for your security. If you didn’t request a password reset,
                    please ignore this email or contact our support team if you have any concerns.
                </p>
            </div>
        </div>
    </div>
</body>

</html>
`;

module.exports = {
  resetPasswordHtmlTemplate,
};
