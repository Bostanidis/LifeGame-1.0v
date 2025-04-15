import { Raleway, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/themeProvider";
import Header from "@/components/Header";
import { AuthProvider } from "@/auth/AuthContext";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "LifeGame",
  description: "Habit tracker app like video game",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${raleway.variable} font-poppins antialiased bg-slate-50 dark:bg-slate-900 min-h-screen text-slate-900 dark:text-slate-100 flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Header />
            <main className="flex-1 w-full">
              {children}
            </main>
            <footer className="w-full border-t border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900/50">
              <div className="container mx-auto flex h-16 items-center justify-center px-4 sm:px-6 lg:px-8">
                <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                  © {new Date().getFullYear()} LifeGame by CodeCultureCy. All rights reserved.
                </p>
              </div>
            </footer>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
