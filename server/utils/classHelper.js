// Helper: convert "10:00 AM - 11:00 AM" → Date
export const getClassStartDateTime = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return null;

  const startTime = timeStr.split(" - ")[0]; // "10:00 AM"

  const [time, modifier] = startTime.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  const date = new Date(dateStr);
  date.setHours(hours, minutes, 0, 0);

  return date;
};
