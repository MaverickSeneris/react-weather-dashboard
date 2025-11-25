// Helper to convert UNIX timestamp to formatted time
const formatTime = (timestamp, use12Hour = true) => {
  // If timestamp is already a Date object, use it directly
  const date = timestamp instanceof Date 
    ? timestamp 
    : new Date(typeof timestamp === 'number' && timestamp < 10000000000 
        ? timestamp * 1000 
        : timestamp);
  
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: use12Hour,
    timeZone: "Asia/Manila",
  });
};

export default formatTime;
