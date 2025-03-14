import { NextResponse } from 'next/server';
import { isBefore } from 'date-fns';
import { GetNotes, GetUserInfoById } from '@/lib/db';
import nodemailer from 'nodemailer';


export async function GET() {
  
  const tmp = await GetNotes();
  const notes = await (tmp != undefined && tmp.json());
  //delte this console.log
  console.log(notes);
  const  currentDate = new Date();
  const users = new Map<number, boolean>();

  for(let i = 0; i < notes.length; i++){
    if(isBefore(notes[i].review_date, currentDate))
      users.set(notes[i].user_id,  true);
  }

  let to = '';
  for(const e of users.keys()){
    const mail = await GetUserInfoById(e);
    to += mail + ', ';
  }

  //delte this console.log
  console.log(to);
  to = to.trim().substring(0, to.length - 1); // omitting the last comma

   // Kreiranje transportera sa SMTP podešavanjima
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Podešavanje mejla
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: 'Hmm, looks like it is time to learn.',
    text: 'It takes just a few minutes to recall some words and stay on the learning course, keep it up.\n mail do aplikacije'
  };

  try {
    // Slanje mejla
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'Mejl je uspešno poslat.' , status: 200});
  } catch (error) {
    const message =  (error instanceof Error && error.message);
    return NextResponse.json({ error: 'Greska prilikom slanja mejla: ' + message, status: 500});
  }

}
