import nodemailer from 'nodemailer';
import { CustomError } from './customError';
import { HTTP_STATUS_CODE } from './httpResponse';
import dotenv from 'dotenv';
import * as fs from 'fs/promises';
import * as path from 'path';
// import {NewsLetter} from '../models/newsLettermodel'; // Newsletter model not implemented

// Load environment variables
dotenv.config();

interface EmailTemplateData {
    [key: string]: string | number;
}

class EmailService {
    private transporter: nodemailer.Transporter;
    private templatesDir = path.join(__dirname, '..', 'templates', 'newsletters');
    private defaultTemplatesDir = path.join(__dirname, '..', 'templates', 'default');

    constructor() {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            throw new Error('Email configuration is missing. Please check SMTP_USER and SMTP_PASS in .env file');
        }

        // Initialize transporter with environment variables
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            tls: {
                rejectUnauthorized: false
            },
            debug: true,
            logger: true
        });
    }

    private async getTemplate(slug: string): Promise<string> {
        try {
            // Get default template
            const defaultTemplatePath = path.join(this.defaultTemplatesDir, `${slug}.html`);
            const template = await fs.readFile(defaultTemplatePath, 'utf-8');
            return template;
        } catch (error) {
            console.error(`Template not found for slug: ${slug}`);
            throw new CustomError('Email template not found', HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
        }
    }

    private replaceTemplateVariables(template: string, data: EmailTemplateData): string {
        let result = template;
        for (const [key, value] of Object.entries(data)) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            result = result.replace(regex, String(value));
        }
        return result;
    }

    private wrapTemplateWithHtml(content: string): string {
        return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta name="format-detection" content="telephone=no" />
    <meta name="format-detection" content="date=no" />
    <meta name="format-detection" content="address=no" />
    <meta name="format-detection" content="email=no" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Bookadzone</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f4f4f4; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
    ${content}
</body>
</html>`;
    }

    private async sendEmail(to: string, subject: string, templateSlug: string, templateData: EmailTemplateData): Promise<void> {
        try {
            const template = await this.getTemplate(templateSlug);
            const contentWithVariables = this.replaceTemplateVariables(template, {
                ...templateData,
                year: new Date().getFullYear(),
            });
            
            const htmlContent = this.wrapTemplateWithHtml(contentWithVariables);

            // Configure email with proper MIME settings
            await this.transporter.sendMail({
                from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
                to,
                subject,
                html: htmlContent,
                alternatives: [{
                    contentType: 'text/html; charset=utf-8',
                    content: htmlContent
                }],
                messageId: `<${Date.now()}@bookadzone.com>`,
                headers: {
                    'MIME-Version': '1.0',
                    'X-Mailer': 'Bookadzone Mailer'
                }
            });
        } catch (error) {
            console.error('Email sending error:', error);
            throw new CustomError('Failed to send email', HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
        }
    }

    async sendWelcomeEmail(to: string, name: string): Promise<void> {
        await this.sendEmail(to, 'Welcome to Bookadzone!', 'welcome-email', {
            name,
            loginUrl: `${process.env.FRONTEND_URL}/login`,
        });
    }

    async sendPasswordResetEmail(to: string, resetToken: string): Promise<void> {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        await this.sendEmail(to, 'Password Reset Request', 'reset-password', {
            resetUrl,
        });
    }
}

export default new EmailService();