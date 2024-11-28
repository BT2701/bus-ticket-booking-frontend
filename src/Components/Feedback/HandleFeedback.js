import axios from 'axios';
import ApiService from '../Utils/apiService';

export const getAllFeedback = async (scheduleId, page, size, ratingFilter) => {
    try {

        // Thêm điều kiện ratingFilter nếu có lọc số sao
        let url = `/api/feedback/${scheduleId}?page=${page}&size=${size}`;
        if (ratingFilter) {
            url += `&rating=${ratingFilter}`;
        }

        const response = await ApiService.get(url);
        return response; // Trả về dữ liệu từ API
    } catch (error) {
        console.error('Error fetching all feedback:', error);
        return []; // Trả về mảng rỗng trong trường hợp có lỗi
    }
};

// Hàm để lấy tổng số phản hồi và số sao trung bình
export const getAvgAndTotalFeedback = async (scheduleId) => {
    try {
        const response = await ApiService.get(`/api/feedback/average/${scheduleId}`);
        return response; // Trả về dữ liệu từ API
    } catch (error) {
        console.error('Error fetching average rating and total feedback:', error);
        return null; // Trả về null trong trường hợp có lỗi
    }
};

// Hàm để lấy tổng số phản hồi theo scheduleId và rating
export const getTotalFeedbackCount = async (scheduleId, rating) => {
    try {
        const response = await ApiService.get(`/api/feedback/count/${scheduleId}?rating=${rating}`);
        return response; // Trả về số lượng phản hồi từ API
    } catch (error) {
        console.error('Error fetching total feedback count:', error);
        return 0; // Trả về 0 trong trường hợp có lỗi
    }
};
