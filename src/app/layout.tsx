import "./globals.css";
export const metadata = { title: "Engineering Universe", description: "Explore how technology connects." };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
