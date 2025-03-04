
import { NextResponse} from 'next/server'
import { createConnection } from '@/lib/db'

export async function GET() {
  try {

    const db = await createConnection();
    const _query = 'SELECT * FROM korisnici'
    const [results] = await db.query(_query)

    db.end()

    return NextResponse.json(results)
    
  } catch (error : any) {
    console.log('ERROR: API - ', error.message)


    return NextResponse.json({error: error.message })
  }
}

export async function POST(request: Request) {
  try {

    const db = await createConnection();
    const _query = 'SELECT * FROM korisnici k where ' + request.id + " = k.id"; 
    const [results] = await db.query(_query)

    db.end()

    return NextResponse.json(results)
    
  } catch (error : any) {
    console.log('ERROR: API - ', error.message)


    return NextResponse.json({error: error.message })
  }
}