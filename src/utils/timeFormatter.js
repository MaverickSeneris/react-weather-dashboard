// Helper to convert UNIX timestamp to "HH:MM AM/PM"
const formatTime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Manila",
  });
};

export default formatTime;
