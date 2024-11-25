import axios from 'axios';

export const getAllFeedback = async (scheduleId, page, size, ratingFilter) => {
    try {

        // Thêm điều kiện ratingFilter nếu có lọc số sao
        let url = `http://localhost:8080/api/feedback/${scheduleId}?page=${page}&size=${size}`;
        if (ratingFilter) {
            url += `&rating=${ratingFilter}`;
        }

        const response = await axios.get(url);
        console.log(response.data);
        return response.data; // Trả về dữ liệu từ API
    } catch (error) {
        console.error('Error fetching all feedback:', error);
        return []; // Trả về mảng rỗng trong trường hợp có lỗi
    }
};

// Hàm để lấy tổng số phản hồi và số sao trung bình
export const getAvgAndTotalFeedback = async (scheduleId) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/feedback/average/${scheduleId}`);
        console.log("Response Data:", JSON.stringify(response.data, null, 2)); // Hiển thị dữ liệu chi tiết
        return response.data; // Trả về dữ liệu từ API
    } catch (error) {
        console.error('Error fetching average rating and total feedback:', error);
        return null; // Trả về null trong trường hợp có lỗi
    }
};

// Hàm để lấy tổng số phản hồi theo scheduleId và rating
export const getTotalFeedbackCount = async (scheduleId, rating) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/feedback/count/${scheduleId}?rating=${rating}`);
        console.log(`Total feedback count for rating ${rating}:`, response.data); // Hiển thị số lượng phản hồi
        return response.data; // Trả về số lượng phản hồi từ API
    } catch (error) {
        console.error('Error fetching total feedback count:', error);
        return 0; // Trả về 0 trong trường hợp có lỗi
    }
};
