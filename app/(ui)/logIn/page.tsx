'use client'
import { authenticateLogIn } from '@/actions/auth';
import Link from 'next/link';
import { useActionState } from 'react';

export default function LogIn(){
    const [state, action, isPending] = useActionState(authenticateLogIn, undefined);

    
    return (
        <div className="mt-25 sm:mt-30 md:mt-30 bg-blue-400 rounded-2xl border-2 border-blue-50 w-[1/2] md:w-[500px]">
            <div className='flex justify-end items-start bg-blue-500 border-blue-50 rounded-t-2xl'>
                <Link className="xBtn mr-3" href="/"><b>x</b></Link>
            </div>
            <form className="form flex flex-col items-center justify-center m-5" action={action}>
                <div className="w-full">
                    <label htmlFor="email">Email: </label>
                    <input className="formInput" type="text" name="email" defaultValue={state?.email}/>
                    {state?.errors?.email != '' && <p className='error ml-1'>{state?.errors.email}</p>}
                </div>
                <div className="w-full">
                    <label htmlFor="password">Password: </label>
                    <input className="formInput" type="password" name="password"/>
                    {state?.errors?.password && <p className='error ml-1'>{state.errors.password}</p> }
                </div>
                <div className='center'>
                    <button disabled={isPending} className="primaryBtn">{isPending ? "Loading" : "Log in"}</button>
                </div>
                <div className='center my-1'>
                    <p className="text-center text-xs sm:text-base mr-3 sm:mr-6 hover:underline">You do not have an account yet?</p>
                    <Link href="/signUp" className='hover:scale-115'><i><u>Sign up here</u></i></Link>
                </div>
            </form>
        </div> 
    );
}