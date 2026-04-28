import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '@/shared/lib/animationVariants';

export default function NoValidToken(){
    return (
        <motion.div
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="center mt-20 box-layout"
      >
        <motion.p
          variants={itemVariants}
          className="text-box"
        >
          Sorry, no valid token.
        </motion.p>
      </motion.div>
    );
}