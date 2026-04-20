import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sowmiyaashmithaa@gmail.com",       // sender Gmail
    pass: "lmsu mcek zosm ksgp"          // Gmail App Password
  }
});

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
) => {
  try {
    console.log("📩 EMAIL STARTED");
    console.log("TO:", to);

    const info = await transporter.sendMail({
      from: `"Evara" <sowmiyaashmithaa@gmail.com>`,
      to,
      subject,
      html
    });

    console.log("✔ EMAIL SENT SUCCESSFULLY");
    console.log("Message ID:", info.messageId);

    return info;
  } catch (error: any) {
    console.log("❌ EMAIL FAILED");
    console.log("Error:", error.message);
  }
};