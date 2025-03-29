import { NextResponse } from 'next/server';
import { isBefore } from 'date-fns';
import { GetNotes, GetUserInfoById } from '@/actions/resetPassword/db';
import nodemailer from 'nodemailer';


export async function GET() {
  
  const tmp = await GetNotes();
  const notes = await (tmp != undefined && tmp.json());

  const  currentDate = new Date();
  const users = new Map<number, boolean>();

  for(let i = 0; i < notes.length; i++){
    if(isBefore(notes[i].review_date, currentDate))
      users.set(notes[i].user_id,  true);
  }

  let to = '';
  for(const e of users.keys()){
    const res = await GetUserInfoById(e);
    const user = (await (res && res.json()))[0];
    to += user.email + ', ';
  }

  to = to.trim().substring(0, to.length - 1); // omitting the last comma
  
   // create transporter with SMTP settings
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
    to: to,
    subject: 'Recall time',
    text: 'Hey it\'s me again, it is time to recall some words.\nIt takes just a few minutes to recall your words and stay on the learning path, keep it up.\n Follow this link to the app: https://dictionary-six-tau.vercel.app.'
  };

  try {
    // sending mail
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'Mial was successfully sent.' , status: 200});
  } catch (error) {
    const message =  (error instanceof Error && error.message);
    return NextResponse.json({ error: 'Error when sending mail: ' + message, status: 500});
  }

}
