export const tutorAddedTemplate = (user) => ({
  subject: "You Have Been Added as a Tutor",
  html: `
  <body style="margin:0;padding:0;background:#f8fafc;font-family:DM Sans,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
      <tr>
        <td align="center">
          <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;">
            
            <tr>
              <td style="padding:32px;">
                <h1 style="margin:0 0 16px;color:#0f172a;font-size:24px;font-weight:700;">
                  Hello ${user.name},
                </h1>

                <p style="margin:0 0 12px;color:#334155;font-size:15px;line-height:1.7;">
                  You have been successfully added to <strong>Tutorial App</strong> as a <strong>Tutor</strong>.
                </p>

                <p style="margin:0 0 16px;color:#334155;font-size:15px;line-height:1.7;">
                  To access your account for the first time, please follow the steps below to set your password:
                </p>

                <ol style="margin:0 0 18px 18px;color:#334155;font-size:15px;line-height:1.8;padding-left:10px;">
                  <li>Click the login link below.</li>
                  <li>On the login page, click the <strong>"Forgot Password"</strong> option.</li>
                  <li>Enter your registered email address.</li>
                  <li>You will receive a password reset link.</li>
                  <li>Open the link and create your new password.</li>
                  <li>After setting the password, return to the login page and sign in.</li>
                </ol>

                <p style="margin:0 0 16px;color:#334155;font-size:15px;">
                  Login URL:
                </p>

                <a href="http://localhost:5173/login"
                   style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;
                   padding:10px 18px;border-radius:8px;font-size:14px;font-weight:600;">
                   Go to Login Page
                </a>

              </td>
            </tr>

            <tr>
              <td style="padding:18px 32px;border-top:1px solid #e2e8f0;">
                <p style="margin:0;color:#64748b;font-size:12px;">
                  © ${new Date().getFullYear()} Tutorial App
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  `,
});