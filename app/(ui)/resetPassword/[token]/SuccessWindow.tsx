import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '@/lib/animationVariants';
import Link from 'next/link';

export default function SuccessWindow(){
    return (
        <motion.div
              initial="hidden"
              animate="show"
              variants={containerVariants}
              className="center-vertically box-layout mt-20 sm:mt-25 md:mt-30 xl:mt-50 z-10"
            >
              <motion.p
                variants={itemVariants}
                className="text-box z-10"
              >
                <b>Your password has been reset.</b>
              </motion.p>
              <Link
                href="/logIn"
                className="text-blue-300 mt-3 hover:underline hover:scale-115"
              >
                <u>
                  <i>Click to log in.</i>
                </u>
              </Link>
            </motion.div>
   );
}