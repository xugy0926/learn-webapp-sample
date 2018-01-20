import mailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import config from '../config';

const transporter = mailer.createTransport(smtpTransport(config.email));
const SITE_ROOT_URL = `${config.url}`;

function sendMail(data) {
  const from = '<' + config.email.auth.user + '>';
  data.from = from;
  transporter.sendMail(data, err => {
    if (err) {
      console.log(err);
    }
  });
}

export function sendActiveMail(who, token, name) {
  const to = who;
  const subject = `${config.name}社区帐号激活`;
  const html =
    `<p>您好：${name}</p>` +
    `<p>我们收到您在${config.name}社区的注册信息，请点击下面的链接来激活帐户：</p>` +
    `<a href  = "${SITE_ROOT_URL}/api/v1/activeAccount?key=${token}&name=${name}">激活链接</a>` +
    `<p>若您没有在${config.name}社区填写过注册信息，说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>` +
    `<p>${config.name} 谨上。</p>`;
  
  sendMail({
    to,
    subject,
    html
  });
}
