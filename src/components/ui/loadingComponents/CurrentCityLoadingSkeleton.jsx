function LoadingSkeleton() {
  return (
    <div className="flex flex-col items-center w-screen px-4 mt-10 pb-2 animate-pulse">
      <div className="w-40 h-12 rounded-[15px] mb-4 animate-pulse" style={{ backgroundColor: 'var(--bg-1)' }}></div>
      <div className="w-50 h-8 rounded-[10px] mb-4 animate-pulse" style={{ backgroundColor: 'var(--bg-1)' }}></div>
      <div className="w-50 h-50 rounded-[50%] mb-4 animate-pulse" style={{ backgroundColor: 'var(--bg-1)' }}></div>
      <div className="w-29 h-15 rounded-[15px] my-6 animate-pulse" style={{ backgroundColor: 'var(--bg-1)' }}></div>
      <div className="w-full h-35 rounded-[15px] mb-4 mt-2 animate-pulse" style={{ backgroundColor: 'var(--bg-1)' }}></div>
      <div className="w-full h-100 rounded-[15px] mb-4 animate-pulse" style={{ backgroundColor: 'var(--bg-1)' }}></div>
      <div className="w-full h-40 rounded-[15px] animate-pulse" style={{ backgroundColor: 'var(--bg-1)' }}></div>
    </div>
  );
}
export default LoadingSkeleton;