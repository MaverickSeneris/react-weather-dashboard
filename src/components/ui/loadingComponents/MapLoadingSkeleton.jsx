function MapLoadingSkeleton() {
  return (
    <div>
      <div className="w-35 h-15 rounded-[10px] my-4  bg-slate-100 dark:bg-gray-800 animate-pulse"></div>
      <div className=" gap-1 bg-opacity-60 flex items-center justify-around animate-pulse">
        <div className=" flex justify-center items-center w-18 h-7 rounded-[20px]  bg-slate-100 dark:bg-gray-800"></div>
        <div className=" flex justify-center items-center w-18 h-7 rounded-[20px]  bg-slate-100 dark:bg-gray-800"></div>
        <div className=" flex justify-center items-center w-18 h-7 rounded-[20px]  bg-slate-100 dark:bg-gray-800"></div>
        <div className=" flex justify-center items-center w-18 h-7 rounded-[20px]  bg-slate-100 dark:bg-gray-800"></div>
        <div className=" flex justify-center items-center w-25 h-7 rounded-[20px]  bg-slate-100 dark:bg-gray-800"></div>
      </div>
    </div>
  );
}

export default MapLoadingSkeleton;
