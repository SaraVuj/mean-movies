module.exports = {
    database: "mongodb://localhost:27017/mflix",
    secret: "secret",
    mailer: {
        from: process.env.MAILER_FROM || 'email address',
        options: {
          service: process.env.MAILER_SERVICE_PROVIDER || 'gmail',
          auth: {
            user: process.env.MAILER_EMAIL_ID || 'email adress',
            pass: process.env.MAILER_PASSWORD || 'your password'
          }
        }
    }
}