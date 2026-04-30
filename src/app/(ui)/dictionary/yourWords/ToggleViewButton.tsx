"use client"
import { useState, useEffect } from "react";
import { boolean } from "zod";

export default function ToggleViewButton({ toggle, isToggled }: { toggle: (e: boolean) => void, isToggled: boolean }) {

    function toggleDrawers(showDrawers: boolean) {
        toggle(showDrawers);
        sessionStorage.setItem("toggleDrawers", showDrawers.toString());
    }

    return (
        <div className="box-layout !p-0 grid grid-cols-2 relative border-4 sm:border-6 mt-17 z-0 border-main enter-fade overflow-hidden">
            <div
                className={`text-text-main rounded-l-3xl w-full h-full p-2 sm:p-3 cursor-pointer center z-10 ${isToggled ? "font-bold" : ""
                    }`}
                onClick={() => toggleDrawers(true)}
                title="Show drawers"
            >
                Drawers
            </div>

            <div
                className={`absolute bg-second z-5 w-1/2 h-full rounded-3xl top-0 transition-all duration-500 ${isToggled ? "left-0" : "left-1/2"
                    }`}
            ></div>

            <div
                className={`text-text-main rounded-r-3xl w-full h-full p-2 sm:p-3 cursor-pointer center z-10 ${!isToggled ? "font-bold" : ""
                    }`}
                onClick={() => toggleDrawers(false)}
                title="Show notes"
            >
                Notes
            </div>
        </div>
    );
}