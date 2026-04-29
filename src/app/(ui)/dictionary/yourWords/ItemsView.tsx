"use client";

import { useEffect, useState } from "react";
import { TNoteApp, TDrawer } from "@/shared/types";
import { ChevronUp } from "lucide-react";
import ShowNotesView from "./(notes)/ShowNotesView";
import ShowDrawersView from "./(drawers)/ShowDrawersView";

export default function YourWordsView({ notes, drawers, drawerNoteMapping }: { notes: TNoteApp[], drawers: TDrawer[], drawerNoteMapping: { note_id: number, drawer_id: number }[] }) {
    const [scrollToTop, setScrollToTop] = useState(false);
    const [showDrawers, setShowDrawers] = useState(false);

    useEffect(() => {
        const sotredValue = sessionStorage.getItem("toggleDrawers");
        if (sotredValue === null) {
            sessionStorage.setItem("toggleDrawers", "false");
            return;
        }

        setShowDrawers(sotredValue === "true");
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
            {scrollToTop ? (
                <div
                    title="Back to top"
                    className="cursor-pointer fixed z-100 bottom-5 sm:right-4 right-0.5 rounded-2xl bg-main/80 p-3 text-text-main transition-all duration-200 hover:text-text-second enter-fade"
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