"use client";
import { getUsersBySchool } from "@/actions/manageUsers";
import { TStudent } from "@/lib/types";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpDown, User, UserSearchIcon } from "lucide-react";
import { Languages } from "lucide-react";
import { containerVariants } from "@/lib/animationVariants";
import { isBefore } from "date-fns";

const SORT = {
  BY_EXPIRATION_DATE_DESC: 0,
  BY_EXPIRATION_DATE_ASC: 1,
  EXPIRED: 2,
  ACTIVE: 3,
};

export default function Page() {
  const [users, setUsers] = useState<TStudent[] | undefined>();
  const [search, setSearch] = useState("");
  const [filterBy, setFilterBy] = useState(-1);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await getUsersBySchool();
      setUsers(res);
    };
    fetchUsers();
  }, []);

  function printUsersLanguages(languages: string) {
    return (
      <ul className="text-white list-disc mt-3 pl-10">
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

  let filteredUsers = users?.filter((user: TStudent) => {
    return (
      user.email.toLowerCase().trim().includes(search.toLowerCase().trim()) ||
      (
        user.firstName.toLowerCase().trim() +
        " " +
        user.lastName.toLowerCase().trim()
      ).includes(search.toLowerCase().trim())
    );
  });

  if (filterBy != -1 && filteredUsers != undefined) {
    switch (filterBy) {
      case SORT.BY_EXPIRATION_DATE_ASC:
        filteredUsers.sort((e1, e2) => isBefore(e1.keyExpirationDate, e2.keyExpirationDate) ? -1 : 1);
        break;
      case SORT.BY_EXPIRATION_DATE_DESC:
        filteredUsers.sort((e1, e2) => isBefore(e1.keyExpirationDate, e2.keyExpirationDate) ? 1 : -1);
        break;
      case SORT.ACTIVE:
        filteredUsers = filteredUsers.filter((e) => {
         const now = Date();
         return isBefore(now, e.keyExpirationDate); 
        });
        break;
      case SORT.EXPIRED:
        filteredUsers = filteredUsers.filter((e) => {
          const now = Date();
          return isBefore(e.keyExpirationDate, now);
        });
        break;
    }
  }

 
  return (
    <>
      <motion.div
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="box-layout center-vertically !p-2 mt-20"
      >
        <div className="center w-full pl-2">
          <UserSearchIcon color="white"/>
          <input
            placeholder="Search your students here..."
            className="text-white outline-0 w-full h-full pl-3"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="px-2 rounded-t-none text-white center justify-between w-full"
        >
          <select
            className="w-full appearance-none sm:hover:text-second cursor-pointer !py-2 !px-1 rounded-3xl h-full"
            defaultValue={-1}
            onChange={(e) => {setFilterBy(Number(e.target.value)); console.log(e.target.value)}}
          >
            <option value={-1} disabled>
              Filter users by
            </option>
            <option value={SORT.BY_EXPIRATION_DATE_ASC}>
              {"Key expiration date " + "\u2191"}
            </option>
            <option value={SORT.BY_EXPIRATION_DATE_DESC}>
              {"Key expiration date " + "\u2193"}
            </option>
            <option value={SORT.ACTIVE}>{"Active subscriptions"}</option>
            <option value={SORT.EXPIRED}>{"Expired subscriptions"}</option>
          </select>
          <ArrowUpDown
            color="white"
            height={20}
            width={20}
            className="right-3 pointer-events-none"
          />
        </motion.div>
      </motion.div>
      <div className="mt-5 flex flex-col items-center space-y-4 w-full h-full active:outline-0">
        {filteredUsers?.map((u: TStudent) => {
          return (
            <motion.div
              key={u.email}
              initial="hidden"
              animate="show"
              variants={containerVariants}
              className="box-layout"
            >
              <div className="text-white">
                <h2>
                  <User color="white" className="inline-block mb-2" />
                  User informations:
                </h2>
                {
                  <ul className="pl-10 list-disc space-y-1">
                    <li>
                      <span className="text-white inline-block">
                        <u>{u.email}</u>
                      </span>
                    </li>
                    <li>{u.firstName + " " + u.lastName}</li>
                    <li>expires at {u.keyExpirationDate.toDateString()}</li>
                  </ul>
                }
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
