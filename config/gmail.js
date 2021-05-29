
require('dotenv').config()
///////////////////////////////////////////////////////////////////////
/////////////////// configure chaoticbot nodemailer////////////////////
//////////////////////////////////////////////////////////////////////
const nodemailer =        require('nodemailer');

const transport = nodemailer.createTransport({
  service: process.env.TRANSPORT_SERVICE,
  auth: {
    user: process.env.TRANSPORT_SENDER,
    pass: process.env.TRANSPORT_PSWD
  }
})

module.exports = transport;
