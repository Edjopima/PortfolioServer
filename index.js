const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
const { google } = require("googleapis");
const { buildTemplate } = require("./template");
require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.listen(process.env.PORT, () => {
  console.log(`we are live on port ${process.env.PORT}`);
});

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendMail = async ({ name, email, subject, message }) => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const smtpTransport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.GMAIL_USER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accesToken: accessToken,
      },
    });

    const template = buildTemplate({
      name,
      email,
      message,
    });

    const mailOptions = {
      from: `Portfolio <${process.env.GMAIL_USER}>`,
      to: process.env.EMAIL_TO_SEND,
      subject: subject,
      html: template,
    };
    const result = await smtpTransport.sendMail(mailOptions);
    return result;
  } catch (err) {
    console.log(err);
  }
};

const sendMailTrapMail = async ({ name, email, subject, message }) => {
  try {
    const smtpTransport = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    const template = buildTemplate({
      name,
      email,
      subject,
    });

    const mailOptions = {
      from: `Portfolio <${process.env.GMAIL_USER}>`,
      to: process.env.EMAIL_TO_SEND,
      subject: subject,
      html: template,
    };
    const result = await smtpTransport.sendMail(mailOptions);
    return result;
  } catch (err) {
    console.log(err);
  }
};

app.post("/sendMail", (req, res) => {
  sendMail(req.body)
    .then((result) => res.status(200).json("Send"))
    .catch((err) => console.log(err));
});

app.post("/sendMailTrapMail", (req, res) => {
  sendMailTrapMail(req.body)
    .then((result) => res.status(200).json("Send"))
    .catch((err) => console.log(err));
});

app.post;
