/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"
import mysql from "mysql2/promise";
import { NextResponse } from "next/server";


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
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error : any) {
      console.log('ERROR: API - ', error.message)
      return NextResponse.json({error: error.message })
    }
}

export async function GetUserInfoById(userId : any){
  
  try {
    const db = await pool.getConnection(); 
    const _query = 'SELECT * FROM clients as c where c.id = ?';
    const [results] = await db.query(_query, [userId]);

    db.release();

  
    const tmp = NextResponse.json(results);
    console.log(tmp);
    // const retVal = {
    //   name: tmp.firstame,
    //   lastName
    // }

    return tmp;
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error : any) {
    console.log('ERROR: API - ', error.message)
    return NextResponse.json({error: error.message })
  }
}


export async function InsertUserInfo({name, lastName, email, password} : {name: string, lastName: string, email: string, password: string}){
  try {
  
    const db = await pool.getConnection();
    const _query = 'INSERT INTO clients (first_name, last_name, email, password) VALUES (?, ?, ?, ?);';
    const [results] = await db.query(_query, [name, lastName, email, password]);

    db.release();

    return NextResponse.json(results)
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error : any) {
    console.log('ERROR: API - ', error.message)


    return NextResponse.json({error: error.message })
  }
}

export async function ImportNotes(note : any){
  
}