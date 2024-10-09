"use client";

import { login } from "@/lib/actions/auth";
import { authErrorMessage } from "@/lib/utils/helper";
import Link from "next/link";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { ExclamationCircleIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

export default function LoginForm() {
    const [ error, dispatch ] = useFormState(login, undefined);
    const [ passwordHidden, setPasswordHidden ] = useState<boolean>(true);

    const showTogglePasswordButton = () => {
        const className = "absolute top-3 right-4 w-5 h-5 max-md:w-4 max-md:h-4 bg-white hover:cursor-pointer";
        const onClick = () => setPasswordHidden(prev => !prev);
        return (
            passwordHidden 
            ? <EyeIcon className={className} onClick={onClick} /> 
            : <EyeSlashIcon className={className} onClick={onClick} />
        )
    };

    return (
        <form
            action={dispatch}
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
            <div className="relative w-11/12 max-md:w-full">
                <input
                    id="password"
                    name="password"
                    type={passwordHidden ? "password" : "text"}
                    className="w-full h-10 p-3 border border-gray-300 rounded-lg text-sm max-md:text-xs"
                    placeholder="password"
                    required
                /> 
                {showTogglePasswordButton()}
            </div>
            <Link
                href={"/reset-password"}
                className="w-fit mt-3 text-sm max-md:text-xs font-semibold text-blue-500 border-b border-blue-500"
            >
                Forgot your password?
            </Link>
            <p className={clsx(
                "flex flex-row justify-center gap-1 w-11/12 max-md:w-full mt-4 text-center text-sm max-md:text-xs text-red-500",
                { "hidden": !error }
            )}>
                <ExclamationCircleIcon className="w-5 h-5 max-md:w-4 max-md:h-4" />
                {authErrorMessage(error)}
            </p>
            <LoginButton />
            <p className="max-md:mb-4 text-sm max-md:text-xs">
                Don't have an account?
                <Link
                    href={"/signup"}
                    className="ml-1 font-semibold text-blue-500 border-b border-blue-500"
                >Sign up now!</Link>
            </p>
        </form>
    )
}

function LoginButton() {
    const { pending } = useFormStatus();
    return (
        <button
            className="w-11/12 max-md:w-full my-6 p-2 max-md:mt-4 border-0 rounded-lg text-sm text-white font-semibold bg-blue-500 hover:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 transition-colors duration-200"
            aria-disabled={pending}
        >
            Login
        </button>
    )
}