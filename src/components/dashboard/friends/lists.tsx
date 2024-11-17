"use client";

import ListItem from "@/components/dashboard/friends/list-item";
import {
    FriendProfileOptions,
    UserProfileOptions,
    PendingProfileOptions,
    InvitedProfileOptions,
    BlockedProfileOptions,
} from "@/components/dashboard/profile/profile-options";
import { UserData } from "@/lib/types/user";
import { FriendsData } from "@/lib/types/friend";

export function UserList({
    currUserId,
    users,
    length,
    infiniteScroll,
}: {
    currUserId: string,
    users: UserData[],
    length?: number,
    infiniteScroll?: boolean,
}) {
    return (
        <ul className="flex flex-col items-center gap-3 w-full pt-4 max-md:pt-3">
            {users.map((userData, idx) => {
                return (
                    <li
                        key={`friend_${idx}`}
                        className="border border-slate-100 rounded-xl w-full h-20 max-md:h-16 bg-white shadow-md text-gray-800 hover:scale-[101%] duration-200"
                    >
                        <ListItem userData={userData} />
                    </li>
                )
            })}
            {users.length === 0 &&
                <div className="flex flex-col justify-center items-center w-full h-48 mb-6 border-0 rounded-xl bg-gray-100">
                    <p className="text-center text-xl max-md:text-lg font-semibold">
                        No users found
                    </p>
                    <p className="px-2 text-center text-sm">
                        Find users by searching with their username
                    </p>
                </div>
            }
        </ul>
    )
}

export function FriendList({
    currUserId,
    friends,
    length,
    infiniteScroll,
}: {
    currUserId: string,
    friends: FriendsData[],
    length?: number,
    infiniteScroll?: boolean,
}) {
    return (
        <ul className="flex flex-col items-center gap-3 w-full pt-4 max-md:pt-3">
            {friends.map((friendData, idx) => {
                const friendId = friendData.inviter_id === currUserId ? friendData.invitee_id : friendData.inviter_id;
                const targetFriend = friendData.inviter_id === currUserId ? friendData.invitee_data : friendData.inviter_data;
                return (
                    <li
                        key={`friend_${idx}`}
                        className="relative border border-slate-100 rounded-xl w-full h-20 max-md:h-16 bg-white shadow-md text-gray-800 hover:scale-[101%] duration-200"
                    >
                        <ListItem userData={targetFriend!} />
                        <div className="absolute right-6 bottom-4 max-md:bottom-3 max-md:right-4">
                            <FriendProfileOptions currUserId={currUserId} targetUserId={friendId} />
                        </div>
                    </li>
                )
            })}
            {friends.length === 0 &&
                <div className="flex flex-col justify-center items-center w-full h-48 mb-6 border-0 rounded-xl bg-gray-100">
                    <p className="text-center text-xl max-md:text-lg font-semibold">
                        No friends found
                    </p>
                    <p className="px-2 text-center text-sm">
                        Invite users to add them to your friend list
                    </p>
                </div>
            }
        </ul>
    )
}

export function PendingList({
    currUserId,
    friends,
    length,
    infiniteScroll,
}: {
    currUserId: string,
    friends: FriendsData[],
    length?: number,
    infiniteScroll?: boolean,
}) {
    return (
        <ul className="flex flex-col items-center gap-3 w-full pt-4 max-md:pt-3">
            {friends.map((friendData, idx) => {
                return (
                    <li
                        key={`friend_${idx}`}
                        className="relative border border-slate-100 rounded-xl w-full h-20 max-md:h-16 bg-white shadow-md text-gray-800 hover:scale-[101%] duration-200"
                    >
                        <ListItem userData={friendData.inviter_data!} />
                        <div className="absolute right-6 bottom-4 max-md:bottom-3 max-md:right-4">
                            <PendingProfileOptions currUserId={currUserId} targetUserId={friendData.inviter_id} />
                        </div>
                    </li>
                )
            })}
            {friends.length === 0 &&
                <div className="flex flex-col justify-center items-center w-full h-48 mb-6 border-0 rounded-xl bg-gray-100">
                    <p className="text-center text-xl max-md:text-lg font-semibold">
                        No pending invitations
                    </p>
                    <p className="px-2 text-center text-sm">
                        Return regularly to check for new friend invites
                    </p>
                </div>
            }
        </ul>
    )
}

export function InvitedList({
    currUserId,
    friends,
    length,
    infiniteScroll,
}: {
    currUserId: string,
    friends: FriendsData[],
    length?: number,
    infiniteScroll?: boolean,
}) {
    return (
        <ul className="flex flex-col items-center gap-3 w-full pt-4 max-md:pt-3">
            {friends.map((friendData, idx) => {
                return (
                    <li
                        key={`friend_${idx}`}
                        className="relative border border-slate-100 rounded-xl w-full h-20 max-md:h-16 bg-white shadow-md text-gray-800 hover:scale-[101%] duration-200"
                    >
                        <ListItem userData={friendData.invitee_data!} />
                        <div className="absolute right-6 bottom-4 max-md:bottom-3 max-md:right-4">
                            <InvitedProfileOptions currUserId={currUserId} targetUserId={friendData.invitee_id} />
                        </div>
                    </li>
                )
            })}
            {friends.length === 0 &&
                <div className="flex flex-col justify-center items-center w-full h-48 mb-6 border-0 rounded-xl bg-gray-100">
                    <p className="text-center text-xl max-md:text-lg font-semibold">
                        No invitations sent
                    </p>
                    <p className="px-2 text-center text-sm">
                        Invite users to add them to your friend list
                    </p>
                </div>
            }
        </ul>
    )
}