'use client'
import Link from 'next/link';
import { useActionState } from 'react'
import { authenticateSignUp } from '@/actions/auth'
import { motion } from 'framer-motion';

export default function SignUp(){
    const [state, action, isPending] = useActionState(authenticateSignUp, undefined);

    if(state?.error === 'Email already used.'){
        window.alert('This email is already used for another account.');
    }
        
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.2,
          },
        },
      };
    
    const itemVariants = {
        hidden: { opacity: 0, y: -15 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    };

    return (
        <motion.div initial='hidden' animate='show' variants={containerVariants} className="mt-25 sm:mt-30 md:mt-30 sm:w-[500px] h-1/2 bg-slate-800 rounded-2xl border-2 border-blue-50">
          <div className='flex justify-end items-start bg-blue-950 border-blue-50 rounded-t-2xl'>
            <Link className="xBtn mr-3 text-white" href="/"><b>x</b></Link>
          </div>

          <div className="center">
            <form className="form sm:w-[450px] p-2" action={action}>
            <motion.div variants={itemVariants} className="mt-3">
                <label htmlFor="name" className='text-white'>Name: </label>
                <input className="formInput" type="text" name="name" defaultValue={state?.name}/>
                {state?.errors?.name && <p className="error" key="name">Name needs:</p>}
                <ul className='list-disc'>{state?.errors?.name && state?.errors?.name.map((e) => <li key={e} className="error ml-6">{e}</li>)}</ul>
            </motion.div>            
            <motion.div variants={itemVariants} className="mt-3">
                <label htmlFor="lastName" className='text-white'>Last name: </label>
                <input className="formInput" type="text" name="lastName" defaultValue={state?.lastName}/>
                {state?.errors?.lastName && <p className="error" key="lastName">Last name:</p>}
                <ul className='list-disc'>{state?.errors?.lastName && state?.errors?.lastName.map((e) => <li key={e} className="error ml-6">{e}</li>)}</ul>
            </motion.div>                    
            <motion.div variants={itemVariants}  className="mt-3">
                <label htmlFor="email" className='text-white'>Email: </label>
                <input className="formInput" type="text" name="email" defaultValue={state?.email}/>
                {state?.errors?.email && <p className="error" key="email">Email:</p>}
                <ul className='list-disc'>{state?.errors?.email && state?.errors?.email.map((e) => <li key={e} className="error ml-6">{e}</li>)}</ul>
            </motion.div>
            <motion.div variants={itemVariants} className="mt-3">
                <label htmlFor="password" className='text-white'>Password: </label>
                <input className="formInput" type="password" name="password"/>
                {state?.errors?.password && <p className="error" key="password">Passwowrd:</p>}
                <ul className='list-disc'>{state?.errors?.password && state.errors.password.map((e) => <li key={e} className="error ml-6">{e}</li>)}</ul>
            </motion.div>
            <motion.div variants={itemVariants} className="mt-3">
                <label htmlFor="confirmPassword" className='text-white'>Confirm password: </label>
                <input className="formInput" type="password" name="confirmPassword"/>
                {state?.errors?.confirmPassword && <p className="error">{state.errors.confirmPassword}</p>}
            </motion.div>
            <motion.div variants={{hidden:{ opacity: 0, y: 15}, show: { opacity: 1, y: 0, transition: { duration: 0.5}}}} className="center w-full">
                <button disabled={isPending} className="bg-blue-400 text-white rounded-3xl block m-1 h-[35px] sm:h-[40px] md:h-[40px] xl:h-[48px] cursor-pointer w-1/2">{isPending ? "Loading..." : "Sign up"}</button>
                <motion.div variants={itemVariants} className='inline-block hover:scale-105 ml-1'>
                    <Link href="logIn" className='text-white'><i><u>Or log in here</u></i></Link>  
                </motion.div>
            </motion.div>
            </form>
          </div>
        </motion.div> 
    );
}