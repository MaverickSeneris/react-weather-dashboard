function MapLoadingSkeleton() {
  return (
    <div>
      <div className="w-35 h-15 rounded-[10px] my-4 animate-pulse" style={{ backgroundColor: 'var(--bg-1)' }}></div>
      <div className="gap-1 flex items-center justify-around animate-pulse">
        <div className="flex justify-center items-center w-18 h-7 rounded-[20px]" style={{ backgroundColor: 'var(--bg-1)' }}></div>
        <div className="flex justify-center items-center w-18 h-7 rounded-[20px]" style={{ backgroundColor: 'var(--bg-1)' }}></div>
        <div className="flex justify-center items-center w-18 h-7 rounded-[20px]" style={{ backgroundColor: 'var(--bg-1)' }}></div>
        <div className="flex justify-center items-center w-18 h-7 rounded-[20px]" style={{ backgroundColor: 'var(--bg-1)' }}></div>
        <div className="flex justify-center items-center w-25 h-7 rounded-[20px]" style={{ backgroundColor: 'var(--bg-1)' }}></div>
      </div>
    </div>
  );
}

export default MapLoadingSkeleton;
