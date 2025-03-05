"use client"
import '@/app/globals.css';
import Link from 'next/link';

export default function Home() {
  

  return (  
    <>
     <div className="mt-90 bg-blue-950/80 rounded-full">
       <h1 className="w-100 text-2xl text-center hover:underline textThemeColor"><i>&quot;Learning a new language takes time, so take it step by step.&quot;</i></h1>
     </div>  
       
      <div className="center primaryBtn">
        <Link className="hover:underline" href='/about'><b>About app</b></Link>
      </div>
  
      <div className="center primaryBtn">
        <Link className="hover:underline" href='/logIn'><b>Log in</b></Link>
      </div>
      
      <div className="center primaryBtn">
        <Link className="hover:underline" href='/signUp'><b>Sign up</b></Link>
      </div>
    </>
    );
}


