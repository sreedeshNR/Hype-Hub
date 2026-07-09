const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"HypeHub" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your HypeHub Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #0f0f0f; padding: 40px; color: #ffffff;">
        
        <h1 style="color: #ff6b35;">HYPEHUB</h1>
        
        <p style="font-size: 16px;">Your verification code is:</p>
        
        <div style="
          background-color: #1a1a1a; 
          padding: 20px; 
          text-align: center; 
          border-radius: 8px;
          margin: 20px 0;
        ">
          <h2 style="
            color: #ff6b35; 
            font-size: 36px; 
            letter-spacing: 10px;
            margin: 0;
          ">${otp}</h2>
        </div>

        <p style="color: #aaaaaa; font-size: 14px;">
          This code expires in <strong style="color:#ffffff;">1 minute</strong>.
        </p>

        <p style="color: #aaaaaa; font-size: 14px;">
          If you didn't request this, please ignore this email.
        </p>

        <hr style="border-color: #333;" />
        <p style="color: #555; font-size: 12px;">© 2024 HypeHub Marketplace</p>

      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

console.log(sendOTPEmail);


module.exports = sendOTPEmail;