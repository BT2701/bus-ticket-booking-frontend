// geolocation.js

import axios from 'axios';

// Hàm lấy tọa độ từ địa chỉ
export const getCoordinatesFromAddress = async (address) => {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&addressdetails=1`;

    try {
        const response = await axios.get(url);
        if (response.data && response.data.length > 0) {
            const location = response.data[0];
            return { lat: location.lat, lon: location.lon };
        } else {
            console.log('Không tìm thấy địa điểm');
            return null;
        }
    } catch (error) {
        console.error('Lỗi khi lấy tọa độ:', error);
        return null;
    }
};
