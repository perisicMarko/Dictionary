import "@/app/globals.css";
import { NavBar } from './../../../components/NavBar';
import { TokenContextProvider } from "@/components/TokenContextProvider"; 

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <TokenContextProvider>
      <NavBar/> 
      {children}
    </TokenContextProvider>
  );
}
