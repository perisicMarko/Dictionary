"use client";
import Loader from "@/reusableComponents/Loader";
import { useActionState, useState } from "react";
import { generateActivationKey } from "@/features/schools/application";

export default function GenerateKeyPage() {
  const [state, action, isPending] = useActionState(generateActivationKey, {
    success: false,
    message: "",
    email: "",
    date: "",
  });

  const [formData, setFormData] = useState<{
    email: string;
    date: string;
    language: string;
  }>({ email: "", date: "", language: "" });
  const { email, date, language } = formData;
  const isSubmitDisabled = email === "" || date === "" || language === "";

  return (
    <>
      <div className="box-layout mt-50 enter-fade">
        <form
          action={action}
          className="space-y-2 enter-fade-up"
        >
          <div className="flex flex-col justify-center items-start gap-1">
            <label htmlFor="email">Email of the course atendee:</label>
            <input
              name="email"
              type="text"
              className="w-full bg-white text-text-second rounded-3xl block p-2"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            {state?.email != "" && (
              <span className="error">{state?.email}</span>
            )}
          </div>
          <div className="flex flex-col justify-center items-start gap-1">
            <label htmlFor="courseEnd">End of the course:</label>
            <input
              name="courseEnd"
              type="date"
              className="text-text-main block w-full appearance-none outline-2 !outline-white rounded-3xl p-1"
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </div>
          {state?.date != "" && (
            <span className="error mb-5">{state?.date}</span>
          )}
          <div className="flex flex-col items-start justify-center gap-1">
            <label htmlFor="language">Key for:</label>
            <select
              name="language"
              className="text-text-main outline-none appearance-none rounded-3xl border-2 border-white p-1 w-full hover:text-text-second"
              defaultValue={-1}
              onChange={(e) =>
                setFormData({ ...formData, language: e.target.value })
              }
            >
              <option disabled value={-1}>
                Select a language
              </option>
              <option value="e">English</option>
            </select>
          </div>
          <div className="mt-5">
            <button
              className={`center primary-btn ${
                isSubmitDisabled ? "opacity-50" : ""
              }`}
              disabled={isSubmitDisabled || isPending}
            >
              {isPending ? <Loader /> : "Generate key"}
            </button>
          </div>
        </form>
      </div>
      {state?.success && (
        <div className="box-layout mt-5 enter-fade">
          <p className="text-box enter-fade-up enter-delay-1">
            <b>{state?.message}</b>
          </p>
        </div>
      )}
    </>
  );
}
