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


export async function GetUserInfo({email} : {email: string}){

    try {
      const db = await pool.getConnection(); 
      const _query = 'SELECT * FROM clients as c where c.email = ?';
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

export async function GetUserInfoById(userId : number){
  
  try {
    const db = await pool.getConnection(); 
    const _query = 'SELECT * FROM clients as c where c.id = ?';
    const [results] = await db.query(_query, [userId]);

    db.release();

  
    const tmp = NextResponse.json(results);
    // const retVal = {
    //   name: tmp.firstame,
    //   lastName
    // }

    return tmp;
    
  } catch (error) {
    if(error instanceof Error){
      console.log('ERROR: API - ', error?.message);
      return NextResponse.json({error: error.message });
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
    const _query = 'INSERT INTO clients (first_name, last_name, email, password) VALUES (?, ?, ?, ?);';
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
    const _query = 'INSERT INTO words (notes, learned, user_id) VALUES (?, ?, ?);'
    const [results] = await db.query(_query, [JSON.stringify(note.notes), note.learned, note.user_id]);

    db.release();

    return NextResponse.json(results);
  } catch(error){

    if(error instanceof Error){
      console.log('ERROR: API - ' + error.message);
      return NextResponse.json({error: error.message});      
    }
  }
}

