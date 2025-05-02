"use client";
import { getUsersBySchool } from "@/actions/manageUsers";
import { TStudent } from "@/lib/types";
import { useState, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { User, UserSearchIcon } from "lucide-react";
import { Languages } from "lucide-react";
import { containerVariants, itemVariants } from "@/lib/animationVariants";

export default function Page() {
  const [users, setUsers] = useState<TStudent[] | undefined>();
  const [search, setSearch] = useState('');

  useLayoutEffect(() => {
    const fetchUsers = async () => {
      const res = await getUsersBySchool();
      setUsers(res);
    };
    fetchUsers();
  }, []);

  function printUsersLanguages(languages: string) {
    return (
      <ul className="text-white list-disc ml-5 mt-3">
        {Array.from(languages).map((l, index) => {
          switch (l) {
            case "e":
              return <li key={index}>English</li>;
            case "s":
              return <li key={index}>Spanish</li>;
            case "f":
              return <li key={index}>French</li>;
            case "i":
              return <li key={index}>Italian</li>;
          }
        })}
      </ul>
    );
  }

  const filteredUsers = users?.filter((user: TStudent) => {
    return user.email.toLowerCase().trim().includes(search.toLowerCase().trim()) ||
    (user.firstName.toLowerCase().trim() + ' ' + user.lastName.toLowerCase().trim()).includes(search.toLowerCase().trim());
  });

  return (
    <>
      <motion.div
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="rounded-3xl bg-slate-800 grid grid-cols-[auto_1fr] mt-20 appWidth p-3"
      >
        <UserSearchIcon color="white" />
        <input
          placeholder="Search your students here..."
          className="text-white outline-0 w-full h-full pl-3"
          onChange={(e) => setSearch(e.target.value)}
        />
      </motion.div>
      <div className="mt-5 flex flex-col items-center space-y-4 w-full h-full active:outline-0">
        {filteredUsers?.map((u: TStudent) => {
          return (
            <motion.div
              key={u.email}
              initial="hidden"
              animate="show"
              variants={containerVariants}
              className="bg-slate-800 rounded-3xl p-5 appWidth"
            >
              <motion.h2
                variants={itemVariants}
                className="text-white text-center"
              >
                {u.firstName + " " + u.lastName}
              </motion.h2>
              <div className="">
                <User color="white" className="inline-block" />{" "}
                <span className="text-white">User info:</span>
                <span className="text-white block">
                  email: <u>{u.email}</u>
                </span>
              </div>
              <div className="mt-5">
                <Languages color="white" className="inline-block" />{" "}
                <span className="text-white">Languages:</span>
                {printUsersLanguages(u.languages || "")}
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
