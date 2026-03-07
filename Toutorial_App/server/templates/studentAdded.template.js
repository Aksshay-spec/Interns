export const studentAddedTemplate = (user) => ({
  subject: "You Have Been Added as a Student",
  html: `
  <body style="margin:0;padding:0;background:#f8fafc;font-family:DM Sans,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
      <tr>
        <td align="center">
          <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;">
            <tr>
              <td style="padding:32px;">
                <h1 style="margin:0 0 16px;color:#0f172a;font-size:24px;font-weight:700;">Hello ${user.name},</h1>
                <p style="margin:0 0 12px;color:#334155;font-size:15px;line-height:1.7;">
                  You have been added to Tutorial App as a <strong>Student</strong>.
                </p>
                <p style="margin:0 0 12px;color:#334155;font-size:15px;line-height:1.7;">
                  You can now sign in using your registered email address and access student features.
                </p>
                <p style="margin:0;color:#334155;font-size:15px;line-height:1.7;">
                  Login URL: <a href="http://localhost:5173/login" style="color:#2563eb;text-decoration:none;">http://localhost:5173/login</a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 32px;border-top:1px solid #e2e8f0;">
                <p style="margin:0;color:#64748b;font-size:12px;">© ${new Date().getFullYear()} Tutorial App</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  `,
});
