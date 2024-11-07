import { Header } from "@/components/shared/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function Layout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen">
      <Header />
      {children}
      {modal}
    </main>
  );
}
