'use server'
import nodemailer from 'nodemailer';
import { GetUserInfoByEmail, UpdateUsersRefreshToken } from "@/actions/manageUsers/db";
import { randomBytes } from "crypto";
import { addMinutes } from "date-fns";

export async function generateVerificationMail(email : string){

    const user = await GetUserInfoByEmail(email);

    
    if(!user)
        return false;

    const token = randomBytes(32).toString('base64url');
    const expirationDate = addMinutes(new Date(), 15);
    await UpdateUsersRefreshToken(user.id, token, expirationDate);

    await sendEmail(email, token);

    return true;
}

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
        subject: 'Email verification',
        text: 'Click on this link to verify your email: http://localhost:3000/signUp/' + token,
        //text: 'Click on this link to verify your email: https://dictionary-six-tau.vercel.app/signUp/' + token,
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