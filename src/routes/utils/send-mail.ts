import * as nodemailer from 'nodemailer';
import { get as getConfig } from 'config';

export const sendEmail = async (content: any) => {
  const mailUser: string = getConfig('app.mailService.user');
  const mailPass: string = getConfig('app.mailService.pass');

  const transporter = nodemailer.createTransport({
    host: getConfig('app.mailService.host'),
    port: getConfig('app.mailService.port'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: mailUser, // generated user
      pass: mailPass, // generated password
    },
  });

  // send mail with defined transport object
  return await transporter.sendMail({
    from: content.from, // sender address
    to: content.to, // list of receivers
    subject: content.subject, // Subject line
    text: content.text, // plain text body
    html: content.body, // html body
  });
};
