const nodeMailer = require('nodemailer');
const config = require('../config/mailer.config');

const transporter = nodeMailer.createTransport(config);

const sendMail = (reciever, callback) => {

    const linkHash = Buffer.from(reciever).toString('base64');

    const verifyLink = `http://localhost:3000/api/user/verify/${linkHash}`;

    const mailOptions = {
        from: config.auth.user,
        to: reciever,
        subject: 'Email-verificatie MijnWoongenoot',
        html: `<p>Please click the link below to verify your account:</p>
         <a href="${verifyLink}">${verifyLink}</a>`,
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            callback(err);
        } else {
            callback(null, info);
        }
    });
}

module.exports = {
    sendMail
}