"use client";
import { useEffect, useState } from "react";
import { TNoteApp, TDrawer } from "@/shared/types";
import { ChevronUp } from "lucide-react";
import ShowNotesView from "@/features/notes/learningNotes/ui/ShowNotesView";
import ShowDrawersView from "@/features/drawers/ui/ShowDrawersView";

export default function YourWordsView({ notes, drawers, drawerNoteMapping }: { notes: TNoteApp[], drawers: TDrawer[], drawerNoteMapping: { note_id: number, drawer_id: number }[] }) {
    const [scrollToTop, setScrollToTop] = useState(false);
    const [showDrawers, setShowDrawers] = useState(false);

    useEffect(() => {
        const storedValue = sessionStorage.getItem("toggleDrawers");
        if (storedValue === null) {
            sessionStorage.setItem("toggleDrawers", "false");
            return;
        }

        setShowDrawers(storedValue === "true");
    }, []);

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const controlScroll = () => {
            const currentScrollY = window.scrollY;
            setScrollToTop(currentScrollY > lastScrollY && currentScrollY > 100);
            lastScrollY = currentScrollY;
        };

        window.addEventListener("scroll", controlScroll);

        return () => window.removeEventListener("scroll", controlScroll);
    }, []);

    return (
        <>
            <ToggleViewButton
                isToggled={showDrawers}
                toggle={(e) => {
                    sessionStorage.setItem("toggleDrawers", showDrawers.toString());
                    setShowDrawers(e);
                }}
            />
            {scrollToTop ? (
                <div
                    title="Back to top"
                    className="cursor-pointer fixed z-100 bottom-5 sm:right-4 right-0.5 rounded-2xl bg-main/80 p-3 text-text-main hover:bg-main transition-all duration-200 hover:text-text-second enter-fade"
                    onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                >
                    <ChevronUp />
                </div>
            ) : null}

            {showDrawers ? (
                <ShowDrawersView key="drawers" initialDrawers={drawers} initialNotes={notes} drawerNoteMapping={drawerNoteMapping} />
            ) : (
                <ShowNotesView key="notes" initialNotes={notes} />
            )}
        </>
    );
}


function ToggleViewButton({ toggle, isToggled }: { toggle: (e: boolean) => void, isToggled: boolean }) {

    function toggleDrawers(showDrawers: boolean) {
        toggle(showDrawers);
        sessionStorage.setItem("toggleDrawers", showDrawers.toString());
    }

    return (
        <div className="box-layout p-0! grid grid-cols-2 relative border-4 sm:border-6 mt-17 z-0 border-main enter-fade overflow-hidden">
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