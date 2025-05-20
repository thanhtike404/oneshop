

import React from "react";
import Navbar from "./components/Navbar";
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <Navbar/>
      <main>{children}</main>
    </>
  );
}