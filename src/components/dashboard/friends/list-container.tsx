import FriendList from "@/components/dashboard/friends/friend-list";

export default async function ListContainer({
    type,
    title,
    limit,
    infiniteScroll,
}: {
    type: "pending" | "invited" | "my-friends" | "all",
    title?: string,
    limit?: number,
    infiniteScroll?: boolean,
}) {
    return (
        <div className="w-full mt-4">
            {title && 
                <h2 className="pt-4 max-md:pt-3 text-2xl max-md:text-xl font-semibold">
                    {title}
                </h2>
            }
            <FriendList
                length={limit}
                infiniteScroll={infiniteScroll}
            />
        </div>
    )
}