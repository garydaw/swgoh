import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

async function sendImportEmail(subject, message) {

    await transporter.verify();

    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.IMPORT_EMAIL_TO,
        subject,
        text: message
    });

}

export default sendImportEmail;