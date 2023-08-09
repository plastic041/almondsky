import "@radix-ui/themes/styles.css";
import "./globals.css";
import { Inter } from "next/font/google";
import { Provider } from "~/app/provider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
