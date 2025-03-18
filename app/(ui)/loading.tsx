'use client'
import { motion } from 'framer-motion';

export default function Loading(){

    return (
        <div className='flex center w-screen h-screen'>
            <motion.div
            animate={{
                scale: [1, 2, 2, 1], 
                rotate: [0, 90, 90, 0],
                borderRadius: ["10%", "10%", "50%", "10%"]
            }}
            transition={{duration: 2, ease: "easeInOut", repeat: Infinity, repeatDelay: 0}}
             className="w-[25px] h-[25px] sm:w-[50px] sm:h-[50px] md:w-[100px] md:h-[100px] xl:w-[150px] xl:h-[150px] bg-slate-800">
            </motion.div>
        </div>
    )
}