import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Account Setup - PennyWise",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex justify-center items-center h-screen min-h-[700px] bg-gray-50">
            <Suspense>
                {children}
            </Suspense>
        </div>
    );
}