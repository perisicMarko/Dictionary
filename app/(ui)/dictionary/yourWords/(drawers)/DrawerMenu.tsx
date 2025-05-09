import { motion } from "framer-motion";
import { containerVariants } from "@/lib/animationVariants";
import { Menu } from "lucide-react";
import { Trash2 } from "lucide-react";
import { itemVariants } from "@/lib/animationVariants";

export default function DrawerMenu({
  menu,
  toggleMenu,
  confirmDelete,
}: {
  menu: boolean;
  toggleMenu: (v: boolean) => void;
  drawerId: number;
  confirmDelete: (v :  boolean) => void;
  rerender: () => void;
}) {  

  return (
      <motion.div className="absolute flex flex-col justify-center items-center mr-3 sm:mr-8 top-0 right-0 mt-3 w-[30px]">
        <motion.span
          onClick={(e) => {
            e.stopPropagation();
            toggleMenu(!menu);
          }}
        >
          <Menu
            color="white"
            width={25}
            height={25}
            className="xl:hover:scale-105 cursor-pointer"
          />
        </motion.span>
        {menu && (
          <motion.div
            className="bg-white/80 text-slate-800 rounded-2xl p-2"
            initial="hidden"
            animate="show"
            variants={containerVariants}
          >
            <motion.span
              variants={itemVariants}
              title="Delete drawer"
              onClick={(e) => {
                e.stopPropagation();
                confirmDelete(true);
              }}
            >
              <Trash2
                className="xl:hover:scale-105 cursor-pointer"
              />
            </motion.span>
          </motion.div>
        )}
      </motion.div>
  );
}
