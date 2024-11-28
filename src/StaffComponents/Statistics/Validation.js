//Kiểm tra xe ngày X1 có lớn hơn ngày X2?
export function isDateGreaterThan(dateToCheck, referenceDate) {
  return new Date(dateToCheck) > new Date(referenceDate);
}

//Kiểm tra xem ngày khoản cách từ ngày X1-X2 có lớn hơn X ngày?
export function isDifferenceMoreThan30Days(date1, date2, Xdate) {
  const time1 = new Date(date1).getTime();
  const time2 = new Date(date2).getTime();
  const differenceInMilliseconds = Math.abs(time1 - time2);
  const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
  return differenceInDays > Xdate;
}
