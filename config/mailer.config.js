module.exports = {
    host: process.env.MAILER_HOST || 'smtp.gmail.com',
    port: process.env.MAILER_PORT || 465,
    secure: true,
    auth: {
        user: process.env.MAILER_USER || 'testmijnwoongenoot@gmail.com',
        pass: process.env.MAILER_PASSWORD || 'lvgkkuoqvewvjdky'
    }
}