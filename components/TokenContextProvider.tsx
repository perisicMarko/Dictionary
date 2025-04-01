'use client'
import { useEffect, createContext, useState } from "react";

export type TokenContextType = {
    accessToken: string;
    setAccessToken: React.Dispatch<React.SetStateAction<string>>;
  };

export const TokenContext = createContext<TokenContextType | null>(null);

export function TokenContextProvider({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>){
    
    const [accessToken, setAccessToken] = useState('');
    useEffect(() =>{
        const fetchToken = async () => {
          const response = await fetch('/api/getAccessToken', {
            method: 'POST', 
            credentials: 'include',
          });
          if(!response.ok)
            throw new Error('Failed to retireve Access token in layout');
          const data = await response.json();
          setAccessToken(data.accessToken);
        }
        fetchToken();
    });//setting up rerender whenever accessToken value is changed


    return (
        <TokenContext.Provider value={{accessToken, setAccessToken}}>
            {children}
        </TokenContext.Provider>
    );
}