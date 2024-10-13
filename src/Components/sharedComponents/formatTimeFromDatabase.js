import { format } from 'date-fns';

function formatTimeFromDatabase(dateString) {
    // Kiểm tra xem dateString có phải là null hoặc không
    if (dateString === null || dateString === undefined) {
        return 'N/A'; // Trả về giá trị mặc định
    }

    const dbDate = new Date(dateString);

    // Kiểm tra xem dbDate có phải là ngày hợp lệ không
    if (isNaN(dbDate)) {
        return 'Invalid Date'; // Trả về thông báo lỗi
    }

    return format(dbDate, 'dd/MM/yyyy HH:mm:ss');
}

export default formatTimeFromDatabase;
