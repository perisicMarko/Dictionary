"use server"
import mysql from "mysql2/promise";
import { NextResponse } from "next/server";
import { TDBNoteEntry } from "./types";


const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


export async function GetUserInfoById(id : number){

  try {
    const db = await pool.getConnection(); 
    const _query = 'SELECT * FROM users as u where u.id = ?';
    const [results] = await db.query(_query, [id]);

    db.release();

    return NextResponse.json(results);
    

  } catch (error) {
    if(error instanceof Error){
      console.log('ERROR: API - ', error?.message)
      return NextResponse.json({error: error.message })
    }
  }
}

export async function GetUserInfoByEmail({email} : {email: string}){

    try {
      const db = await pool.getConnection(); 
      const _query = 'SELECT * FROM users as u where u.email = ?';
      const [results] = await db.query(_query, [email]);
  
      db.release();

      return NextResponse.json(results);
      
  
    } catch (error) {
      if(error instanceof Error){
        console.log('ERROR: API - ', error?.message)
        return NextResponse.json({error: error.message })
      }
    }
}

export async function GetNotes(){
  try {
  
    const db = await pool.getConnection();
    const _query = 'SELECT * FROM words;';
    const [results] = await db.query(_query);

    db.release();

    return NextResponse.json(results)
    
  } catch (error) {
    if(error instanceof Error){
      console.log('ERROR: API - ', error?.message);
      return NextResponse.json({error: error.message });
    }
  }
}


export async function InsertUserInfo({name, lastName, email, password} : {name: string, lastName: string, email: string, password: string}){
  try {
  
    const db = await pool.getConnection();
    const _query = 'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?);';
    const [results] = await db.query(_query, [name, lastName, email, password]);

    db.release();

    return NextResponse.json(results)
    
  } catch (error) {
    if(error instanceof Error){
      console.log('ERROR: API - ', error.message);
      return NextResponse.json({error: error.message });
    }
  }
}

export async function ImportNotes(note : TDBNoteEntry){
  try{
    const db = await pool.getConnection();
    const _query = 'INSERT INTO words (user_id, word, status, language, user_notes, generated_notes, audio, repetitions, days, ease_factor, review_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);'
    const [results] = await db.query(_query, [note.user_id, note.word, note.status, note.language, note.user_notes, note.generated_notes, note.audio,
       note.repetitions, note.days, note.ease_factor, note.review_date]);

    db.release();

    return NextResponse.json(results);
  } catch(error){

    if(error instanceof Error){
      console.log('ERROR: API - ' + error.message);
      return NextResponse.json({error: error.message});      
    }
  }
}

export async function GetNoteById(noteId : number){
  try{
    console.log(noteId);
    const db = await pool.getConnection();
    const _query = 'select * from words as w where w.id = ?;'
    const [results] = await db.query(_query, [noteId]);

    db.release();

    return NextResponse.json(results);
  } catch(error){

    if(error instanceof Error){
      console.log('ERROR: API - ' + error.message);
      return NextResponse.json({error: error.message});      
    }
  }
}

export async function UpdateNote(note : TDBNoteEntry){
  try{
    const db = await pool.getConnection();
    const _query = 'UPDATE words SET days = ?, repetitions = ?, ease_factor = ?, review_date = ? where id = ?;'
    const [results] = await db.query(_query, [note.days, note.repetitions, note.ease_factor, note.review_date, note.id]);

    db.release();

    return NextResponse.json(results);
  } catch(error){

    if(error instanceof Error){
      console.log('ERROR: API - ' + error.message);
      return NextResponse.json({error: error.message});      
    }
  }
}



export async function DeleteNote(noteId : number, status : boolean){
  try{
    const db = await pool.getConnection();
    const _query = 'UPDATE words SET status = ? where id = ?;'
    const [results] = await db.query(_query, [status, noteId]);

    db.release();

    return NextResponse.json(results);
  } catch(error){

    if(error instanceof Error){
      console.log('ERROR: API - ' + error.message);
      return NextResponse.json({error: error.message});      
    }
  }
}

export async function EditNote(userNotes : string, generatedNotes : string, noteId : number){
  try{
    const db = await pool.getConnection();
    const _query = 'UPDATE words SET user_notes = ?, generated_notes = ? where id = ?;'
    const [results] = await db.query(_query, [userNotes, generatedNotes, noteId]);

    db.release();

    return NextResponse.json(results);
  } catch(error){

    if(error instanceof Error){
      console.log('ERROR: API - ' + error.message);
      return NextResponse.json({error: error.message});      
    }
  }
}
