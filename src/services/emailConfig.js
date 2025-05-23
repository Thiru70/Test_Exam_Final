// Email service configuration using EmailJS
// This file contains the configuration required to use EmailJS for sending emails

// EmailJS service configuration
// Create a free account at https://www.emailjs.com/
// Then create a service and template

export const EMAILJS_CONFIG = {
  // The public key from EmailJS dashboard
  PUBLIC_KEY: "s5Yl8_QB6y6BivamV", // Replace with your actual public key

  // Service ID from EmailJS dashboard 
  // This identifies which email service to use (like Gmail, Outlook, etc.)
  SERVICE_ID: "service_03mgdyi", // Replace with your actual service ID

  // Template ID for OTP verification email
  OTP_TEMPLATE_ID: "template_3jl8y3r", // Replace with your actual template ID
};

// This template should have these parameters:
// - {{to_name}} - The recipient's name
// - {{to_email}} - The recipient's email
// - {{otp}} - The OTP code
// - {{user_type}} - The type of user (student or company)

// Example template content:
// Hello {{to_name}},
// 
// Your verification code is: {{otp}}
// 
// This code will expire in 30 minutes. If you did not request this code, please ignore this email.
// 
// Account Type: {{user_type}}
// 
// Best regards,
// Student-Company Portal Team

export default EMAILJS_CONFIG;