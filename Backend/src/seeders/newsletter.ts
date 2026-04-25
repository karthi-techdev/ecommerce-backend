import mongoose from "mongoose";
import { NewsLetterModel } from "../models/newsLetterModel";
import { createTemplateFile } from "../utils/templateHelper";
import fs from "fs";
import path from "path";


interface INewsLetter {
    name: string;
    slug: string;
    description: string;
    coverImage: string;
    isPublished: boolean;
    isDeleted: boolean;
    publishedAt?: Date;
}

const seedNews = async (): Promise<void> => {
    try {
        await NewsLetterModel.deleteMany();

      const templateDir = path.join(process.cwd(), "src/templates/newsletters");

if (fs.existsSync(templateDir)) {
  const files = fs.readdirSync(templateDir);

  for (const file of files) {
    const filePath = path.join(templateDir, file);
    fs.unlinkSync(filePath);
  }

  console.log("Old templates deleted");
}

        const resetPasswordTemplate = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Reset Password</title>
</head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f4f4f4;">
<table align="center" width="600" style="background:#ffffff;">
<tr>
<td style="padding:20px;background:#7952b3;color:white;text-align:center;">
<h1>Password Reset Request</h1>
</td>
</tr>

<tr>
<td style="padding:20px;">
<p>Hello,</p>

<p>We received a request to reset your password.</p>

<div style="text-align:center;margin:20px;">
<a href="{{resetUrl}}" 
style="background:#7952b3;color:white;padding:12px 24px;text-decoration:none;border-radius:4px;">
Reset Password
</a>
</div>

<p>If you didn't request this, ignore this email.</p>

<p>&copy; {{year}} Bookadzone</p>

</td>
</tr>
</table>
</body>
</html>
`;

        const subscriber = `
<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="format-detection" content="telephone=no" />
    <meta name="format-detection" content="date=no" />
    <meta name="format-detection" content="address=no" />
    <meta name="format-detection" content="email=no" />
    <title>Welcome to Avenstek</title>
    <!-- Forcing initial-scale shouldn't be necessary -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <style type="text/css">
        /* Forces Outlook.com to display emails at full width */
        .ExternalClass {
            width: 100%;
        }

        /* Forces Outlook.com to display normal line spacing */
        .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
            line-height: 100%;
        }

        /* Prevents Webkit and Windows Mobile platforms from changing default font sizes. */
        body,
        table,
        td,
        p,
        a,
        li,
        blockquote {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        /* Resets all body margins and padding to "0" for good measure */
        body {
            margin: 0;
            padding: 0;
        }

        /* Resolves webkit padding issue. */
        table {
            border-spacing: 0;
        }
    </style>
</head>

<body bgcolor="#f4f4f4" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
    <!-- Preview Text (visible in email clients that support it) -->
    <div
        style="display:none;font-size:1px;color:#333333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
        Welcome to Avenstek - Your journey to effective advertising begins here!
    </div>

    <!-- Email Body -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%; background-color: #f4f4f4;">
        <tr>
            <td align="center" valign="top" style="padding: 20px 0;">
                <!-- Main Content Table -->
                <table border="0" cellpadding="0" cellspacing="0" width="600" class="wrapper"
                    style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td align="center" bgcolor="#f59e0b" style="padding: 40px 20px; border-radius: 8px 8px 0 0;">
                            <h1
                                style="color: #ffffff; font-family: Arial, sans-serif; margin: 0; font-size: 24px; line-height: 30px;">
                                Welcome to Avenstek!</h1>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td bgcolor="#ffffff" style="padding: 40px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <!-- Greeting -->
                                <tr>
                                    <td
                                        style="padding-bottom: 20px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #333333;">
                                        Hello <strong></strong>,
                                    </td>
                                </tr>
                                <!-- Welcome Message -->
                                <tr>
                                    <td
                                        style="padding-bottom: 20px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #333333;">
                                        Welcome to Avenstek! We're excited to have you on board.
                                    </td>
                                </tr>
                                <!-- Features List -->
                                <tr>
                                    <td style="padding-bottom: 20px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td
                                                    style="font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #333333; padding-bottom: 10px;">
                                                    With your new account, you can:
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 0 0 20px 20px;">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <td
                                                                style="font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #333333; padding: 5px 0;">
                                                                • Browse advertising opportunities
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style="font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #333333; padding: 5px 0;">
                                                                • Manage your campaigns
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style="font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #333333; padding: 5px 0;">
                                                                • Track your performance
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style="font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #333333; padding: 5px 0;">
                                                                • Connect with advertisers
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <!-- CTA Button -->
                                <tr>
                                    <td align="center" style="padding: 30px 0;">
                                        <table border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td align="center" bgcolor="#f59e0b" style="border-radius: 4px;">
                                                    <a href="http://localhost:3000" target="_blank"
                                                        style="font-family: Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; padding: 15px 30px; border: 1px solid #f59e0b; display: inline-block; font-weight: bold;">Get
                                                        Started</a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <!-- Support Message -->
                                <tr>
                                    <td
                                        style="padding-bottom: 20px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #333333;">
                                        If you have any questions, our support team is always here to help!
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td bgcolor="#f8f9fa"
                            style="padding: 20px 30px; border-radius: 0 0 8px 8px; border-top: 1px solid #dee2e6;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center"
                                        style="font-family: Arial, sans-serif; font-size: 12px; line-height: 18px; color: #666666;">
                                        &copy; {{year}} Avenstek. All rights reserved.
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
`;

        const resetPasswordmailTemplate = `<div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <!-- Header Section -->
    <div style="background-color: #7952b3; padding: 40px 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">Password Reset Request</h1>
    </div>

    <!-- Content Section -->
    <div style="padding: 40px 30px; background-color: #ffffff;">
        <div style="color: #333333;">
            <p style="margin: 0 0 20px 0;">Hello,</p>
            <p style="margin: 0 0 20px 0;">We received a request to reset your password for your Bookadzone account. Click the button below to reset it:</p>
            
            <!-- Button -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{resetUrl}}" style="display: inline-block; padding: 16px 36px; background-color: #7952b3; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 16px; font-weight: bold;">Reset Password</a>
            </div>

            <div style="padding: 20px; background-color: #f8f9fa; border-radius: 4px; margin: 20px 0;">
                <p style="margin: 0; color: #666666; font-size: 14px;">⚠️ This password reset link:</p>
                <ul style="margin: 10px 0; color: #666666; font-size: 14px;">
                    <li>Will expire in 1 hour</li>
                    <li>Can only be used once</li>
                    <li>Should be kept secure and not shared</li>
                </ul>
            </div>

            <p style="margin: 0 0 20px 0;">If you didn't request this reset, you can safely ignore this email. Your account security is important to us, so please contact support if you have concerns.</p>
        </div>
    </div>

    <!-- Footer Section -->
    <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #dee2e6;">
        <p style="margin: 0 0 10px 0; font-size: 12px; color: #666666;">This is an automated message, please do not reply to this email.</p>
        <p style="margin: 0; font-size: 12px; color: #666666;">© {{year}} Bookadzone. All rights reserved.</p>
    </div>
</div>`;

        const welcomemail = ` <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <!-- Header -->
    <div style="background-color: #7952b3; padding: 40px 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">Welcome to Bookadzone!</h1>
    </div>

    <!-- Content -->
    <div style="padding: 40px 30px; background-color: #ffffff;">
        <div style="color: #333333;">
            <p style="margin: 0 0 20px 0;">Hello {{name}},</p>
            <p style="margin: 0 0 20px 0;">Welcome to <strong>Bookadzone</strong>! 🎉 We're thrilled to have you join our community of advertisers and publishers.</p>
            <p style="margin: 0 0 20px 0;">With your new account, you can:</p>
            <ul style="margin: 0 0 20px 0; padding-left: 20px; color: #333333;">
                <li style="margin-bottom: 10px;">Browse advertising opportunities</li>
                <li style="margin-bottom: 10px;">Manage your campaigns</li>
                <li style="margin-bottom: 10px;">Track your performance</li>
                <li style="margin-bottom: 10px;">Connect with advertisers</li>
            </ul>
            
            <!-- Button -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{loginUrl}}" style="display: inline-block; padding: 16px 36px; background-color: #7952b3; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 16px; font-weight: bold;">Get Started</a>
            </div>
            
            <p style="margin: 0 0 20px 0;">If you have any questions, our support team is always here to help!</p>
            <p style="margin: 0 0 20px 0; font-style: italic;">— The Bookadzone Team</p>
        </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #dee2e6;">
        <p style="margin: 0 0 10px 0; font-size: 12px; color: #666666;">This is an automated message, please do not reply to this email.</p>
        <p style="margin: 0; font-size: 12px; color: #666666;">© {{year}} Bookadzone. All rights reserved.</p>
    </div>
</div>`;
        const NewsLetter: INewsLetter[] = [
            {
                name: "Forgot Password",
                slug: "forgot-password",
                description: resetPasswordTemplate,
                coverImage: "uploads/newsletters/default.jpg",
                isPublished: true,
                isDeleted: false,
                publishedAt: new Date(),

            },
            {
                name: "Subscriber Email",
                slug: "subscriber-email",
                description: subscriber,
                coverImage: "uploads/newsletters/default.jpg",
                isPublished: true,
                isDeleted: false,
                publishedAt: new Date(),

            },

            {
                name: "Reset Password Mail",
                slug: "reset-password-mail",
                description: resetPasswordmailTemplate,
                coverImage: "uploads/newsletters/default.jpg",
                isPublished: true,
                isDeleted: false,
                publishedAt: new Date(),

            },
            {
                name: "Welcome Email",
                slug: "welcome-mail",
                description: welcomemail,
                coverImage: "uploads/newsletters/default.jpg",
                isPublished: true,
                isDeleted: false,
                publishedAt: new Date(),

            }
        ]

        for (const item of NewsLetter) {
            createTemplateFile(item.slug, item.description);
        }

        await NewsLetterModel.insertMany(NewsLetter);
        console.log(" NewsLetters data seeded successfully");
    } catch (error) {
        console.error("Seeding Newsletter failed:", error);
    }
};

export default seedNews;