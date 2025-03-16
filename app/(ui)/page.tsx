import '@/app/globals.css';
import Link from 'next/link';

export default function Home() {
  

  return (  
    
    <div className='mt-30 flex flex-col items-center'>
      <h1 className="sm:w-100 text-2xl  bg-blue-950/80 rounded-full text-center hover:underline textThemeColor"><i>&quot;Learning a new language takes time, so take it step by step.&quot;</i></h1>

      <Link className="text-center primaryBtn hover:underline" href='/about'><b>About app</b></Link>  
      <Link className="text-center primaryBtn hover:underline" href='/logIn'><b>Log in</b></Link>    
      <Link className="text-center primaryBtn hover:underline" href='/signUp'><b>Sign up</b></Link>

    </div>
    
    );
}


