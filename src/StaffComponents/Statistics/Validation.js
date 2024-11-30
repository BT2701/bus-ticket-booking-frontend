//Kiểm tra xe ngày X1 có lớn hơn ngày X2?
export function isDateGreaterThan(dateToCheck, referenceDate) {
  return new Date(dateToCheck) > new Date(referenceDate);
}

export function isDifferenceMoreThan30Days(date1, date2, Xdate) {
  // Chuyển đổi ngày thành đối tượng Date
  const time1 = new Date(date1).getTime();
  const time2 = new Date(date2).getTime();

  // Tính sự khác biệt theo mili giây
  const differenceInMilliseconds = Math.abs(time1 - time2);

  // Chuyển đổi mili giây thành số ngày
  const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
  // Kiểm tra nếu sự khác biệt lớn hơn X ngày
  return differenceInDays > Xdate;
}

//Kiểm tra chọn ngày xem thống kê hợp lệ
export function validateDateForStatisticst(timeStart, timeEnd) {
  let error;
  if (!timeStart || !timeEnd) {
    error = "*Ngày bắt đầu hoặc ngày kết thúc rỗng";
  } else if (isDateGreaterThan(timeStart, timeEnd)) {
    error = "*Ngày bắt đầu phải nhỏ hơn ngày kết thúc";
  } else if (isDifferenceMoreThan30Days(timeEnd, timeStart, 30)) {
    error = "*Giới hạn trong 30 ngày";
  } else {
    error = "";
  }
  return error;
}
