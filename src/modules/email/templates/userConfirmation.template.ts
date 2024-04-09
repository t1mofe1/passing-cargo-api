import User from '../../../models/User.model';

type UserConfirmationEmailTemplateProps = {
  confirmUrl: string;
  user: User;
  expirationTime: number;
};
export function userConfirmationEmailTemplate(
  props: UserConfirmationEmailTemplateProps,
) {
  const { confirmUrl, user, expirationTime } = props;

  const html = `
    <html>
      <body style="font-family: Helvetica, sans-serif; -webkit-font-smoothing: antialiased; font-size: 12px; line-height: 1.4; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; background-color: #ffffff; margin: 0; padding: 0;">
        <div style="font-size: 20px;">Hi ${user.first_name} ${user.last_name},</div>
          <div style="margin: 15px 0;">
            Thanks for using Passing Cargo. Please verify your email address by clicking the button below.
          </div>
          <div style="padding: 10px 0; text-align: left; vertical-align: top;">
            <a href="${confirmUrl}" style="box-sizing: border-box; text-decoration: none; background-color: #007bff; border: solid 1px #007bff; border-radius: 4px; cursor: pointer; color: #ffffff; font-size: 16px; font-weight: bold; margin: 0; padding: 9px 25px; display: inline-block; letter-spacing: 1px;">
              Verify email address
            </a>
          </div>
          <div style="margin: 15px 0;">
            You have ${expirationTime} minutes before that link to be expired.
          </div>
      </body>
    </html>`;

  const text = `Thanks for using Passing Cargo. Please verify your email address by following this link: ${confirmUrl}. You have ${expirationTime} minutes before that link to be expired.`;

  const subject = '[Passing Cargo] Please confirm your email address';

  return { html, text, subject };
}
