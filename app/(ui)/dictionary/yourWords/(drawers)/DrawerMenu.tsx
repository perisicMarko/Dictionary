import { motion } from "framer-motion";
import { containerVariants } from "@/lib/animationVariants";
import { Menu, X } from "lucide-react";
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
  confirmDelete: (v: boolean) => void;
  rerender: () => void;
}) {
  return (
    <motion.div className="absolute center-vertically mr-3 sm:mr-8 top-0 right-0 mt-3 w-[30px]">
      <motion.span
        onClick={(e) => {
          e.stopPropagation();
          toggleMenu(!menu);
        }}
        title="Menu"
      >
        {menu ? (
          <X
            color="white"
            width={25}
            height={25}
            className="btn"
          />
        ) : (
          <Menu
            color="white"
            width={25}
            height={25}
            className="btn"
          />
        )}
      </motion.span>
      {menu && (
        <motion.div
          className="bg-white/80 text-second rounded-2xl p-2"
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
            <Trash2 className="hover:text-main cursor-pointer transition-all" />
          </motion.span>
        </motion.div>
      )}
    </motion.div>
  );
}
