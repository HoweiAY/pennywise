import SideBanner from "@/components/auth/side-banner";
import SignupForm from "@/components/auth/signup/signup-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign up - PennyWise"
};

export default function SignUpPage() {
    return (
        <main className="flex justify-center items-center h-screen min-h-[700px] bg-gray-50">
            <div className="flex flex-row max-md:flex-col justify-center max-md:justify-start md:items-center gap-6 border rounded-2xl shadow-2xl w-10/12 max-md:w-3/4 md:h-[600px] min-w-[400px] min-h-[400px] bg-white overflow-hidden">
                <SideBanner />
                <SignupForm />
            </div>
        </main>
    )
}