'use client'
import { authenticateLogIn } from '@/actions/auth';
import Link from 'next/link';
import { useActionState } from 'react';

export default function LogIn(){
    const [state, action, isPending] = useActionState(authenticateLogIn, undefined);
    
    return (
        <div className="mt-90 bg-blue-400 rounded-2xl border-2 border-blue-50 w-[500px] h-[300px]">
            <div className='flex justify-end items-start bg-blue-500 border-blue-50 rounded-t-2xl'>
                <Link className="xBtn mr-3" href="/"><b>x</b></Link>
            </div>
            <form className="form mt-7 ml-6 w-[450px]" action={action}>
                <div className="flex flex-col justify-center">
                    <label htmlFor="email">Email: </label>
                    <input className="formInput" type="text" name="email" defaultValue={state?.email}/>
                </div>
                <div className='flex flex-col justify-center'>
                    <label htmlFor="password">Password: </label>
                    <input className="formInput" type="password" name="password"/>
                    {state?.errors?.password && <p className='error ml-1'>-{state.errors.password}</p> }
                </div>
                <div className='center'>
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