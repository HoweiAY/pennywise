export default function FriendInvitationCardSkeleton() {
  return (
    <div className="relative hover:scale-[102%] duration-200">
      <div className="flex flex-row justify-between items-center border border-slate-100 rounded-xl w-full h-24 p-3 bg-white shadow-md text-gray-800">
        <div className="animate-pulse flex shrink-0 items-center gap-2 w-2/3 overflow-hidden">
          <div className="h-10 w-10 min-w-10 rounded-full bg-gray-300" />
          <div className="flex flex-col justify-center gap-1 w-1/2 overflow-hidden">
            <div className="w-full h-6 rounded-md bg-gray-300" />
            <div className="w-full h-3 rounded-md bg-gray-300" />
          </div>
        </div>
        <div className="animate-pulse flex flex-col justify-center items-center gap-2 w-1/3">
          <div className="w-full h-8 rounded-md bg-gray-300" />
          <div className="w-full h-8 rounded-md bg-gray-300" />
        </div>
      </div>
    </div>
  )
}