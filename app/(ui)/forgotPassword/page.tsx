'use client'
import { resetPassword } from '@/actions/resetPassword';
import { motion } from 'framer-motion';
import { useActionState } from 'react';
import Link from 'next/link';


export default function ForgotPassword(){
    const [state, action, isPending] = useActionState(resetPassword, null);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      };
    
    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    };
    return (
        <motion.div initial='hidden' animate='show' variants={containerVariants} className='bg-slate-800 mt-20 flex flex-col items-center justify-center md:mt-30 p-1 xl:mt-50 w-3/4 sm:w-[600px] rounded-3xl'>
            {state?.status === 200 &&
                <motion.div variants={itemVariants} className='absolute top-auto left-auto h-[200px] sm:[250px] center bg-slate-800 rounded-3xl appWidth p-2'>
                    <span className='text-center text-white'><b>Email with instructions has been sent to you, please check your email.</b></span>
                </motion.div>
            }
            {state?.status === 500 && 
                <motion.div variants={itemVariants} className='absolute top-auto left-auto  h-1/2 center bg-slate-800 rounded-3xl appWidth p-2'>
                    <span className='text-center text-white'>Something is wrong, please try again.</span>
                </motion.div>
            }
            <motion.span className='mt-5  hover:underline hover:scale-105'><Link href='/' className='text-white'>Back to home page</Link></motion.span>
            <motion.form variants={itemVariants} className='p-5 flex w-full flex-col items-center' action={action}>
                <input type='text' name='email' className='formInput' placeholder='Enter your email here...'/>
                {state?.status === 0 &&
                    <motion.span className='error my-1 align-baseline'>{state.error}</motion.span>
                }
                <button className='primaryBtn'>{isPending ? 'Sending email...' : 'Send email'}</button>
            </motion.form>

        </motion.div>
    );
}