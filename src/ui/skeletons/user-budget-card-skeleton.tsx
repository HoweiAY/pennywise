export default function UserBudgetCardSkeleton() {
    return (
        <div className="flex flex-col border border-slate-100 rounded-xl w-full h-44 p-6 bg-white shadow-md">
            <div className="animate-pulse w-3/4 h-10 rounded-md bg-gray-300" />
            <div className="animate-pulse w-1/2 h-8 mt-6 rounded-md bg-gray-300" />
            <div className="animate-pulse w-2/3 h-6 mt-1 rounded-md bg-gray-300" />
        </div>
    )
}