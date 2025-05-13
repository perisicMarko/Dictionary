import { motion } from 'framer-motion';
import { containerVariants } from '@/lib/animationVariants';

export default function NoValidToken(){

    return (
        <motion.div
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="box-layout mt-15"
      >
        <motion.p className="text-white text-center">
          <b>Sorry, no valid token.</b>
        </motion.p>
      </motion.div>
    );
}