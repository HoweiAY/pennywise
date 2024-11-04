import FriendsList from "@/components/dashboard/friends/friends-list";

export default async function ListContainer({
    infiniteScroll,
}: {
    infiniteScroll?: boolean,
}) {
    return (
        <div className="w-full mt-4">
            <FriendsList
                length={6}
                infiniteScroll={infiniteScroll}
            />
        </div>
    )
}