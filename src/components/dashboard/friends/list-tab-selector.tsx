"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import clsx from "clsx";

const listTabs = [
    { name: "All", tab: "all" },
    { name: "Pending", tab: "pending" },
    { name: "Invited", tab: "invited" },
    { name: "My friends", tab: "my-friends" },
];

export default function ListTabSelector({ initialTab }: { initialTab?: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [ activeTab, setActiveTab ] = useState<string | undefined>(initialTab);

    const handleSwitchTab = useCallback((tab: string) => {
        setActiveTab(tab);
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", tab);
        replace(`${pathname}?${params.toString()}`);
    }, [searchParams, pathname]);

    return (
        <div className="flex flex-row items-center border-b border-b-blue-500 w-full">
            {listTabs.map((tab, idx) => {
                return (
                    <button
                        key={`tab_${idx}`}
                        className={clsx(
                            "px-6 py-2 max-md:px-4 max-md:text-sm border-b-2 border-transparent hover:rounded-t-sm hover:border-b-blue-500 hover:text-blue-500 hover:bg-sky-100 duration-200",
                            {"border-b-2 border-b-blue-500 rounded-t-sm text-blue-500 font-semibold bg-sky-100": activeTab === tab.tab || (tab.tab === "all" && !activeTab) },
                        )}
                        onClick={() => handleSwitchTab(tab.tab)}
                    >
                        {tab.name}
                    </button>
                )
            })}
        </div>
    )
}