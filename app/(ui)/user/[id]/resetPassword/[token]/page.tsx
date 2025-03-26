'use client'
import { useParams } from "next/navigation";
import { getUserByToken, updateUsersPassword } from "@/actions/resetPassword/manageUsers";
import { useEffect, useState, useActionState } from "react";
import { motion } from "framer-motion";
import { TUser } from "@/lib/types";
import Link from 'next/link';
import { isBefore } from "date-fns";


export default function ResetPassword(){
    const params = useParams();
    let token = params.token;
    if(typeof token === 'object')
        token = token[0];
    const [user, setUser] = useState<TUser>();
    const [state, action, isPending] = useActionState(updateUsersPassword, undefined);

    useEffect(() => {
        if(!token) return;

        const fetchUser = async () => {
            const retVal = await getUserByToken(token);
            setUser(retVal);
            
        }

        fetchUser();
    }, [token]);



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
        show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    };

    let isValid = false;
    const now = new Date();
    const tokenExpirationDate = (user?.token_expiration_date ? user.token_expiration_date : false);
    const tokenDate = tokenExpirationDate ? new Date(tokenExpirationDate) : undefined;
    

    
    if(!tokenExpirationDate){

    }
    else if(user?.refresh_token != undefined && tokenDate != undefined && isBefore(now, tokenDate))
        isValid = true;

    return (
        <>
        {!isValid ?
            <motion.div initial='hidden' animate='show' variants={containerVariants} className="p-2 center w-full h-full">
                <motion.p variants={itemVariants} className="text-white text-center bg-slate-800 appWidth  rounded-3xl p-2">Sorry, no valid token.</motion.p>
            </motion.div>
        :
            <>
            {state?.success ? 
                <motion.div initial='hidden' animate='show' variants={containerVariants} className="flex flex-col items-center bg-slate-800 appWidth center rounded-3xl p-5 mt-20 sm:mt-25 md:mt-30 xl:mt-50 z-10">
                    <motion.p variants={itemVariants} className="text-white text-center z-10"><b>Your password has been reset.</b></motion.p> 
                    <Link href='/logIn' className="text-white mt-3 hover:underline hover:scale-115"><u><i>Click to log in.</i></u></Link>
                </motion.div>

            :
                <motion.div initial='hidden' animate='show' variants={containerVariants} className="appWidth rounded-3xl bg-slate-800 p-5 mt-20 sm:mt-25 md:mt-30 xl:mt-50">
                    <motion.form variants={itemVariants} className="form w-full h-full" action={action}>
                        <input name='userId' defaultValue={user?.id} hidden/>
                        <div>
                            <label htmlFor="password" className="text-white">Enter new password:</label>
                            <input type="password" name="password" className="formInput"/>
                            {(state?.errors?.password?.length || 0) > 0 && <span className="error">Password:</span>}
                            <ul className='list-disc'>{state?.errors?.password && state.errors.password.map((e) => <li key={e} className="error ml-6">{e}</li>)}</ul>
                        </div>
                        <div>
                            <label htmlFor="confirmPassword">Confirm new password:</label>
                            <input type="password" name="confirmPassword" className="formInput"/>
                            {state?.errors?.confirmPassword === false && <motion.span variants={itemVariants} className="error">Passwords do not match.</motion.span>}
                        </div>
                        <div className="center">
                            <button type="submit" className="primaryBtn z-0">{isPending ? 'Reseting...' : 'Reset'}</button>
                        </div>
                    </motion.form>
                </motion.div>    
            
            }
            </>
        }
        </>
    );
    
}
