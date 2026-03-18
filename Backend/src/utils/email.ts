import  nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mani30saravanan@gmail.com',       // Replace with your Gmail
    pass: 'qkxm jikz vopu hymn'   // Replace with your App Password
  }
});

// Email options
export async function sendEmail(email: string,sub:string,htmlContent:string) {
  try {
    const mailOptions = {
      from: 'mani30saravanan@gmail.com',
      to: email,                              
      subject: sub,
      text: 'Hello! This is a plain text email.',
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', email);
    console.log('Message ID:', info.messageId);
  } catch (error: any) {
    console.error(' Error sending email:', error.message);
  }
}
