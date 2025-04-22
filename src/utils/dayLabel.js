function getDayLabel(timestamp, index) {
  if (index === 0) return "Today";
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    weekday: "short",
    timeZone: "Asia/Manila",
  });
}

export default getDayLabel;
