"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function TransactionsSearchBar() {
    return (
        <div className="relative flex flex-1 flex-shrink-0 max-md:text-sm">
            <label
                htmlFor="search"
                className="sr-only"
            >
                Search
            </label>
            <input
                name="search"
                id="search"
                placeholder="Search transactions..."
                className="w-full h-10 border border-gray-300 rounded-md p-3 bg-white"
            />
            <MagnifyingGlassIcon className="absolute right-3 bottom-2.5 w-5 h-5 text-gray-500" />
        </div>
    )
}