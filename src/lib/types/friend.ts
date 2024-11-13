export type FrinedshipTypes = "friend" | "user" | "pending" | "invited" | "blocked";

export type FriendshipData = {
    inviter_id: string,
    invitee_id: string,
    status: string,
    blocked_id: string | null,
}