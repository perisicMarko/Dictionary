"use client";

import Link from "next/link";
import { useState } from "react";

export default function RecallNoteHelp() {
  const [help, setHelp] = useState<boolean>(false);

  return (
    <>
      <div className="center box-layout mt-17 !py-4">
        <button
          type="button"
          aria-label="Toggle recall help"
          className="block cursor-pointer enter-fade-up"
          onClick={() => {
            setHelp((prev) => !prev);
          }}
        >
          <span className="text-text-main hover:text-text-second transition-colors"><b>Need help?</b></span>
        </button>
      </div>
      {help && (
        <div className="box-layout mt-5 relative enter-fade">
          <div className="collapse-window">
            <button
              type="button"
              aria-label="Close recall help"
              className="x-btn"
              onClick={() => {
                setHelp((prev) => !prev);
              }}
            >
              <b>x</b>
            </button>
          </div>
          <h2 className="text-box mt-3 px-1">
            <b>Here is where you recall your words</b>
          </h2>
          <p className="mt-3 text-text-main enter-fade-up enter-delay-1 text-justify">
            Click on the menu icon to open the menu. In menu, there are edit and
            delete icons(for deleting note from learning system, not from whole dictionary), also &quot;N&quot; for showing word notes and
            &quot;G&quot; for grading UI, the grading UI is initially selected.
            <br />
            <br />
            <b>How does this work?</b>
            <br />
            Recall system is based on forgetting curve and spaced repetition
            algorithm.
            <br />
            When you add a new word it is set to recall for the next day, that is
            the first repetition. After the first one, the second one is after 6
            days. When you do first two repetitions each next is calculated
            based on how well you have graded your recall. If you mark some word
            with grade below 3(0, 1, 2) repetition cycle will be returned to the
            beginning.
            <br />
            <br />
            Also word is considered as learned when it has a big interval for
            recall(30+ days), but app will not automatically move those words to
            the &quot;Learned words&quot; page. You can do it on the trash icon in
            the menu which marks word as learned and moves it to the &quot;Learned
            words&quot; page.
            <br />
            <br />
            You can delete a word from the app only on &quot;Learned words&quot;
            page by clicking on the menu then on trash icon, only then is
            permanently deleted. So delete on recall and history page are two
            different delete options. It is recommended to leave the word in
            recall system even after the fifth repetition for another repetition
            or more.
            <br />
            <br />
            <b>Email notifications</b>
            <br />
            Note that you will be informed via email when to enter the app to
            recall some words. Email may end up in spam, so you will need to fix
            that by yourself.
            <br />
            <br />
            In order to fix that:
            <br />
            <ul className="list-disc list-inside ml-2">
              <li>
                open
                <Link
                  href="https://mail.google.com/mail"
                  className="text-text-main hover:text-text-second transition-colors"
                  target="_blank"
                  rel="noreferrer"
                >
                  mail
                </Link>
                then spam section
              </li>
              <li>find our email and click on it</li>
              <li>when options appear click on &quot;Report not spam&quot; </li>
            </ul>
            <br />
            <br />
            If you have followed sign up instructions properly, you should have
            done this upon sign up.
            <br />
          </p>
        </div>
      )}
    </>
  );
}
