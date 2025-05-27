function LoadingSkeleton() {
  return (
    <div className="flex flex-col items-center w-screen px-4 mt-10 pb-2 animate-pulse">
      <div className="w-40 h-12 bg-slate-100 dark:bg-gray-800 rounded-[15px] mb-4"></div>
      <div className="w-50 h-8 bg-slate-100 dark:bg-gray-800 rounded-[10px] mb-4"></div>
      <div className="w-50 h-50 bg-slate-100 dark:bg-gray-800 rounded-[50%] mb-4"></div>
      <div className="w-29 h-15 bg-slate-100 dark:bg-gray-800 rounded-[15px] my-6"></div>
      <div className="w-full h-35 bg-slate-100 dark:bg-gray-800 rounded-[15px] mb-4 mt-2"></div>
      <div className="w-full h-100 bg-slate-100 dark:bg-gray-800 rounded-[15px] mb-4"></div>
      <div className="w-full h-40 bg-slate-100 dark:bg-gray-800 rounded-[15px]"></div>
    </div>
  );
}
export default LoadingSkeleton;