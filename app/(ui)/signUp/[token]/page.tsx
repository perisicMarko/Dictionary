'use client'
import { useEffect, useActionState, useState } from "react";
import { useParams } from "next/navigation";
import { TUser } from "@/lib/types";
import { getUserByToken, verifyUser } from "@/actions/auth/index";
import { motion } from 'framer-motion';
import { isBefore } from "date-fns";
import Link from 'next/link';

export default function Page(){
    const params = useParams();
    let token = params.token;
    if(typeof token === 'object')
        token = token[0];
    const [user, setUser] = useState<TUser | undefined>();
    const [state, action, isPending] = useActionState(verifyUser, undefined);
 
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
    const tokenExpirationDate = (user?.refresh_token_expiration_date ? user.refresh_token_expiration_date : false);
    const tokenDate = tokenExpirationDate ? new Date(tokenExpirationDate) : undefined;
    

    
    if(!tokenExpirationDate){

    }
    else if(user?.refresh_token != undefined && tokenDate != undefined && isBefore(now, tokenDate))
        isValid = true;


    return (
        <>
        {isValid ? 
            <>
            {state?.success === true ? 
                <motion.div initial='hidden' animate='show' variants={containerVariants} className="appWidth rounded-3xl bg-slate-800 p-5 mt-30">
                    <motion.p variants={itemVariants} className="text-white text-center">
                        <b>Your email has been verified successfully.<br/> Log in here:  </b><Link href='/logIn' className="hover:scale-115 hover:underline text-blue-300">log in page link</Link>.
                    </motion.p>
                </motion.div>

            :
                <motion.div initial='hidden' animate='show' variants={containerVariants} className="appWidth bg-slate-800 p-5 rounded-3xl mt-30">
                    <motion.form variants={itemVariants} className="w-full" action={action}>
                        <input name="userId" defaultValue={user?.id}hidden/>
                        <button type="submit" className="primaryBtn">{isPending ? 'Confirming verification...' : 'Click to verify'}</button>
                    </motion.form>
                </motion.div>
            }
            </>
        :
            <motion.div initial='hidden' animate='show' variants={containerVariants} className="appWidth rounded-3xl bg-slate-800 p-5">
                <motion.p className="text-white text-center"><b>Sorry, no valid token.</b></motion.p>
            </motion.div>
        }
        </>
    );
}