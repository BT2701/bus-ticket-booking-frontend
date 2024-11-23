import ApiService from '../../Components/Utils/apiService';

// Hàm gọi API để lấy danh sách yêu cầu liên hệ
const fetchContactRequests = async (pageNum, limit) => {
    try {
        // Thực hiện GET request đến API lấy danh sách yêu cầu
        const response = await ApiService.get(`http://localhost:8080/api/contacts?pageNum=${pageNum}&limit=${limit}`);
        // Kiểm tra nếu phản hồi từ server là thành công
        if (response) {
            return response; // Trả về dữ liệu yêu cầu liên hệ
        } else {
            console.warn("Không có yêu cầu liên hệ nào được tìm thấy.");
            return [];
        }
    } catch (error) {
        // Xử lý lỗi khi gọi API
        console.error("Có lỗi xảy ra khi lấy danh sách yêu cầu liên hệ:", error);
        return [];
    }
};
// Hàm gọi API để gửi mail và cập nhật trạng thái yêu cầu liên hệ
const sendMailAndUpdateStatus = async (requestId, resolveTitle, resolveContent, email) => {
    const requestBody = {
        requestId: requestId,     // ID yêu cầu liên hệ
        resolveTitle: resolveTitle,  // Tiêu đề giải quyết
        resolveContent: resolveContent,  // Nội dung giải quyết
        email: email  // Email của người dùng cần gửi
    };

    try {
        // Gửi yêu cầu POST đến API backend
        const response = await ApiService.post('http://localhost:8080/api/send-mail-and-update-status', requestBody);

        return response; // Trả về phản hồi từ backend nếu thành công
    } catch (error) {
        console.error('Có lỗi xảy ra khi gửi mail và cập nhật trạng thái:', error);
        throw error; // Ném lỗi để xử lý bên ngoài nếu cần
    }
};


// Xuất các hàm để sử dụng ở các component khác
export { fetchContactRequests, sendMailAndUpdateStatus };
