import axios from 'axios';
import ApiService from '../Utils/apiService';

// Hàm gọi API để lấy danh sách booking đã hoàn thành
const fetchPastBookings = async (customerId,pageNum, limit) => {
  try {
    // Thực hiện GET request đến API lấy booking dựa trên customerId
    const response = await ApiService.get(`http://localhost:8080/api/lookup-past-bookings?customerId=${customerId}&pageNum=${pageNum}&limit=${limit}`);
    // Kiểm tra nếu phản hồi từ server là thành công
    if (response ) {
      // Trả về dữ liệu booking nếu có
      return response;
    } else {
      // Nếu không có dữ liệu, có thể trả về một thông báo hoặc giá trị mặc định
      console.warn("Không có booking nào được tìm thấy cho customerId:", customerId);
      return [];
    }

  } catch (error) {
    // Xử lý lỗi khi gọi API
    console.error("Có lỗi xảy ra khi lấy danh sách booking:", error);
    return [];
  }
};


const addFeedback = async (content, rating, bookingId) => {
    const currentDate = new Date().toISOString(); // Lấy thời gian hiện tại
    const feedbackData = {
        content: content,
        rating: rating,
        booking: { id: bookingId }, // bookingId là ID của booking
        date: currentDate, // Thêm trường date
    };

    try {
        const response = await ApiService.post('http://localhost:8080/api/addfeedback', feedbackData);
        return response; // Trả về dữ liệu phản hồi nếu cần
    } catch (error) {
        console.error('Có lỗi xảy ra khi gửi đánh giá:', error);
        throw error; // Ném lỗi để xử lý bên ngoài nếu cần
    }
};

  

// Xuất addFeedback như một xuất named
export { addFeedback,fetchPastBookings };  
  // Xuất hàm fetchPastBookings và addFeedback để có thể sử dụng ở các component khác
