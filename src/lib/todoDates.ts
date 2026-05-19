export function isEndDateAfterStartDate(startDate: string, endDate: string) {
  if (!startDate || !endDate) {
    return false;
  }

  return endDate > startDate;
}

export function getDateAfter(date: string) {
  if (!date) {
    return undefined;
  }

  const nextDate = new Date(`${date}T00:00:00`);
  nextDate.setDate(nextDate.getDate() + 1);

  return nextDate.toISOString().slice(0, 10);
}
