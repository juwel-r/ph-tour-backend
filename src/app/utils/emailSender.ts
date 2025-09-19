import nodemailer from "nodemailer";
import { envVar } from "../config/env.config";
import path from "path";
import ejs from "ejs";
import AppError from "../errorHelpers/AppError";
const transport = nodemailer.createTransport({
  host: envVar.SMTP_HOST,
  port: Number(envVar.SMTP_PORT),
  secure: true,
  auth: {
    user: envVar.SMTP_USER,
    pass: envVar.SMTP_PASS,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData?: Record<string, any>;
  attachments?: [
    {
      filename: string;
      content: Buffer | string;
      contentType: string;
    }
  ];
}

export const sendEmail = async ({
  to,
  subject,
  attachments,
  templateName,
  templateData,
}: SendEmailOptions) => {
  try {
    const templatePath = path.join(__dirname, `templates/${templateName}.ejs`);
    const html = await ejs.renderFile(templatePath, templateData);
    const info = await transport.sendMail({
      from: envVar.SMTP_FROM,
      to: to,
      subject: subject,
      html: html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    });
    console.log(`\u2709\ufe0f Email set to ${to}:${info.messageId}`);
  } catch (error: any) {
    console.log("Email sending error", error);
    throw new AppError(401, "Email sending failed.");
  }
};
