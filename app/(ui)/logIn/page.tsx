'use client'
import { authenticateLogIn } from '@/actions/auth';
import Link from 'next/link';
import { useActionState } from 'react';
import { motion } from 'framer-motion';

export default function LogIn(){
    const [state, action, isPending] = useActionState(authenticateLogIn, undefined);
    
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.3,
          },
        },
      };
    
    const itemVariants = {
        hidden: { opacity: 0, y: -15 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };
    
    return (
        <motion.div initial="hidden" animate="show" variants={containerVariants} className="mt-25 sm:mt-30 md:mt-30 bg-slate-800 rounded-2xl border-2 border-blue-50 w-[1/2] md:w-[500px]">
            <div className='flex justify-end items-start bg-slate-950 border-blue-50 rounded-t-2xl'>
                <Link className="xBtn mr-3 text-white" href="/"><b>x</b></Link>
            </div>
            <form className="form flex flex-col items-center justify-center m-5" action={action}>
                <motion.div variants={itemVariants} className="w-full">
                    <label htmlFor="email" className='text-white'>Email: </label>
                    <input className="formInput" type="text" name="email" defaultValue={state?.email}/>
                    {state?.errors?.email != '' && <p className='error ml-1'>{state?.errors.email}</p>}
                </motion.div>
                <motion.div variants={itemVariants} className="w-full">
                    <label htmlFor="password" className='text-white'>Password: </label>
                    <input className="formInput" type="password" name="password"/>
                    {state?.errors?.password && <p className='error ml-1'>{state.errors.password}</p> }
                </motion.div>
                <motion.div variants={itemVariants} className='center w-3/4'>
                    <button disabled={isPending} className="primaryBtn">{isPending ? "Loading..." : "Log in"}</button>
                </motion.div>
                <motion.div variants={{hidden:{ opacity: 0, y: 15}, show: { opacity: 1, y: 0, transition: { duration: 0.5}}}} className='center my-1'>
                    <p className="text-center text-white text-xs sm:text-base mr-3 sm:mr-6 hover:underline">You do not have an account yet?</p>
                    <Link href="/signUp" className='hover:scale-115 text-white text-center'><i><u>Sign up here</u></i></Link>
                </motion.div>
            </form>
        </motion.div> 
    );
}