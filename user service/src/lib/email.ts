import { Resend } from "resend";

let resend: InstanceType<typeof Resend> | null = null;

const getResend = () => {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not defined in environment variables");
    }
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
};

export const sendOTPEmail = async (email: string, otp: string) => {
  const resendClient = getResend();
  
  try {
    await resendClient.emails.send({
      from: "Atmos <onboarding@resend.dev>",
      to: email,
      subject: "Your Atmos Email Verification Code",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                background-color: #0f0f0f;
                color: #ffffff;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #1DB954 0%, #1ed760 100%);
                padding: 40px 20px;
                text-align: center;
                border-radius: 12px 12px 0 0;
              }
              .header h1 {
                font-size: 48px;
                margin: 0;
                font-weight: 900;
                letter-spacing: 2px;
              }
              .content {
                background-color: #1a1a1a;
                padding: 40px 20px;
                border-radius: 0 0 12px 12px;
              }
              .welcome {
                font-size: 24px;
                font-weight: 700;
                margin-bottom: 16px;
                color: #1DB954;
              }
              .message {
                font-size: 16px;
                line-height: 1.6;
                color: #b3b3b3;
                margin-bottom: 32px;
              }
              .otp-container {
                text-align: center;
                margin: 40px 0;
              }
              .otp-box {
                display: inline-block;
                background: linear-gradient(135deg, #1DB954 0%, #1ed760 100%);
                color: #000000;
                padding: 20px 40px;
                border-radius: 12px;
                font-size: 36px;
                font-weight: 900;
                letter-spacing: 8px;
                font-family: 'Courier New', monospace;
              }
              .divider {
                border: none;
                border-top: 1px solid #282828;
                margin: 32px 0;
              }
              .footer {
                font-size: 12px;
                color: #666;
                line-height: 1.6;
                text-align: center;
              }
              .footer p {
                margin: 8px 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>ATMOS</h1>
              </div>
              <div class="content">
                <div class="welcome">Verify Your Email</div>
                <div class="message">
                  Your Atmos account is almost ready! Use the code below to verify your email address and complete your registration.
                </div>
                <div class="otp-container">
                  <div class="otp-box">${otp}</div>
                </div>
                <div class="message">
                  Enter this code in the verification popup to confirm your email.
                </div>
                <hr class="divider">
                <div class="footer">
                  <p>This code will expire in <strong>10 minutes</strong>.</p>
                  <p>If you didn't sign up for Atmos, please ignore this email.</p>
                  <p>© 2026 Atmos. All rights reserved.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });
  } catch (error) {
    console.error("OTP email sending failed:", error);
    throw error;
  }
};