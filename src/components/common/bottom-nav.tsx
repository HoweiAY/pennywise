"use client";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { navLinks } from "@/lib/utils/constant";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="flex flex-row justify-around items-center border-t border-t-gray-200 h-20 p-2 bg-sky-50 sticky bottom-0 z-20 md:hidden">
            {navLinks.map(link => {
                const LinkIcon = link.icon;
                return (
                    <TooltipProvider key={link.name.toLowerCase()}>
                        <Tooltip>
                            <TooltipTrigger>
                                <li className={`flex items-center rounded-md w-16 h-12 overflow-hidden duration-200`}>
                                    <Link
                                        href={link.href}
                                        className={clsx(
                                            "flex flex-none justify-center items-center gap-3 w-full h-full p-3 hover:bg-sky-200 hover:text-blue-600 font-medium duration-200",
                                            { "bg-sky-200 text-blue-600 hover:bg-sky-200 border-0 shadow-md shadow-slate-100 font-semibold": pathname.match(link.urlRegex) },
                                        )}
                                    >
                                        <LinkIcon className="w-6 min-w-6" />
                                    </Link>

                                </li>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-sm">{link.name}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )
            })}
        </nav>
    )
}