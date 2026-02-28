import createTransporter from "../configs/emailConfig.js";

// Email Templates
const emailTemplates = {
  // Email to admin when new tenant registers
  newTenantRegistration: (tenantName, ownerName, ownerEmail) => ({
    subject: "New Tenant Registration - Pending Approval",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Tenant Registration</h2>
        <p>A new tenant has registered and is awaiting approval.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Tenant Name:</strong> ${tenantName}</p>
          <p><strong>Owner Name:</strong> ${ownerName}</p>
          <p><strong>Owner Email:</strong> ${ownerEmail}</p>
        </div>
        
        <p>Please log in to the admin dashboard to review and approve this request.</p>
        
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          This is an automated email. Please do not reply.
        </p>
      </div>
    `,
  }),

  // Email to tenant after registration
  tenantRegistrationConfirmation: (name, tenantName) => ({
    subject: "Registration Successful - Awaiting Approval",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome ${name}!</h2>
        <p>Thank you for registering with us.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Tenant Name:</strong> ${tenantName}</p>
          <p><strong>Status:</strong> Pending Approval</p>
        </div>
        
        <p>Your registration has been submitted successfully and is currently under review by our admin team.</p>
        <p>You will receive another email once your account has been approved.</p>
        
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          This is an automated email. Please do not reply.
        </p>
      </div>
    `,
  }),

  // Email to tenant when approved
  tenantApproved: (name, tenantName, loginUrl) => ({
    subject: "Your Account Has Been Approved!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #28a745;">Account Approved!</h2>
        <p>Dear ${name},</p>
        
        <p>Great news! Your tenant account has been approved.</p>
        
        <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28a745;">
          <p><strong>Tenant Name:</strong> ${tenantName}</p>
          <p><strong>Status:</strong> Active</p>
        </div>
        
        <p>You can now log in to your account and start using our services.</p>
        
        ${loginUrl ? `<a href="${loginUrl}" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Log In Now</a>` : ""}
        
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          This is an automated email. Please do not reply.
        </p>
      </div>
    `,
  }),

  // Email to tenant when blocked/rejected
  tenantBlocked: (name, tenantName) => ({
    subject: "Account Status Update",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc3545;">Account Status Update</h2>
        <p>Dear ${name},</p>
        
        <p>We regret to inform you that your tenant account has been blocked.</p>
        
        <div style="background-color: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #dc3545;">
          <p><strong>Tenant Name:</strong> ${tenantName}</p>
          <p><strong>Status:</strong> Blocked</p>
        </div>
        
        <p>If you believe this is a mistake or would like more information, please contact our support team.</p>
        
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          This is an automated email. Please do not reply.
        </p>
      </div>
    `,
  }),
};

// Generic function to send email
export const sendEmail = async (to, subject, html) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || "Tutorial App"}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
};

// Specific email functions
export const sendNewTenantNotificationToAdmin = async (
  adminEmail,
  tenantName,
  ownerName,
  ownerEmail
) => {
  const { subject, html } = emailTemplates.newTenantRegistration(
    tenantName,
    ownerName,
    ownerEmail
  );
  return await sendEmail(adminEmail, subject, html);
};

export const sendRegistrationConfirmation = async (
  userEmail,
  name,
  tenantName
) => {
  const { subject, html } = emailTemplates.tenantRegistrationConfirmation(
    name,
    tenantName
  );
  return await sendEmail(userEmail, subject, html);
};

export const sendApprovalNotification = async (
  userEmail,
  name,
  tenantName,
  loginUrl = null
) => {
  const { subject, html } = emailTemplates.tenantApproved(
    name,
    tenantName,
    loginUrl
  );
  return await sendEmail(userEmail, subject, html);
};

export const sendBlockNotification = async (userEmail, name, tenantName) => {
  const { subject, html } = emailTemplates.tenantBlocked(name, tenantName);
  return await sendEmail(userEmail, subject, html);
};
