// import { Options } from "nodemailer/lib/smtp-connection";

const { SMTP_HOST, SMTP_USERNAME, SMTP_PASSWORD } = process.env;

const SMTP_OPTIONS = {
  host: SMTP_HOST,
  //   port: +SMTP_PORT,
  secure: "production",
  auth: {
    user: SMTP_USERNAME,
    pass: SMTP_PASSWORD,
  },
};

module.exports = {
  SMTP_OPTIONS,
};
