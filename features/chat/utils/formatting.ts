export const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};
