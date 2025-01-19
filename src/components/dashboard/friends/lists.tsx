"use client";

import ListItem from "@/components/dashboard/friends/list-item";
import {
    FriendProfileOptions,
    UserProfileOptions,
    PendingProfileOptions,
    InvitedProfileOptions,
    BlockedProfileOptions,
} from "@/components/dashboard/profile/profile-options";
import { baseUrl } from "@/lib/utils/constant";
import { UserData } from "@/lib/types/user";
import { FriendsData } from "@/lib/types/friend";
import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

function filterFriendsData(friends: FriendsData[], search?: string) {
    if (!search) {
        return friends;
    }
    const filteredFriends = friends.filter(friendData => {
        const { inviter_data: inviterData, invitee_data: inviteeData } = friendData;
        return (
            inviterData?.username?.toLowerCase().includes(search.toLowerCase()) ||
            inviteeData?.username?.toLowerCase().includes(search.toLowerCase())
        );
    });
    return filteredFriends;
}

export function UserList({
    currUserId,
    users,
    search,
    length,
    infiniteScroll,
}: {
    currUserId: string,
    users: UserData[],
    search?: string,
    length?: number,
    infiniteScroll?: boolean,
}) {
    const [userListData, setUserListData] = useState<UserData[]>(users);

    const { ref, inView } = useInView({ threshold: 0.8 });

    const {
        data: newUsers,
        isFetching: fetchingUsers,
        hasNextPage: hasMoreUsers,
        fetchNextPage: fetchMoreUsers,
    } = useInfiniteQuery({
        queryKey: ["users", users, length, infiniteScroll],
        queryFn: async ({ pageParam: offset }) => {
            const res = await fetch(
                `${baseUrl}/api/users?search=${search}&limit=${length}&offset=${offset}&excludeCurrentUser=true`,
                { cache: "no-store" },
            );
            if (res.status !== 200) {
                console.error(res.statusText);
                return [];
            }
            const { data: usersData } = await res.json() as { data: UserData[] };
            return usersData;
        },
        initialPageParam: users.length,
        getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
            return lastPage.length > 0 ? lastPageParam + lastPage.length : null;
        },
        refetchOnWindowFocus: false,
        enabled: infiniteScroll ?? false,
    });

    useEffect(() => {
        if (inView && hasMoreUsers) {
            fetchMoreUsers();
        }
    }, [inView, hasMoreUsers]);

    useEffect(() => {
        const newUserData = newUsers?.pages.flat() ?? [];
        setUserListData([...users, ...newUserData]);
    }, [users, newUsers]);

    return (
        <ul
            ref={ref}
            className="flex flex-col items-center gap-3 w-full pt-4 max-md:pt-3"
        >
            {userListData.map((userData, idx) => {
                return (
                    <li
                        key={`friend_${idx}`}
                        className="border border-slate-100 rounded-xl w-full h-20 max-md:h-16 bg-white shadow-md text-gray-800 hover:scale-[101%] duration-200"
                    >
                        <ListItem userData={userData} />
                    </li>
                )
            })}
            {!fetchingUsers && userListData.length === 0 &&
                <div className="flex flex-col justify-center items-center w-full h-48 mb-6 border-0 rounded-xl bg-gray-100">
                    <p className="text-center text-xl max-md:text-lg font-semibold">
                        No users found
                    </p>
                    <p className="px-2 text-center text-sm">
                        Find users by searching with their username
                    </p>
                </div>
            }
            {fetchingUsers && <InfiniteScrollLoadingSkeleton />}
        </ul>
    )
}

export function FriendList({
    currUserId,
    friends,
    search,
    length,
    size,
    infiniteScroll,
}: {
    currUserId: string,
    friends: FriendsData[],
    search?: string,
    length?: number,
    size?: "small" | "normal",
    infiniteScroll?: boolean,
}) {
    const [ filteredFriends, setFilteredFriends ] = useState<FriendsData[]>(friends);

    const { ref, inView } = useInView({ threshold: 0.8 });

    const {
        data: newFriends,
        isFetching: fetchingFriends,
        hasNextPage: hasMoreFriends,
        fetchNextPage: fetchMoreFriends,
    } = useInfiniteQuery({
        queryKey: ["friends", friends, length, infiniteScroll],
        queryFn: async ({ pageParam: offset }) => {
            const res = await fetch(
                `${baseUrl}/api/users/${currUserId}/friends?status=friend&offset=${offset}`,
                { cache: "no-store" },
            );
            if (res.status !== 200) {
                console.error(res.statusText);
                return [];
            }
            const { data: friendsData } = await res.json() as { data: FriendsData[] };
            return friendsData;
        },
        initialPageParam: friends.length,
        getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
            return lastPage.length > 0 ? lastPageParam + lastPage.length : null;
        },
        refetchOnWindowFocus: false,
        enabled: infiniteScroll ?? false,
    });

    useEffect(() => {
        if (inView && hasMoreFriends) {
            fetchMoreFriends();
        }
    }, [inView, hasMoreFriends]);

    useEffect(() => {
        const newFriendData = newFriends?.pages.flat() ?? [];
        setFilteredFriends(
            filterFriendsData(
                [...friends, ...newFriendData],
                search,
            )
        );
    }, [friends, newFriends, search]);

    return (
        <ul
            ref={ref}
            className="flex flex-col items-center gap-3 w-full pt-4 max-md:pt-3"
        >
            {filteredFriends.map((friendData, idx) => {
                const friendId = friendData.inviter_id === currUserId ? friendData.invitee_id : friendData.inviter_id;
                const targetFriend = friendData.inviter_id === currUserId ? friendData.invitee_data : friendData.inviter_data;
                return (
                    <li
                        key={`friend_${idx}`}
                        className="relative border border-slate-100 rounded-xl w-full h-20 max-md:h-16 bg-white shadow-md text-gray-800 hover:scale-[101%] duration-200"
                    >
                        <ListItem userData={targetFriend!} />
                        <div className="absolute right-6 bottom-4 max-md:bottom-3 max-md:right-4">
                            <FriendProfileOptions
                                currUserId={currUserId}
                                targetUserId={friendId}
                                targetUsername={targetFriend?.username || "--"}
                                size={size ?? "normal"}
                            />
                        </div>
                    </li>
                )
            })}
            {!fetchingFriends && filteredFriends.length === 0 &&
                <div className="flex flex-col justify-center items-center w-full h-48 mb-6 border-0 rounded-xl bg-gray-100">
                    <p className="text-center text-xl max-md:text-lg font-semibold">
                        No friends found
                    </p>
                    <p className="px-2 text-center text-sm">
                        Invite users to add them to your friend list
                    </p>
                </div>
            }
            {fetchingFriends && <InfiniteScrollLoadingSkeleton />}
        </ul>
    )
}

export function PendingList({
    currUserId,
    friends,
    search,
    length,
    size,
    infiniteScroll,
}: {
    currUserId: string,
    friends: FriendsData[],
    search?: string,
    length?: number,
    size?: "small" | "normal",
    infiniteScroll?: boolean,
}) {
    const [ filteredFriends, setFilteredFriends ] = useState<FriendsData[]>(friends);

    const { ref, inView } = useInView({ threshold: 0.8 });

    const {
        data: newFriends,
        isFetching: fetchingFriends,
        hasNextPage: hasMoreFriends,
        fetchNextPage: fetchMoreFriends,
    } = useInfiniteQuery({
        queryKey: ["friends", friends, length, infiniteScroll],
        queryFn: async ({ pageParam: offset }) => {
            const res = await fetch(
                `${baseUrl}/api/users/${currUserId}/friends?status=pending&offset=${offset}`,
                { cache: "no-store" },
            );
            if (res.status !== 200) {
                console.error(res.statusText);
                return [];
            }
            const { data: friendsData } = await res.json() as { data: FriendsData[] };
            return friendsData;
        },
        initialPageParam: friends.length,
        getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
            return lastPage.length > 0 ? lastPageParam + lastPage.length : null;
        },
        refetchOnWindowFocus: false,
        enabled: infiniteScroll ?? false,
    });

    useEffect(() => {
        if (inView && hasMoreFriends) {
            fetchMoreFriends();
        }
    }, [inView, hasMoreFriends]);

    useEffect(() => {
        const newFriendData = newFriends?.pages.flat() ?? [];
        setFilteredFriends(
            filterFriendsData(
                [...friends, ...newFriendData],
                search,
            )
        );
    }, [friends, newFriends, search]);

    return (
        <ul 
            ref={ref}
            className="flex flex-col items-center gap-3 w-full pt-4 max-md:pt-3"
        >
            {filteredFriends.map((friendData, idx) => {
                return (
                    <li
                        key={`friend_${idx}`}
                        className="relative border border-slate-100 rounded-xl w-full h-20 max-md:h-16 bg-white shadow-md text-gray-800 hover:scale-[101%] duration-200"
                    >
                        <ListItem userData={friendData.inviter_data!} />
                        <div className="absolute right-6 bottom-4 max-md:bottom-3 max-md:right-4">
                            <PendingProfileOptions
                                currUserId={currUserId}
                                targetUserId={friendData.inviter_id}
                                targetUsername={friendData.inviter_data!.username!}
                                size={size ?? "normal"}
                            />
                        </div>
                    </li>
                )
            })}
            {!fetchingFriends && filteredFriends.length === 0 &&
                <div className="flex flex-col justify-center items-center w-full h-48 mb-6 border-0 rounded-xl bg-gray-100">
                    <p className="text-center text-xl max-md:text-lg font-semibold">
                        No pending invitations
                    </p>
                    <p className="px-2 text-center text-sm">
                        Return regularly to check for new friend invites
                    </p>
                </div>
            }
            {fetchingFriends && <InfiniteScrollLoadingSkeleton />}
        </ul>
    )
}

export function InvitedList({
    currUserId,
    friends,
    search,
    length,
    size,
    infiniteScroll,
}: {
    currUserId: string,
    friends: FriendsData[],
    search?: string,
    length?: number,
    size?: "small" | "normal",
    infiniteScroll?: boolean,
}) {
    const [ filteredFriends, setFilteredFriends ] = useState<FriendsData[]>(friends);

    const { ref, inView } = useInView({ threshold: 0.8 });

    const {
        data: newFriends,
        isFetching: fetchingFriends,
        hasNextPage: hasMoreFriends,
        fetchNextPage: fetchMoreFriends,
    } = useInfiniteQuery({
        queryKey: ["friends", friends, length, infiniteScroll],
        queryFn: async ({ pageParam: offset }) => {
            const res = await fetch(
                `${baseUrl}/api/users/${currUserId}/friends?status=invited&offset=${offset}`,
                { cache: "no-store" },
            );
            if (res.status !== 200) {
                console.error(res.statusText);
                return [];
            }
            const { data: friendsData } = await res.json() as { data: FriendsData[] };
            return friendsData;
        },
        initialPageParam: friends.length,
        getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
            return lastPage.length > 0 ? lastPageParam + lastPage.length : null;
        },
        refetchOnWindowFocus: false,
        enabled: infiniteScroll ?? false,
    });

    useEffect(() => {
        if (inView && hasMoreFriends) {
            fetchMoreFriends();
        }
    }, [inView, hasMoreFriends]);

    useEffect(() => {
        const newFriendData = newFriends?.pages.flat() ?? [];
        setFilteredFriends(
            filterFriendsData(
                [...friends, ...newFriendData],
                search,
            )
        );
    }, [friends, newFriends, search]);

    return (
        <ul
            ref={ref}
            className="flex flex-col items-center gap-3 w-full pt-4 max-md:pt-3"
        >
            {filteredFriends.map((friendData, idx) => {
                return (
                    <li
                        key={`friend_${idx}`}
                        className="relative border border-slate-100 rounded-xl w-full h-20 max-md:h-16 bg-white shadow-md text-gray-800 hover:scale-[101%] duration-200"
                    >
                        <ListItem userData={friendData.invitee_data!} />
                        <div className="absolute right-6 bottom-4 max-md:bottom-3 max-md:right-4">
                            <InvitedProfileOptions
                                currUserId={currUserId}
                                targetUserId={friendData.invitee_id}
                                targetUsername={friendData.invitee_data!.username!}
                                size={size ?? "normal"}
                            />
                        </div>
                    </li>
                )
            })}
            {!fetchingFriends && filteredFriends.length === 0 &&
                <div className="flex flex-col justify-center items-center w-full h-48 mb-6 border-0 rounded-xl bg-gray-100">
                    <p className="text-center text-xl max-md:text-lg font-semibold">
                        No invitations sent
                    </p>
                    <p className="px-2 text-center text-sm">
                        Invite users to add them to your friend list
                    </p>
                </div>
            }
            {fetchingFriends && <InfiniteScrollLoadingSkeleton />}
        </ul>
    )
}

function InfiniteScrollLoadingSkeleton() {
    return (
        <>
            {Array.from({ length: 3 }).map((_, idx) => {
                return (
                    <li
                        key={`friend_${idx}_skeleton`}
                        className="border border-slate-100 rounded-xl w-full h-20 max-md:h-16 p-3 bg-white shadow-md text-gray-800 hover:cursor-pointer hover:scale-[101%] duration-200"
                    >
                        <div className="animate-pulse flex shrink-0 items-center gap-2 w-2/3 max-lg:w-1/2 overflow-hidden">
                            <div className="h-10 w-10 min-w-10 max-md:w-8 max-md:h-8 max-md:min-w-8 rounded-full bg-gray-300" />
                            <div className="flex flex-col justify-center gap-2 w-1/2 max-lg:w-11/12 h-16 max-md:h-12">
                                <div className="w-full h-6 max-md:h-4 rounded bg-gray-300" />
                                <div className="w-2/3 h-3 max-md:h-2 rounded bg-gray-300" />
                            </div>
                        </div>
                    </li>
                )
            })}
        </>
    )
}