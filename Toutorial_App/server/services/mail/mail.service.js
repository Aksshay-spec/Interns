
import transporter from "../../configs/mail.config.js";
import { MAIL_TYPES } from "./mail.constant.js";

import { tenantRegisterAdminTemplate } from "../../templates/tenantRegisterAdmin.template.js";
import { tenantWelcomeTemplate } from "../../templates/tenantWelcome.template.js";
import { tenantApprovedTemplate } from "../../templates/tenantApproved.template.js";
import { tenantInactiveTemplate } from "../../templates/tenantInactive.template.js";
import { tenantBlockedTemplate } from "../../templates/tenantBlocked.template.js";


export const sendTenantMail = async (type, tenant, options = {}) => {
  try {
    let mailData;
    let recipient;
    // console.log("Preparing to send email of type:", tenant, type);

    switch (type) {
      case MAIL_TYPES.TENANT_REGISTER_ADMIN:
        mailData = tenantRegisterAdminTemplate(tenant);
        recipient = process.env.ADMIN_EMAIL; // send to admin
        break;

      case MAIL_TYPES.TENANT_WELCOME:
        mailData = tenantWelcomeTemplate(tenant);
        recipient = tenant.email;
        break;

      case MAIL_TYPES.TENANT_APPROVED:
        mailData = tenantApprovedTemplate(tenant);
        console.log
        ("Tenant Approved Mail Data:", process.env.ADMIN_EMAIL);
        recipient = tenant.email;
        break;

      case MAIL_TYPES.TENANT_INACTIVE:
        mailData = tenantInactiveTemplate(tenant);
        recipient = tenant.email;
        break;

      case MAIL_TYPES.TENANT_BLOCKED:
        mailData = tenantBlockedTemplate(tenant);
        console.log("Tenant Approved Mail Data:", process.env.ADMIN_EMAIL);
        recipient = tenant.email;
        break;

      default:
        throw new Error("Invalid Mail Type");
    }

    await transporter.sendMail({
      from: `"Tutorial App" <${process.env.EMAIL_USER}>`,
      to: options.to || recipient,
      subject: mailData.subject,
      html: mailData.html,
    });

    // console.log(` Email sent successfully: ${type}`);
  } catch (error) {
    console.error(" Email sending failed:", error.message);
  }
};