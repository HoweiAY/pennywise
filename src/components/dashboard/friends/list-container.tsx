import {
    FriendList,
    PendingList,
    InvitedList,
    UserList,
} from "@/components/dashboard/friends/lists";
import { UserData } from "@/lib/types/user";
import { FriendshipType, FriendsData } from "@/lib/types/friend";
import { getAuthUser } from "@/lib/data/auth";
import { getFilteredUsers } from "@/lib/data/user";
import { getUserFriends } from "@/lib/data/friend";

export default async function ListContainer({
    type,
    currUserId,
    title,
    search,
    limit,
    infiniteScroll,
}: {
    type: FriendshipType | "invited" | "all",
    currUserId: string,
    title?: string,
    search?: string,
    limit?: number,
    infiniteScroll?: boolean,
}) {
    const getUsers = type === "all"
        ? getFilteredUsers(search, limit, undefined, true)
        : getUserFriends(currUserId, type, limit);
    const [
        { user },
        { status, message, data },
    ] = await Promise.all([
        getAuthUser(),
        getUsers,
    ]);
    if (status !== "success" || !data) {
        console.error(message || `Error fetching users${type !== "all" && "' friends"}`);
    }
    const users = data && data["usersData"] ? data["usersData"] : [];
    const friends = data && data["userFriendsData"] ? data["userFriendsData"] : [];

    const showList = () => {
        switch (type) {
            case "all":
                return <UserList currUserId={user.id} users={users as UserData[]} length={limit} infiniteScroll={infiniteScroll} />;
            case "friend":
                return <FriendList currUserId={currUserId} friends={friends as FriendsData[]} length={limit} infiniteScroll={infiniteScroll} />;
            case "pending":
                return <PendingList currUserId={currUserId} friends={friends as FriendsData[]} length={limit} infiniteScroll={infiniteScroll} />;
            case "invited":
                return <InvitedList currUserId={currUserId} friends={friends as FriendsData[]} length={limit} infiniteScroll={infiniteScroll} />;
            default:
                return <></>;
        }
    };

    return (
        <div className="w-full mt-4">
            {title && 
                <h2 className="pt-4 max-md:pt-3 text-2xl max-md:text-xl font-semibold">
                    {title}
                </h2>
            }
            {showList()}
        </div>
    )
}