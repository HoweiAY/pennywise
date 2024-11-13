"use client";

import avatarDefault from "@/ui/icons/avatar-default.png";
import { baseUrl } from "@/lib/utils/constant";
import { UserData } from "@/lib/types/user";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState, useCallback, ChangeEvent } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";

export default function FriendsSearchBar({
    hideSearchResults,
    hideSearchButton,
}: {
    hideSearchResults?: boolean,
    hideSearchButton?: boolean,
}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [ searchFocused, setSearchFocused ] = useState<boolean>(false);
    const [ showSearchAutocomplete, setShowSearchAutocomplete ] = useState<boolean>(false);
    const [ searchTerm, setSearchTerm ] = useState<string>("");

    const { data: searchedUsers } = useQuery({
        queryKey: ["searchUsers", hideSearchResults, searchTerm],
        queryFn: async () => {
            const res = await fetch(
                `${baseUrl}/api/users?search=${searchTerm}&limit=5&excludeCurrentUser=true`,
                { cache: "no-store" },
            );
            if (res.status !== 200) {
                console.error(res.statusText);
                return [];
            }
            const { data: usersData } = await res.json() as { data: UserData[] };
            return usersData;
        },
        initialData: [],
        enabled: !hideSearchResults && searchTerm.length > 0,
    });

    const searchUsers = useCallback(async (search: string) => {
        setSearchTerm(search);
        if (!hideSearchResults && searchFocused && search.length > 0) {
            setShowSearchAutocomplete(true);
            return;
        }
        setShowSearchAutocomplete(false);
        const params = new URLSearchParams(searchParams.toString());
        if (search) {
            params.set("search", search);
        } else {
            params.delete("search");
        }
        replace(`${pathname}?${params.toString()}`);
    }, [hideSearchResults, searchFocused]);

    const toggleSearchResults = useCallback((focus: boolean) => {
        setTimeout(() => {
            setSearchFocused(focus);
        }, searchFocused ? 300 : 0);
    }, [searchFocused]);

    const handleSearch = useDebouncedCallback(async (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const search = e.target.value.trim();
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
                    defaultValue={searchTerm}
                    className="w-full h-10 border border-gray-300 rounded-md p-3 bg-white"
                    onChange={handleSearch}
                    onFocus={() => toggleSearchResults(true)}
                    onBlur={() => toggleSearchResults(false)}
                />
                {searchFocused && showSearchAutocomplete && searchedUsers.length > 0 &&
                    <div className="absolute top-12 border border-slate-100 rounded-lg w-full p-3 bg-white shadow-sm z-10">
                        <FriendSearchAutocompleteList searchedUsers={searchedUsers} />
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

function FriendSearchAutocompleteList({ searchedUsers }: { searchedUsers?: UserData[] }) {
    return (
        <ul className="w-full">
            {searchedUsers?.map((user, idx) => {
                return (
                    <li
                        key={`result_${idx}`}
                        className="w-full h-16 border-0 rounded-lg hover:bg-gray-200 duration-200"
                    >
                        <Link
                            href={`/dashboard/profile/${user.username}`}
                            className="flex items-center w-full h-full p-3"
                        >
                            <div className="flex flex-row justify-start items-center gap-2 w-full h-full whitespace-nowrap overflow-hidden">
                                <div className="w-10 h-10 min-w-10 border-2 border-gray-700 rounded-full overflow-clip">
                                    <Image
                                        priority
                                        loader={({ src, width, quality }) => `${src}?w=${width}&q=${quality}`}
                                        src={user.avatar_url || avatarDefault.src}
                                        width={40}
                                        height={40}
                                        alt={"User avatar"}
                                    />
                                </div>
                                <p className="min-w-fit whitespace-nowrap font-semibold text-ellipsis overflow-hidden">
                                    {user.username}
                                </p>
                                <p className="whitespace-nowrap text-gray-500 text-sm text-ellipsis overflow-hidden">
                                    {user.first_name && user.last_name 
                                        ? `${user.first_name} ${user.last_name}`
                                        : `${user.email}`
                                    }
                                </p>
                            </div>
                        </Link>
                    </li>
                )
            })}
        </ul>
    )
}