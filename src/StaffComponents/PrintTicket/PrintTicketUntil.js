import axios from 'axios';
import ApiService from '../../Components/Utils/apiService';

// Hàm để tra cứu vé thông qua ID booking
export const lookupTicketById = async () => {
    try {
        // Lấy idBooking từ query string
        const searchParams = new URLSearchParams(window.location.search);
        const idBooking = searchParams.get('ticketCode'); // Lấy giá trị idBooking

        if (!idBooking) {
            throw new Error('Mã booking không tồn tại trong query string');
        }
        // Gửi yêu cầu đến API để tra cứu vé bằng ID booking
        const response = await ApiService.get(`/api/staff-lookup-invoice/${idBooking}`);
        // Trả về dữ liệu vé
        return response; // Trả về dữ liệu vé
    } catch (error) {
        console.error('Error looking up ticket:', error);
        return null; // Trả về null nếu có lỗi xảy ra
    }
};
// Hàm để cập nhật trạng thái vé thông qua ID booking
export const updateTicketStatus = async (newStatus) => {
    try {
        // Lấy idBooking từ query string
        const searchParams = new URLSearchParams(window.location.search);
        const idBooking = searchParams.get('ticketCode'); // Lấy giá trị idBooking

        if (!idBooking) {
            throw new Error('Mã booking không tồn tại trong query string');
        }

        // Gửi yêu cầu đến API để cập nhật trạng thái vé
        const response = await ApiService.put(`/api/update-ticket-status/${idBooking}`, {
            status: newStatus, // Truyền trạng thái mới cần cập nhật
        });
        console.log(typeof response);

        // Trả về kết quả từ API
        return response; // Giả sử API trả về dữ liệu
    } catch (error) {
        console.error('Error updating ticket status:', error);
        return null; // Trả về null nếu có lỗi xảy ra
    }
};
