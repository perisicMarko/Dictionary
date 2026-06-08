import { NextResponse } from 'next/server';
import { isBefore } from 'date-fns';
import { findUserById } from '@/features/auth/infrastructure/usersRepository';
import { findAllNotes } from '@/features/notes/infrastructure/repository';
import nodemailer from 'nodemailer';


export async function GET() {
  const notes = await findAllNotes();
  const currentDate = new Date();
  const userIds = new Set<number>();
  if (notes) {
    for (let i = 0; i < notes.length; i++) {
      if (isBefore(notes[i].review_date, currentDate))
        userIds.add(notes[i].user_id);
    }
  }

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
    to: '',
    subject: 'Recall time',
    text: 'Hey it\'s me again, it is time to recall some words.\nIt takes just a few minutes to recall your words and stay on the learning path, keep it up.\n Follow this link to the app: remindmedictionary.com/notes/recall.'
  };
  for (const u of userIds) {
    const user = await findUserById(u);
    if(user && user.email_verified)
      mailOptions.to = user.email;

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) { 
      // Log the error but continue sending emails to other users
      const message = (error instanceof Error && error.message);
      console.error('Error sending email to user ID ' + u + ': ' + message);
    }
  }
  return NextResponse.json({ message: 'Mails was successfully sent.', status: 200 });
}
