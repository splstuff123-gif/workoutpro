import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WorkoutPro",
  description: "Track your workout progress and achieve your fitness goals",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
