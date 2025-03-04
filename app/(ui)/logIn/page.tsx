'use client'
import { authenticateLogIn } from '@/lib/auth';
import Link from 'next/link';
import { useActionState } from 'react';

export default function Page(){
    const [state, action, isPending] = useActionState(authenticateLogIn, undefined);
    
    return (
        <div className="mt-50 bg-blue-400 rounded-2xl border-2 border-blue-50">
            <div className='flex justify-end items-start'>
                <Link className="xBtn mr-3" href="/"><b>x</b></Link>
            </div>
            <form className="form w-[450px]" action={action}>
                <div>
                    <label htmlFor="email">Email: </label>
                    <input className="formInput" type="text" name="email" defaultValue={state?.email}/>
                </div>
                <div>
                    <label htmlFor="password">Password: </label>
                    <input className="formInput" type="password" name="password"/>
                </div>
                <div className="center">
                    <button disabled={isPending} className="primaryBtn">{isPending ? "Loading" : "Log in"}</button>
                </div>
                <div className='center my-1'>
                    <p className="mr-6 hover:underline">You do not have an account yet?</p>
                    <Link href="/signUp" className='hover:scale-115'><i><u>Sign up here</u></i></Link>
                </div>
            </form>
        </div> 
    );
}