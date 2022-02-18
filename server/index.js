const SMTPServer = require("smtp-server").SMTPServer;
const express = require("express");
const parser = require("mailparser").simpleParser;
const fs = require("fs");
const cors = require("cors");
require("dotenv").config();

const AUTH_NUMBER_AGE = 1000 * 60; // default 1 min
let authNumber = null;

const app = express();

app.use(cors({ origin: "https://iam2.kaist.ac.kr" }));

app.get(process.env.CODE_ENDPOINT, (_, res) => {
  res.json({ code: authNumber });
  clearAuthNumber();
});

const logError = (error) => {
  fs.appendFile(`./error.log`, error);
};

const clearAuthNumber = () => {
  authNumber = null;
};

const setAuthenticationNumber = async (data) => {
  try {
    const { subject, from, to, text } = data;
    const { address } = from.value[0];

    if (
      address === process.env.AUTHENTICATION_MAIL_FROM &&
      subject.indexOf(process.env.AUTHENTICATION_MAIL_TITLE >= 0)
    ) {
      const regex = /인증번호: (\d{6})/;
      const result = text.match(regex);
      authNumber = result[1];
      setTimeout(clearAuthNumber, AUTH_NUMBER_AGE);
    }
  } catch (error) {
    console.log(error);
  }
};

const onData = (stream, _, callback) => {
  parser(stream, {}, (error, parsed) => {
    if (error) return logError(error);
    setAuthenticationNumber(parsed);
    return callback();
  });
};

const mailServer = new SMTPServer({
  name: `smtp.${process.env.SERVER_HOST}`,
  secure: false,
  socketTimeout: 1000 * 60 * 10, // Default 10 mins
  disabledCommands: ["AUTH"],
  onData,
});

mailServer.on("error", (error) => {
  logError(error);
});

app.listen(process.env.PORT, () => {
  mailServer.listen(25);
  console.log("Server is running");
});
