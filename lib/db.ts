"use server"
import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

let connection : mysql.Connection;
export const createConnection = async () => {

  if(!connection){
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
  }
  return connection;
}


export async function GetUserInfo({email} : {email: string}){

    try {
      const db = await createConnection();
      const _query = 'SELECT * FROM clients as c where c.email = ?';
      const [results] = await db.query(_query, [email]);
  
      db.end();

      return NextResponse.json(results);
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error : any) {
      console.log('ERROR: API - ', error.message)
      return NextResponse.json({error: error.message })
    }
}


export async function InsertUserInfo({name, lastName, email, password} : {name: string, lastName: string, email: string, password: string}){
  try {
  
    const db = await createConnection();
    const _query = 'INSERT INTO clients (first_name, last_name, email, password) VALUES (?, ?, ?, ?);';
    const [results] = await db.query(_query, [name, lastName, email, password]);

    db.end()

    return NextResponse.json(results)
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error : any) {
    console.log('ERROR: API - ', error.message)


    return NextResponse.json({error: error.message })
  }
}