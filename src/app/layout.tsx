import "./styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";


import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Administrador de tempo",
  description:
    "com o Administrador de tempo, você podera organizar melhor seu tempo, e reajustar sua vida para se tornar mais produtivo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <head>
        <link rel="icon" href="./icons/favicon-32x32.png" />

        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#06092b" />
      </head>
      <body className={inter.className}>
        <ToastContainer autoClose={3000} />
        {children}
      </body>
    </html>
  );
}
