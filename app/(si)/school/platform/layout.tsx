import "@/app/globals.css";
import NavBar from "@/schoolComponents/NavBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <>
      <NavBar/> 
      {children}
    </>
  );
}