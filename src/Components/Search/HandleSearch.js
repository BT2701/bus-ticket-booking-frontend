import axios from 'axios'; 
import ApiService from '../Utils/apiService';


// Tách riêng hàm lấy dữ liệu từ API
// export const fetchUniqueRoutes = async () => {
//     try {
//       const response = await fetch('http://localhost:8080/api/get-from-to'); // URL API của bạn
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       const data = await response.json(); // Giả sử API trả về JSON
//       return data; 
//     } catch (error) {
//       console.error('Error fetching unique routes:', error);
//       return []; // Trả về mảng rỗng trong trường hợp có lỗi
//     }
//   };
    export const fetchUniqueRoutes = async () => {
        try {
        const response = await ApiService.get('/api/get-from-to'); // Sử dụng `await` để chờ kết quả từ API
        console.log(response);
        return response; // Dữ liệu từ API được trả về từ `response.data`
        } catch (error) {
        console.error('Error fetching unique routes:', error);
        return []; // Trả về mảng rỗng trong trường hợp có lỗi
        }
    };

    // Hàm lấy tất cả các tuyến đường
    export const getAllRoutes = async () => {
        try {
            const response = await ApiService.get('http://localhost:8080/api/get-all-routes'); // Thay thế bằng URL API tương ứng
            console.log(response)
            return response; // Trả về dữ liệu từ API
        } catch (error) {
            console.error('Error fetching all routes:', error);
            return []; // Trả về mảng rỗng trong trường hợp có lỗi
        }
    };
  
  export const search = async (pickup, dropoff, departureDate, filters = {}) => {
    const {  lowestPrice, highestPrice, busTypes, sort } = filters;
     // Kiểm tra nếu các tham số bắt buộc không tồn tại
     if (!pickup || !dropoff || !departureDate) {
        console.error("Pickup, dropoff, and departureDate must be provided.");
        return []; // Hoặc có thể trả về một giá trị phù hợp khác
     }

    try {
        // Khởi tạo params với các tham số bắt buộc
        const params = {
            pickup,
            dropoff,
            departureDate,
        };

        // Chỉ thêm các tham số không undefined và không NaN
        if (lowestPrice !== undefined) {
            params.lowestPrice = lowestPrice;
        }
        if (highestPrice !== undefined) {
            params.highestPrice = highestPrice;
        }
        if (Array.isArray(busTypes) && busTypes.length > 0) {
            params.busTypes = busTypes.join(',');
        }
        if (sort !== undefined) {
            params.sort = sort;
        }

        console.log("Data sent:", params);


        const response = await ApiService.get('/api/search', { params });
        console.log(response);


        // if (response.status !== 200) {
        //     throw new Error('Failed to fetch search results');
        // }
        return response;
    } catch (error) {
        console.error('Error searching for routes:', error);
        return [];
    }
};



  
