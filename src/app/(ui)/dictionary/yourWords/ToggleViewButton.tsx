"use client"
import { useState, useEffect } from "react";

export default function ToggleViewButton() {
    const [showDrawers, setShowDrawers] = useState(false);

    useEffect(() => {
        const storedValue = sessionStorage.getItem("toggleDrawers");

        if (storedValue === null) {
            sessionStorage.setItem("toggleDrawers", "false");
            return;
        }

        setShowDrawers(storedValue === "true");
    }, []);

    function changeLayout(showDrawers: boolean) {
        setShowDrawers(showDrawers);
        sessionStorage.setItem("toggleDrawers", showDrawers.toString());
    }

    return (
        <div className="box-layout !p-0 grid grid-cols-2 relative border-4 sm:border-6 mt-17 z-0 border-main enter-fade overflow-hidden">
            <div
                className={`text-text-main rounded-l-3xl w-full h-full p-2 sm:p-3 cursor-pointer center z-10 ${showDrawers ? "font-bold" : ""
                    }`}
                onClick={() => changeLayout(true)}
                title="Show drawers"
            >
                Drawers
            </div>

            <div
                className={`absolute bg-second z-5 w-1/2 h-full rounded-3xl top-0 transition-all duration-500 ${showDrawers ? "left-0" : "left-1/2"
                    }`}
            ></div>

            <div
                className={`text-text-main rounded-r-3xl w-full h-full p-2 sm:p-3 cursor-pointer center z-10 ${!showDrawers ? "font-bold" : ""
                    }`}
                onClick={() => changeLayout(false)}
                title="Show notes"
            >
                Notes
            </div>
        </div>
    );
}