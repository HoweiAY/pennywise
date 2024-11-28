export type FriendshipType = "friend" | "pending" | "blocked";

export type FrinedshipStatus = FriendshipType | "user" | "invited";

export type FriendshipData = {
    inviter_id: string,
    invitee_id: string,
    status: FriendshipType,
    blocked_id: string | null,
}

export type FriendProfileData = {
    username?: string;
    first_name?: string | null;
    last_name?: string | null;
    email?: string;
    avatar_url?: string | null;
}

export type FriendsData = FriendshipData & {
    inviter_data: FriendProfileData | null,
    invitee_data: FriendProfileData | null,
}