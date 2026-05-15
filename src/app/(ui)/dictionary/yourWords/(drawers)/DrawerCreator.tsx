"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { createDrawer } from "@/features/drawers/application";
import Loader from "@/components/common/Loader";
import { useRouter } from "next/navigation";

export default function DrawerCreator({
  drawerNames,
}: {
  drawerNames: string[] | undefined;
}) {
  return <DrawerCreatorView drawerNames={drawerNames} />;
}

function DrawerCreatorView({
  drawerNames,
}: {
  drawerNames: string[] | undefined;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, action, isPending] = useActionState(createDrawer, undefined);
  const [drawerName, setDrawerName] = useState("");
  const drawerAddRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!state) {
      return;
    }

    if (!state.success) {
      router.push("/login");
      return;
    }

    setIsOpen(false);
    setDrawerName("");
  }, [state, router]);

  useEffect(() => {
    if (isOpen && drawerAddRef.current) {
      drawerAddRef.current.focus();
    }
  }, [isOpen]);

  const normalizedDrawerName = drawerName.trim();
  const isDuplicateDrawerName = drawerNames?.some(
    (name) => name.toLowerCase() === normalizedDrawerName.toLowerCase()
  );
  const isValidDrawerName =
    normalizedDrawerName !== "" && !isDuplicateDrawerName;

  return (
    <div className="box-layout mt-5 h-25 center-vertically gap-2 relative enter-fade">
      {isOpen ? (
        <>
          <button
            type="button"
            aria-label="Close drawer creator"
            className="absolute text-text-main top-2 right-3 mr-4 mt-2 scale-90 hover:text-text-second cursor-pointer transition-all enter-fade-up enter-delay-1"
            onClick={() => setIsOpen(false)}
          >
            <X />
          </button>

          <form
            action={action}
            className="p-5 center-vertically gap-3 enter-fade-up enter-delay-1"
          >
            <input
              ref={drawerAddRef}
              placeholder="Name your drawer"
              name="title"
              className="text-text-main p-1 outline-none selection:outline-0 text-center"
              value={drawerName}
              onChange={(e) => {setDrawerName(e.target.value); router.refresh();}}
            />
            <button
              type="submit"
              className={`primary-btn !h-7.5 !xl:h-9.5 center p-2 ${!isValidDrawerName ? "opacity-50" : ""
                }`}
              disabled={!isValidDrawerName || isPending}
            >
              {isPending ? <Loader /> : "Create drawer"}
            </button>
          </form>
        </>
      ) : (
        <>
          <span className="text-text-main enter-fade-up enter-delay-1">
            Add drawer
          </span>
          <button
            type="button"
            className="hover:text-text-second cursor-pointer text-text-main transition-all duration-200 enter-fade-up enter-delay-1"
            title="Add drawer"
            aria-label="Open drawer creator"
            onClick={() => setIsOpen(true)}
          >
            <Plus width={30} height={30} />
          </button>
        </>
      )}
    </div>
  );
}
