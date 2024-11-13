import FriendsSearchBar from "@/components/dashboard/friends/friends-search-bar";
import ListTabSelector from "@/components/dashboard/friends/list-tab-selector";
import ListContainer from "@/components/dashboard/friends/list-container";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Friend List - PennyWise",
};

export default async function List({
    searchParams,
}: {
    searchParams?: {
        tab?: string,
        search?: string,
    }
}) {
    const search = searchParams?.search || "";
    let tab: string | undefined = searchParams?.tab;
    if (tab !== "all" && tab !== "pending" && tab !== "invited" && tab !== "my-friends") {
        tab = undefined;
    }

    const showListTab = () => {
        switch (tab) {
            case "pending":
                return <ListContainer type="pending" search={search} infiniteScroll={true} />;
            case "invited":
                return <ListContainer type="invited" search={search} infiniteScroll={true} />;
            case "my-friends":
                return <ListContainer type="my-friends" search={search} infiniteScroll={true} />;
            default:
                return (
                    <>
                        <ListContainer type="pending" title="Pending" search={search} limit={3} />
                        <ListContainer type="invited" title="Invited" search={search} limit={3} />
                        <ListContainer type="my-friends" title="My friends" search={search} limit={3} />
                        <ListContainer type="all" title="All users" search={search} infiniteScroll={true} />
                    </>
                );
        };
    };

    return (
        <main className="h-fit max-md:min-h-screen mb-2 overflow-hidden">
            <div className="px-6">
                <header>
                    <h1 className="mt-8 pb-1 text-3xl max-md:text-2xl font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
                        Friend list
                    </h1>
                    <p className="mt-1 md:me-4 max-md:my-1 max-md:text-sm text-gray-500">
                        View your friends and search for new users
                    </p>
                </header>
                <div className="w-full mt-6 my-4">
                    <FriendsSearchBar hideSearchResults={true} hideSearchButton={true} />
                </div>
                <section className="flex flex-col w-full my-6">
                    <ListTabSelector initialTab={tab} />
                    {showListTab()}
                </section>
            </div>
        </main>
    )
}