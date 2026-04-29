"use client";

import { Menu, X, Trash2 } from "lucide-react";

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
    <div className="absolute center-vertically mr-3 sm:mr-8 top-0 right-0 mt-3 w-[30px]">
      <span
        onClick={(e) => {
          e.stopPropagation();
          toggleMenu(!menu);
        }}
        title="Menu"
      >
        {menu ? (
          <X color="white" width={25} height={25} className="btn" />
        ) : (
          <Menu color="white" width={25} height={25} className="btn" />
        )}
      </span>
      {menu ? (
        <div className="bg-white/80 text-text-second rounded-2xl p-2 enter-fade">
          <span
            className="enter-fade-up enter-delay-1 inline-block"
            title="Delete drawer"
            onClick={(e) => {
              e.stopPropagation();
              confirmDelete(true);
            }}
          >
            <Trash2 className="hover:text-text-main cursor-pointer transition-all" />
          </span>
        </div>
      ) : null}
    </div>
  );
}
