export default function FriendsListContainerSkeleton({
  title,
  length,
  infiniteScroll,
}: {
  title?: string,
  length?: number,
  infiniteScroll?: boolean,
}) {
  return (
    <div className="w-full mt-4">
      {title && 
        <h2 className="pt-4 max-md:pt-3 text-2xl max-md:text-xl font-semibold">
          {title}
        </h2>
      }
      <ul className="flex flex-col items-center gap-3 w-full pt-4 max-md:pt-3">
        {Array.from({ length: length ?? 5 }).map((_, idx) => {
          return (
            <li
              key={`friend_${idx}_skeleton`}
              className="border border-slate-100 rounded-xl w-full h-20 max-md:h-16 p-3 bg-white shadow-md text-gray-800 hover:cursor-pointer hover:scale-[101%] duration-200"
            >
              <div className="animate-pulse flex shrink-0 items-center gap-2 w-2/3 max-lg:w-1/2 overflow-hidden">
                <div className="h-10 w-10 min-w-10 max-md:w-8 max-md:h-8 max-md:min-w-8 rounded-full bg-gray-300" />
                <div className="flex flex-col justify-center gap-2 w-1/2 max-lg:w-11/12 h-16 max-md:h-12">
                  <div className="w-full h-6 max-md:h-4 rounded bg-gray-300" />
                  <div className="w-2/3 h-3 max-md:h-2 rounded bg-gray-300" />
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}