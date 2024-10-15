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

        // Khởi tạo params với số điện thoại và status
        const params = {
            phoneNumber,
            status: status , // Sử dụng status từ URL, nếu không có thì mặc định là '1'
        };

        // Gửi yêu cầu đến API để tra cứu vé
        const response = await ApiService.get('http://localhost:8080/api/lookup-invoice', { params });
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
  
  