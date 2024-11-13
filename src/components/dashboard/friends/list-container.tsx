import {
    FriendList,
    UserList,
} from "@/components/dashboard/friends/lists";
import { getFilteredUsers } from "@/lib/data/user";

export default async function ListContainer({
    type,
    title,
    search,
    limit,
    infiniteScroll,
}: {
    type: "pending" | "invited" | "my-friends" | "all",
    title?: string,
    search?: string,
    limit?: number,
    infiniteScroll?: boolean,
}) {
    const { status, message, data } = await getFilteredUsers(search, limit, undefined, true);
    if (status !== "success" || !data) {
        console.error(message || "Error fetching users");
    }
    const users = data && data["usersData"] ? data["usersData"] : [];

    return (
        <div className="w-full mt-4">
            {title && 
                <h2 className="pt-4 max-md:pt-3 text-2xl max-md:text-xl font-semibold">
                    {title}
                </h2>
            }
            <UserList
                users={users}
                length={limit}
                infiniteScroll={infiniteScroll}
            />
        </div>
    )
}