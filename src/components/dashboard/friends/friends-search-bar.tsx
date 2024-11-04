"use client";

import avatarDefault from "@/ui/icons/avatar-default.png";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useState, useCallback, ChangeEvent } from "react";
import { useDebouncedCallback } from "use-debounce";
import clsx from "clsx";

export default function FriendsSearchBar({
    hideSearchResults,
    hideSearchButton,
}: {
    hideSearchResults?: boolean,
    hideSearchButton?: boolean,
}) {
    const [ searchFocused, setSearchFocused ] = useState<boolean>(false);
    const [ showSearchAutocomplete, setShowSearchAutocomplete ] = useState<boolean>(hideSearchResults ?? false);
    const [ searchTerm, setSearchTerm ] = useState<string>("");

    const searchUsers = useCallback(async (search: string) => {
        setSearchTerm(search);
        if (searchFocused && search.length > 0) {
            setShowSearchAutocomplete(true);
            return;
        }
        setShowSearchAutocomplete(false);
    }, [setShowSearchAutocomplete, setSearchTerm, searchFocused]);

    const toggleSearchResults = useCallback((focus: boolean) => {
        setTimeout(() => {
            setSearchFocused(focus);
        }, searchFocused ? 300 : 0);
    }, [searchFocused]);

    const handleSearch = useDebouncedCallback(async (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const search = e.target.value;
        await searchUsers(search);
    }, 300);

    return (
        <div className="flex flex-1 flex-shrink-0 max-md:text-sm">
            <label
                htmlFor="search"
                className="sr-only"
            >
                Search
            </label>
            <div className="relative w-full">
                <input
                    name="search"
                    id="search"
                    placeholder="Enter username here..."
                    defaultValue={""}
                    className="w-full h-10 border border-gray-300 rounded-md p-3 bg-white"
                    onChange={handleSearch}
                    onFocus={() => toggleSearchResults(true)}
                    onBlur={() => toggleSearchResults(false)}
                />
                {searchFocused && showSearchAutocomplete &&
                    <div className="absolute top-12 border border-slate-100 rounded-lg w-full p-3 bg-white shadow-sm z-10">
                        <FriendSearchAutocomplete s={searchTerm} />
                    </div>
                }
                <MagnifyingGlassIcon className="absolute right-3 bottom-2.5 w-5 h-5 text-gray-500" />
            </div>
            <Link
                href={`/dashboard/friends/list${searchTerm && `?search=${searchTerm}`}`}
                className={clsx(
                    "flex flex-row items-center gap-2 max-md:gap-1 border-0 rounded-lg w-fit h-10 px-6 ml-3 max-md:px-3 max-md:ml-1 text-white font-semibold bg-blue-500 hover:bg-blue-600 transition-colors duration-200",
                    { "hidden": hideSearchButton },
                )}
            >
                <span>Search</span>
            </Link>
        </div>
    )
}

function FriendSearchAutocomplete({
    s,
}: {
    s?: string,
}) {
    return (
        <ul className="w-full">
            {Array.from({ length: 4 }).map((_, idx) => {
                return (
                    <li
                        key={`result_${idx}`}
                        className="w-full h-16 border-0 rounded-lg hover:bg-gray-200 duration-200"
                    >
                        <Link
                            href={"/dashboard"}
                            className="flex items-center w-full h-full p-3"
                        >
                            <div className="flex flex-row justify-start items-center gap-2 w-full h-full whitespace-nowrap overflow-hidden">
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
                                <p className="min-w-fit whitespace-nowrap font-semibold text-ellipsis overflow-hidden">
                                    {s}
                                </p>
                                <p className="whitespace-nowrap text-sm text-ellipsis overflow-hidden">
                                    {s}
                                </p>
                            </div>
                        </Link>
                    </li>
                )
            })}
        </ul>
    )
}