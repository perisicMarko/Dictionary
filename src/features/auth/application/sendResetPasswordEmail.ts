'use server'
import nodemailer from 'nodemailer';

export default async function sendEmail(email : string, token : Base64URLString){
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      
      // configuring mail
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Reset password',
        text: 'Click on this link to reset your password: remindmedictionary.com/resetPassword/' + token,
      };
    
    try {
      // sending mail
      await transporter.sendMail(mailOptions);
      return { errorMessage: 'Mail is sent successfully.' , success: true};
    } catch (error) {
      const message =  (error instanceof Error && error.message);
      return { errorMessage: 'Error occurred while sending email: ' + message, success: false};
    }
}