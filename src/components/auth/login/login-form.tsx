"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";

export default function LoginForm() {
    const { pending } = useFormStatus();

    return (
        <form
            className="flex flex-col justify-center max-md:justify-start items-start md:w-1/2 h-full p-6 max-md:pt-1"
        >
            <h1 className="md:h-16 my-3 text-4xl max-lg:text-3xl font-bold">
                Sign in to your account
            </h1>
            <label
                htmlFor="email"
                className="mt-2 mb-1 max-lg:text-sm font-semibold"
            >
                Email
            </label>
            <input
                id="email"
                type="email"
                className="w-11/12 max-md:w-full h-10 p-3 border border-gray-300 rounded-lg text-sm max-md:text-xs"
                placeholder="example@email.com"
                required
            />
            <label
                htmlFor="password"
                className="mt-2 mb-1 max-lg:text-sm font-semibold"
            >
                Password
            </label>
            <input
                id="password"
                type="password"
                className="w-11/12 max-md:w-full h-10 p-3 border border-gray-300 rounded-lg text-sm max-md:text-xs"
                placeholder="password"
                required
            />
            <div className="flex flex-row items-center mt-3 space-x-2">
                <label
                    htmlFor="remember-me"
                    className="text-sm font-semibold"
                >
                    Remember me
                </label>
                <input
                    id="remember-me"
                    type="checkbox"
                    className="w-4"
                />
            </div>
            <button
                className="w-11/12 max-md:w-full my-6 p-2 border-0 rounded-lg text-sm text-white font-semibold bg-blue-500 hover:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 transition-colors duration-200"
                aria-disabled={pending}
            >
                Login
            </button>
            <p className="max-md:mb-6 text-sm">
                Don't have an account?
                <Link
                    href={"/signup"}
                    className="ml-1 font-semibold text-blue-500 border-b border-blue-500"
                >Sign up now!</Link>
            </p>
        </form>
    )
}