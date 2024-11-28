export default function ProfileActivitiesListSkeleton() {
  return (
    <ul className="flex flex-col items-center gap-3 w-full py-4 max-md:py-3">
      {Array.from({ length: 3 }).map((_, idx) => {
        return (
          <li
            key={idx}
            className="border border-slate-100 rounded-xl w-full h-20 max-md:h-16 bg-white shadow-md hover:scale-[101%] duration-200"
          >
            <div className="flex justify-between items-center w-full h-full px-6 py-3">
              <div className="animate-pulse w-3/4 max-md:w-2/3 h-10 max-md:h-8 rounded-md bg-gray-300" />
              <div className="animate-pulse w-1/6 max-md:w-1/4 h-10 max-md:h-8 rounded-md bg-gray-300" />
            </div>
          </li>
        )
      })}
    </ul>
  )
}