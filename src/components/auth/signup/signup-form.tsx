"use client";

import { signUp } from "@/libs/actions/auth";
import { authErrorMessage } from "@/libs/utils/helper";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import clsx from "clsx";

export default function SignupForm() {
    const [ error, dispatch ] = useFormState(signUp, undefined);

    return (
        <form
            action={dispatch}
            className="flex flex-col justify-center max-md:justify-start items-start md:w-1/2 h-full p-6 pt-3 max-md:pt-1"
        >
            <header className="md:h-[108px]">
                <h1 className="text-4xl max-lg:text-3xl font-bold">
                    Sign up to get started
                </h1>
                <p className="my-2 md:me-4 max-lg:my-1 max-lg:text-sm text-gray-500">
                    Enter your details to create a new account
                </p>
            </header>
            <label
                htmlFor="username"
                className="mt-2 mb-1 max-lg:text-sm font-semibold"
            >
                Username
            </label>
            <input
                id="username"
                name="username"
                type="text"
                className="w-11/12 max-md:w-full h-10 p-3 border border-gray-300 rounded-lg text-sm max-md:text-xs"
                placeholder="username"
                required
            />
            <label
                htmlFor="email"
                className="mt-2 mb-1 max-lg:text-sm font-semibold"
            >
                Email
            </label>
            <input
                id="email"
                name="email"
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
                name="password"
                type="password"
                className="w-11/12 max-md:w-full h-10 p-3 border border-gray-300 rounded-lg text-sm max-md:text-xs"
                placeholder="password"
                required
            />
            <p className={clsx(
                "w-11/12 max-md:w-full mt-4 text-center text-sm text-red-500",
                { "hidden": !error }
            )}>
                {authErrorMessage(error)}
            </p>
            <SignupButton />
            <p className="max-md:mb-6 text-sm">
                Already have an account?
                <Link
                    href={"/login"}
                    className="ml-1 font-semibold text-blue-500 border-b border-blue-500"
                >Log in</Link>
            </p>
        </form>
    )
}

function SignupButton() {
    const { pending } = useFormStatus();
    return (
        <button
            className="w-11/12 max-md:w-full my-6 p-2 border-0 rounded-lg text-sm text-white font-semibold bg-blue-500 hover:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 transition-colors duration-200"
            aria-disabled={pending}
        >
            Sign Up
        </button>
    )
}