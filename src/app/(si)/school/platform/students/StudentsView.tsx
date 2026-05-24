"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, UserSearchIcon } from "lucide-react";
import { isBefore } from "date-fns";
import { TStudent } from "@/shared/types";
import StudentComponent from "./StudentComponent";
import ZeroNotesMessage from "@/features/notes/ui/ZeroNotesMessage";

const SORT = {
  BY_EXPIRATION_DATE_DESC: 0,
  BY_EXPIRATION_DATE_ASC: 1,
  EXPIRED: 2,
  ACTIVE: 3,
};

export default function StudentsView({
  initialUsers,
}: {
  initialUsers: TStudent[];
}) {
  const [search, setSearch] = useState("");
  const [filterBy, setFilterBy] = useState(-1);

  const filteredUsers = useMemo(() => {
    let nextUsers = initialUsers.filter((user) => {
      return (
        user.email.toLowerCase().trim().includes(search.toLowerCase().trim()) ||
        (user.firstName.toLowerCase().trim() +
          " " +
          user.lastName.toLowerCase().trim()
        ).includes(search.toLowerCase().trim())
      );
    });

    if (filterBy === -1) {
      return nextUsers;
    }

    switch (filterBy) {
      case SORT.BY_EXPIRATION_DATE_ASC:
        return [...nextUsers].sort((e1, e2) =>
          isBefore(e1.keyExpirationDate, e2.keyExpirationDate) ? -1 : 1
        );
      case SORT.BY_EXPIRATION_DATE_DESC:
        return [...nextUsers].sort((e1, e2) =>
          isBefore(e1.keyExpirationDate, e2.keyExpirationDate) ? 1 : -1
        );
      case SORT.ACTIVE:
        return nextUsers.filter((e) =>
          isBefore(new Date(), e.keyExpirationDate)
        );
      case SORT.EXPIRED:
        return nextUsers.filter((e) =>
          isBefore(e.keyExpirationDate, new Date())
        );
      default:
        return nextUsers;
    }
  }, [filterBy, initialUsers, search]);

  return (
    <>
      <div className="box-layout center-vertically !p-2 mt-20 enter-fade">
        <div className="center w-full pl-3">
          <UserSearchIcon color="white" />
          <input
            placeholder="Search your students here..."
            className="text-text-main outline-0 w-full h-full pl-3"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="px-3 rounded-t-none text-text-main center justify-between w-full enter-fade-up enter-delay-1">
          <select
            className="w-full appearance-none sm:hover:text-text-second cursor-pointer !py-2 rounded-3xl h-full"
            defaultValue={-1}
            onChange={(e) => {
              setFilterBy(Number(e.target.value));
            }}
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
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <ZeroNotesMessage message="No students found." />
      ) : (
        <div className="mt-5 flex flex-col items-center space-y-4 w-full h-full active:outline-0">
          {filteredUsers.map((user) => {
            return <StudentComponent key={user.email} student={user} />;
          })}
        </div>
      )}
    </>
  );
}
