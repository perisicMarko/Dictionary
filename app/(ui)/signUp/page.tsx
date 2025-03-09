'use client'
import Link from 'next/link';
import { useActionState } from 'react'
import { authenticateSignUp } from '@/actions/auth'


export default function SignUp(){
    const [state, action, isPending] = useActionState(authenticateSignUp, undefined);

    if(!state?.errors && isPending)
        window.alert('You signed in successfuly. Now log in your account.');

    return (
        <div className="mt-80 w-[500px] h-1/2 bg-blue-400 rounded-2xl border-2 border-blue-50">
          <div className='flex justify-end items-start bg-blue-500 border-blue-50 rounded-t-2xl'>
            <Link className="xBtn mr-3" href="/"><b>x</b></Link>
          </div>

          <div className="flex justify-center">
            <form className="form w-[450px]" action={action}>
            <div className="mt-3">
                <label htmlFor="name">Name: </label>
                <input className="formInput" type="text" name="name" defaultValue={state?.name}/>
                {state?.errors?.name && <p className="error" key="name">Name needs to be:</p>}
                <ul className='list-disc'>{state?.errors?.name && state?.errors?.name.map((e) => <li key={e} className="error ml-6">{e}</li>)}</ul>
            </div>            
            <div className="mt-3">
                <label htmlFor="lastName">Last name: </label>
                <input className="formInput" type="text" name="lastName" defaultValue={state?.lastName}/>
                {state?.errors?.lastName && <p className="error" key="lastName">Last name needs to be:</p>}
                <ul className='list-disc'>{state?.errors?.lastName && state?.errors?.lastName.map((e) => <li key={e} className="error ml-6">{e}</li>)}</ul>
            </div>                    
            <div className="mt-3">
                <label htmlFor="email">Email: </label>
                <input className="formInput" type="text" name="email" defaultValue={state?.email}/>
                {state?.errors?.email && <p className="error" key="email">Email needs to be:</p>}
                <ul className='list-disc'>{state?.errors?.email && state?.errors?.email.map((e) => <li key={e} className="error ml-6">{e}</li>)}</ul>
            </div>
            <div className="mt-3">
                <label htmlFor="password">Password: </label>
                <input className="formInput" type="password" name="password"/>
                {state?.errors?.password && <p className="error" key="password">Passwowrd needs to be:</p>}
                <ul className='list-disc'>{state?.errors?.password && state.errors.password.map((e) => <li key={e} className="error ml-6">{e}</li>)}</ul>
            </div>
            <div className="mt-3">
                <label htmlFor="confirmPassword">Confirm password: </label>
                <input className="formInput" type="password" name="confirmPassword"/>
                {state?.errors?.confirmPassword && <p className="error">{state.errors.confirmPassword}</p>}
            </div>
            <div className="center">
                <button disabled={isPending} className="primaryBtn">{isPending ? "Loading..." : "Sign up"}</button>
                <div className='inline-block hover:scale-105 ml-1'>
                    <Link href="logIn"><i><u>Or log in here</u></i></Link>  
                </div>
            </div>
            </form>
          </div>

        </div> 
    );
}