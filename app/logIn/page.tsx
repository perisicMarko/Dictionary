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
            <form className="form w-[450px] h-[200px]" action={action}>
                <div>
                    <label htmlFor="email">Email: </label>
                    <input className="formInput" type="text" name="email"/>
                    {state?.errors?.email && state.errors.email.map((e) => <p className="error">{e}</p>)}
                </div>
                <div>
                    <label htmlFor="password">Password: </label>
                    <input className="formInput" type="password" name="password"/>
                    {state?.errors?.password && state.errors.password.map((e) => <p className="error">{e}</p>)}
                </div>
                <div className="center">
                    <button disabled={isPending} className="primaryBtn">{isPending ? "Loading" : "Log in"}</button>
                </div>
            </form>
        </div> 
    );
}