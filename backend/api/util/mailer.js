const nodemailer = require('nodemailer');
const Transport = require('nodemailer-brevo-transport');
const ejs = require('ejs');

const transporter = nodemailer.createTransport(
  new Transport({ apiKey: process.env.API_KEY }),
);

const send = (template, options, to, subject) => {
  ejs.renderFile(template, options, (err, html) => {
    if (err) {
      throw err;
    }
    const mailOptions = {
      from: 'challenge.s2@server.com',
      to: to,
      subject: subject,
      html: html,
    };
    transporter.sendMail(mailOptions, err => {
      if (err) {
        throw err;
      }
    });
  });
};

module.exports = {
  transporter,
  send,
};
