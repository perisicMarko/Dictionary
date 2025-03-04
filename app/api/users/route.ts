
import { NextResponse} from 'next/server'
import { createConnection } from '@/lib/db'

export async function GET() {
  try {

    const db = await createConnection();
    const _query = 'SELECT * FROM korisnici'
    const [results] = await db.query(_query)

    db.end()

    return NextResponse.json(results)
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error : any) {
    console.log('ERROR: API - ', error.message)


    return NextResponse.json({error: error.message })
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: Request) {
  try {

    const db = await createConnection();
    const _query = 'SELECT * FROM clients;'; 
    const [results] = await db.query(_query)

    db.end()

    return NextResponse.json(results)
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error : any) {
    console.log('ERROR: API - ', error.message)


    return NextResponse.json({error: error.message })
  }
}