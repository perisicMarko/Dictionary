"use client";
import { useEffect, createContext, useState } from "react";
import SessionExpiredWindow from "./SessionExpiredWindow";

export type TokenContextType = {
  accessToken: string;
  setAccessToken: React.Dispatch<React.SetStateAction<string>>;
};

export const TokenContext = createContext<TokenContextType | null>(null);

export function TokenContextProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [accessToken, setAccessToken] = useState("");
  const [sessionExpiring, setSessionExpiring] = useState(false);

  useEffect(() => {
    const fetchToken = async () => {
      const response = await fetch("/api/getAccessToken", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) console.log("Failed to fetch access token.");

      const data = await response.json();
      if (data.sessionExpiring) setSessionExpiring(true);
      setAccessToken(data.accessToken);
    };
    //call it manualy for the first time
    fetchToken();

    const intervalFetching = setInterval(() => {
      fetchToken();
    }, 1000 * 60 * 3);

    return () => clearInterval(intervalFetching);
  }, []);

  return (
    <TokenContext.Provider value={{ accessToken, setAccessToken }}>
      {sessionExpiring ? (
        <SessionExpiredWindow collapseWindow={setSessionExpiring} />
      ) : (
        children
      )}
    </TokenContext.Provider>
  );
}
