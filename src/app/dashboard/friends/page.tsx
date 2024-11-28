import FriendsSearchBar from "@/components/dashboard/friends/friends-search-bar";
import FriendInvitationsCarousel from "@/components/dashboard/friends/friend-invitations-carousel";
import ListContainer from "@/components/dashboard/friends/list-container";
import FriendsListContainerSkeleton from "@/ui/skeletons/friends-list-container-skeleton";
import FriendInvitationsCarouselSkeleton from "@/ui/skeletons/friend-invitations-carousel-skeleton";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { UserGroupIcon } from "@heroicons/react/24/solid";
import { getAuthUser } from "@/lib/data/auth";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Friends - PennyWise",
};

export default async function Friends() {
    const { user } = await getAuthUser();

    return (
        <main className="h-fit max-md:min-h-screen mb-2 overflow-hidden">
            <div className="px-6">
                <h1 className="mt-8 mb-2 text-3xl max-md:text-2xl font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
                    Friends
                </h1>
                <section className="flex flex-col gap-2 border border-slate-100 rounded-xl w-full p-6 my-6 max-md:px-3 bg-white shadow-lg">
                    <h2 className="pb-2 max-md:pb-1 text-2xl max-md:text-xl font-semibold">
                        Search friend
                    </h2>
                    <FriendsSearchBar />
                </section>
                <section className="flex flex-col items-center w-full my-3">
                    <h2 className="self-start text-2xl max-md:text-xl font-semibold">
                        Pending invitations
                    </h2>
                    <Suspense fallback={<FriendInvitationsCarouselSkeleton />}>
                        <FriendInvitationsCarousel currUserId={user.id} />
                    </Suspense>
                    <Link
                        href={"/dashboard/friends/list?tab=pending"}
                        className="self-end flex flex-row items-center gap-2 mr-6 max-md:mr-3 md:text-lg font-semibold hover:underline"
                    >
                        View all
                        <ArrowRightIcon className="w-5 h-5 max-md:w-4 max-md:h-4" />
                    </Link>
                </section>
                <section className="flex flex-col items-center w-full my-6">
                    <div className="flex flex-row justify-between items-center w-full">
                        <h2 className="text-2xl max-md:text-xl font-semibold">
                            My friends
                        </h2>
                        <Link
                            href={"/dashboard/friends/list?tab=my-friends"}
                            className="flex flex-row items-center gap-2 max-md:gap-1 border-0 rounded-lg w-fit h-10 px-6 max-md:px-3 text-white font-semibold bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
                        >
                            <UserGroupIcon className="w-5 h-5 max-md:w-4 max-md:h-4" />
                            <span className="mr-1 max-md:text-sm">Friend list</span>
                        </Link>
                    </div>
                    <Suspense fallback={<FriendsListContainerSkeleton />}>
                        <ListContainer
                            currUserId={user.id}
                            type="friend"
                            limit={5}
                        />
                    </Suspense>
                </section>
            </div>
        </main>
    )
}