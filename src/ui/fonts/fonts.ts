import localFont from "next/font/local";
import { Poppins } from "next/font/google";

export const geistSans = localFont({
    src: "./GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});

export const geistMono = localFont({
    src: "./GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const poppins = Poppins({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-poppins",
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});