import dayjs from 'dayjs';


// object từ DatePicker trong antd => "2024-09-30"
export const TransferDatePicker = (value) => {
    return value ? dayjs(value).format('YYYY-MM-DD') : null;
}

// vd "1727715600000" => "2024-09-30"
export const convertTimestampToDate = (timestamp) => {
    const date = new Date(timestamp); // Tạo đối tượng Date từ timestamp
    const year = date.getFullYear(); // Lấy năm
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Lấy tháng (cộng 1 vì tháng tính từ 0)
    const day = ('0' + date.getDate()).slice(-2); // Lấy ngày

    return `${year}-${month}-${day}`; // Trả về định dạng 'YYYY-MM-DD'
};
export const convertTimestampToDateReversed = (timestamp) => {
    const date = new Date(timestamp); // Tạo đối tượng Date từ timestamp
    const year = date.getFullYear(); // Lấy năm
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Lấy tháng (cộng 1 vì tháng tính từ 0)
    const day = ('0' + date.getDate()).slice(-2); // Lấy ngày

    return `${day}-${month}-${year}`; // Trả về định dạng 'YYYY-MM-DD'
};