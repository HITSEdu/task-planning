export const formatDateForInput = (date: Date | undefined): string => {
  if (!date) return "";
  const adjustedDate = new Date(date);
  adjustedDate.setHours(12, 0, 0, 0);

  return adjustedDate.toISOString().split("T")[0];
};
