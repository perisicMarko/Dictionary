'use server'
import nodemailer from 'nodemailer';

export default async function sendEmail(email : string, token : Base64URLString, userId : number){
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
        text: 'Click on this link to reset your password: https://dictionary-six-tau.vercel.app/user/' + userId + '/resetPassword/' + token,
      };
    
    try {
      // sending mail
      await transporter.sendMail(mailOptions);
      return { message: 'Mejl je uspešno poslat.' , status: 200};
    } catch (error) {
      const message =  (error instanceof Error && error.message);
      return { error: 'Greska prilikom slanja mejla: ' + message, status: 500};
    }
}