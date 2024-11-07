import UserProfileCard from "@/components/dashboard/profile/user-profile-card";

export default async function UserProfile() {
    return (
        <main className="h-fit max-md:min-h-screen mb-2 overflow-hidden">
            <div className="px-6">
                <h1 className="mt-8 pb-1 text-3xl max-md:text-2xl font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
                    User profile
                </h1>
                <section className="w-full my-6">
                    <UserProfileCard
                        type="friend"
                    />
                </section>
            </div>
        </main>
    )
}