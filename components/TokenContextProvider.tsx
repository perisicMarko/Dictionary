"use client";
import { useEffect, createContext, useState } from "react";
import SessionExpiredWindow from "./SessionExpiredWindow";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  // calls api every three minutes to fetch access token and if it fails (no refresh token)
  // user will be logged out imediately if getAccessToken end point returns 401 (no valid refresh token founded) but this should not happen(only of token is deleted manually from storage)
  // if user do not take any action in session expiring window, the token will perish from the browser after remaining minutes of 7 days and when api gets called again it will 
  // return 401 and log out the user, session Expiring winwo will show up 10-15 minutes before session expires
  useEffect(() => {
    const fetchToken = async () => {
      const response = await fetch("/api/getAccessToken", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();
      if (data.sessionExpiring) setSessionExpiring(true);
      if(data.status === 401) router.push('/');
        
      setAccessToken(data.accessToken);
    };
    //call it manualy for the first time
    fetchToken();

    const intervalFetching = setInterval(() => {
      fetchToken();
    }, 1000 * 60 * 3);

    return () => clearInterval(intervalFetching);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TokenContext.Provider value={{ accessToken, setAccessToken }}>
      {sessionExpiring && 
        <SessionExpiredWindow collapseWindow={setSessionExpiring} />
      }      
      {children}
    </TokenContext.Provider>
  );
}