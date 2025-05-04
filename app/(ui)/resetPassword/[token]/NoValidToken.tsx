import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '@/lib/animationVariants';

export default function NoValidToken(){
    return (
        <motion.div
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="p-2 center w-full h-full mt-20"
      >
        <motion.p
          variants={itemVariants}
          className="text-white text-center bg-slate-800 appWidth  rounded-3xl p-2"
        >
          Sorry, no valid token.
        </motion.p>
      </motion.div>
    );
}