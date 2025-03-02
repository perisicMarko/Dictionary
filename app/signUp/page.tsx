'use client'
import Link from 'next/link';
import { useActionState } from 'react'
import { authenticateSignUp } from '@/lib/auth'


export default function Page(){
    const [state, action, isPending] = useActionState(authenticateSignUp, undefined);
    return (
        <div className="flex justify-center mt-50 w-[500px] h-1/2 bg-blue-400 rounded-2xl border-2 border-blue-50">
          <form className="form w-full px-2 py-2" action={action}>
          <div>
              <label htmlFor="name">Name: </label>
              <input className="formInput" type="text" name="name"/>
              {state?.errors?.name && state.errors.name.map((e) => <p className="error">{e}</p>)}
          </div>            
          <div>
              <label htmlFor="lastName">Last name: </label>
              <input className="formInput" type="text" name="lastName"/>
              {state?.errors?.lastName && state.errors.lastName.map((e) => <p className="error">{e}</p>)}
          </div>                    
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
          <div>
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
    );
}