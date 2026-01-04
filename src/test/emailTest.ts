import emailService from '../utils/emailConfig';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testEmail() {
  try {
    console.log('Testing with email configuration:');
    console.log('SMTP_USER:', process.env.SMTP_USER);
    console.log('SMTP_PASS length:', process.env.SMTP_PASS?.length || 0);
    
    await emailService.sendPasswordResetEmail('test@example.com', 'test-token');
    console.log('Email sent successfully!');
  } catch (error: any) {
    console.error('Email test failed:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    if (error.code) console.error('Error code:', error.code);
    if (error.command) console.error('Error command:', error.command);
    if (error.response) console.error('Server response:', error.response);
  }
}

testEmail();