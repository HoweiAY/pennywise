"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function TransactionsSearchBar() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((searchTerm: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", "1");
        if (searchTerm) {
            params.set("search", searchTerm);
        } else {
            params.delete("search");
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

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
                defaultValue={searchParams.get("search")?.toString()}
                className="w-full h-10 border border-gray-300 rounded-md p-3 bg-white"
                onChange={(e) => handleSearch(e.target.value)}
            />
            <MagnifyingGlassIcon className="absolute right-3 bottom-2.5 w-5 h-5 text-gray-500" />
        </div>
    )
}