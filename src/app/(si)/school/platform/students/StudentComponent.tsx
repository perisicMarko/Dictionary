import { TStudent } from "@/shared/types";
import { User, Languages } from "lucide-react";

export default function StudentComponent({ student }: { student: TStudent }) {

  function printUsersLanguages(languages: string) {
    return (
      <ul className="text-text-main list-disc mt-3 pl-10">
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

  return (
    <div
      key={student.email}
      className="box-layout relative enter-fade"
    >
      {/* <div
        className="absolute right-0 top-5 flex flex-col items-center rounded-2xl w-[100px]"
        title="Menu"
      >
        {dropMenu ? (
          <X
            color="white"
            className="btn"
            width={25}
            height={25}
            onClick={(e) => {
              e.stopPropagation();
              setDropMenu(false);
            }}
          />
        ) : (
          <Menu
            color="white"
            className="btn"
            width={25}
            height={25}
            onClick={(e) => {
              e.stopPropagation();
              setDropMenu(true);
            }}
          />
        )}

        {dropMenu && (
          <div className="bg-white/80 center-vertically pointer-events-auto z-10 left-2 gap-1 px-2 py-1 rounded-2xl">
            <Edit
              onClick={() => {}}
              className="text-text-second hover:text-text-main cursor-pointer"
            />
          </div>
        )}
      </div> */}
      <div className="text-text-main">
        <h2>
          <User color="white" className="inline-block mb-2" />
          User informations:
        </h2>
        {
          <ul className="pl-10 list-disc space-y-1">
            <li>
              <span className="text-text-main inline-block">
                <u>{student.email}</u>
              </span>
            </li>
            <li>{student.firstName + " " + student.lastName}</li>
            <li>expires at {student.keyExpirationDate.toDateString()}</li>
          </ul>
        }
        <div className="mt-5">
          <Languages color="white" className="inline-block" />{" "}
          <span className="text-text-main">Languages:</span>
          {printUsersLanguages(student.languages || "")}
        </div>
      </div>
    </div>
  );
}
