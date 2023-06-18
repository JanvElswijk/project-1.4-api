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
        html: `<p>Klik op de link hieronder om uw account te verifieren:</p>
         <a href="${verifyLink}">${verifyLink}</a>
         <p>Staandaard staat uw telefoonnummer op prive, dit is aan te passen binnen de instellingen in de app</p>`,
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