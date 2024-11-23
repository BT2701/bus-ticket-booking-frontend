import axios from 'axios';
import ApiService from '../Utils/apiService';

export const handlePhoneNumberChange = (setPhoneNumber) => (e) => {
    setPhoneNumber(e.target.value);
};

export const handleCaptchaChange = (setCaptchaValue) => (value) => {
    setCaptchaValue(value);
};
// Hàm để tra cứu vé thông qua số điện thoại
export const lookupTicket = async (phoneNumber) => {
    try {
        const status = new URLSearchParams(window.location.search).get('status'); // Lấy status từ URL
        const pageNum = new URLSearchParams(window.location.search).get('pageNum'); // Lấy status từ URL
        const limit = new URLSearchParams(window.location.search).get('limit'); // Lấy status từ URL


        // Khởi tạo params với số điện thoại và status
        const params = {
            phoneNumber,
            status: status, // Sử dụng status từ URL, nếu không có thì mặc định là '1'
            pageNum: pageNum,
            limit: limit,
        };

        // Gửi yêu cầu đến API để tra cứu vé
        const response = await ApiService.get('/api/lookup-invoice', { params });
        console.log('Response:', response);

        // Kiểm tra phản hồi
        // if (response.status !== 200) {
        //     throw new Error('Failed to fetch ticket information');
        // }

        // Trả về dữ liệu vé
        return response;
    } catch (error) {
        console.error('Error looking up ticket:', error);
        return null; // Trả về null nếu có lỗi xảy ra
    }
};
export const cancelTicket = async (ticketId) => {
    try {
        alert(`Hủy vé với mã vé: ${ticketId}`);
        // Gửi yêu cầu hủy vé đến API
        const response = await ApiService.post(`/api/cancel-ticket/${ticketId}`);

        // Kiểm tra mã trạng thái của phản hồi
        if (response === true) {
            return response; // Trả về dữ liệu từ backend nếu thành công
        } else {
            return false; // Trả về null nếu không thành công
        }
    } catch (error) {
        console.error('Error cancelling ticket:', error);
        alert('Có lỗi xảy ra: ' + error.message);
        return null; // Trả về null nếu có lỗi xảy ra
    }
};



