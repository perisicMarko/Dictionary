'use client'
import { motion } from 'framer-motion';
import { Variants } from 'framer-motion';

export default function MotionWraper({
    children, variants, style, container
}:{
    children: React.ReactNode;
    variants: Variants;
    style: string;
    container: boolean;
}){

    let res;
    if(container)
        res = <motion.div initial='hidden' animate='show' className={style} variants={variants}>
                {children}
            </motion.div>;
    else
        res = <motion.div className={style} variants={variants}>
                {children}
            </motion.div>;

    return (
        res
    );
}