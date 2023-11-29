const nodemailer = require('nodemailer');
const Transport = require('nodemailer-brevo-transport');

const transporter = nodemailer.createTransport(
  new Transport({ apiKey: process.env.MAILER_API_KEY }),
);

module.exports = {
  transporter,
};
