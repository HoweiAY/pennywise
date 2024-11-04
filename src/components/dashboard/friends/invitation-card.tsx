"use client";

import avatarDefault from "@/ui/icons/avatar-default.png";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState, useTransition } from "react";

export default function InvitationCard() {
    return (
        <div className="relative hover:scale-[102%] duration-200">
            <div className="flex flex-row justify-between items-center border border-slate-100 rounded-xl w-full h-24 p-3 bg-white shadow-md text-gray-800">
                <Link
                    href={`/dashboard`}
                    className="flex shrink-0 items-center gap-2 w-2/3 overflow-hidden"
                >
                    <div className="w-10 h-10 min-w-10 border-2 border-gray-700 rounded-full">
                        <Image
                            priority
                            loader={({ src, width, quality }) => `${src}?w=${width}&q=${quality}`}
                            src={avatarDefault.src}
                            width={40}
                            height={40}
                            alt={"User avatar"}
                        />
                    </div>
                    <div className="flex flex-col justify-center overflow-hidden">
                        <p className="whitespace-nowrap font-semibold text-ellipsis overflow-hidden">
                            username
                        </p>
                        <p className="whitespace-nowrap text-sm text-ellipsis overflow-hidden">
                            Firstname Lastname
                        </p>
                    </div>
                </Link>
                <div className="flex flex-col justify-center items-center gap-2 w-1/3">
                    <button
                        className="border-0 rounded-md w-full p-2 text-center text-green-500 hover:text-white text-xs font-semibold bg-green-100 hover:bg-green-500 shadow-sm shadow-slate-300 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 transition-colors duration-200"
                        onClick={() => { }}
                    >
                        Accept
                    </button>
                    <button
                        className="border rounded-md w-full p-2 text-center text-xs text-rose-600 font-semibold bg-white hover:bg-rose-600 hover:text-white shadow-sm shadow-slate-300 duration-200"
                        onClick={() => { }}
                    >
                        Decline
                    </button>
                </div>
            </div>
        </div>
    )
}