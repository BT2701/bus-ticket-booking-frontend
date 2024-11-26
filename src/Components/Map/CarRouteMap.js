import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

// Tạo icon tròn màu trắng
const whiteDotIcon = new L.divIcon({
    className: '',
    html: '<div style="width: 12px; height: 12px; background-color: white; border-radius: 50%; border: 2px solid gray;"></div>',
    iconSize: [12, 12],
    iconAnchor: [6, 6],
});

// Tạo icon location màu đỏ bằng cách sử dụng L.divIcon
const redIcon = new L.divIcon({
    className: '',
    html: '<div style="width: 12px; height: 12px; background-color: red; border-radius: 50%; border: 2px solid gray;"></div>',
    iconSize: [12, 12],
    iconAnchor: [6, 6],
});

// Tạo icon trống (không hiển thị gì)
const emptyIcon = new L.divIcon({
    className: '',
    html: '<div style="width: 0; height: 0;"></div>', // Không có nội dung
    iconSize: [0, 0], // Kích thước icon là 0x0
    iconAnchor: [0, 0], // Đặt điểm neo của icon ở vị trí 0,0
});

const AutoZoom = ({ bounds }) => {
    const map = useMap();
    const [hasFitBounds, setHasFitBounds] = useState(false); // Cờ để kiểm soát

    useEffect(() => {
        if (bounds && !hasFitBounds) {
            map.fitBounds(bounds, {}); // Tự động căn chỉnh
            setHasFitBounds(true); // Đánh dấu là đã căn chỉnh
        }
    }, [map, bounds, hasFitBounds]);

    return null;
};

const CarRouteMap = ({ pointA, pointB }) => {
    const [routeCoordsAtoDaNang, setRouteCoordsAtoDaNang] = useState([]);
    const [routeCoordsDaNangToB, setRouteCoordsDaNangToB] = useState([]);
    const [bounds, setBounds] = useState(null);
    const [error, setError] = useState(null);

    // Tọa độ Đà Nẵng
    const daNangCoord = [16.0544, 108.2022];


    // Kiểm tra nếu điểm A và điểm B nằm ở hai bên Đà Nẵng
    const isBetweenDaNang = (pointA, pointB) => {
        const latA = pointA[0];
        const latB = pointB[0];
        // Kiểm tra nếu một điểm nằm ở phía Bắc và một điểm ở phía Nam của Đà Nẵng
        return (latA > daNangCoord[0] && latB < daNangCoord[0]) || (latA < daNangCoord[0] && latB > daNangCoord[0]);
    };

    useEffect(() => {
        const fetchRoute = async () => {
            try {
                if (isBetweenDaNang(pointA, pointB)) {
                    // Lấy tuyến đường từ điểm A đến Đà Nẵng
                    const responseAtoDaNang = await axios.get(
                        `https://router.project-osrm.org/route/v1/driving/${pointA[1]},${pointA[0]};${daNangCoord[1]},${daNangCoord[0]}?overview=full&geometries=geojson`
                    );
                    const coordinatesAtoDaNang = responseAtoDaNang.data.routes[0].geometry.coordinates;
                    const formattedCoordsAtoDaNang = coordinatesAtoDaNang.map(([lng, lat]) => [lat, lng]);
                    setRouteCoordsAtoDaNang(formattedCoordsAtoDaNang);

                    // Lấy tuyến đường từ Đà Nẵng đến điểm B
                    const responseDaNangToB = await axios.get(
                        `https://router.project-osrm.org/route/v1/driving/${daNangCoord[1]},${daNangCoord[0]};${pointB[1]},${pointB[0]}?overview=full&geometries=geojson`
                    );
                    const coordinatesDaNangToB = responseDaNangToB.data.routes[0].geometry.coordinates;
                    const formattedCoordsDaNangToB = coordinatesDaNangToB.map(([lng, lat]) => [lat, lng]);
                    setRouteCoordsDaNangToB(formattedCoordsDaNangToB);

                    // Tạo bounds để zoom vào cả hai đoạn đường
                    const bounds = L.latLngBounds([...formattedCoordsAtoDaNang, ...formattedCoordsDaNangToB]);
                    setBounds(bounds);
                } else {

                    console.log('pointA:', pointA);
                    console.log('pointB:', pointB);
                    // Nếu điểm A và B không nằm ở hai bên Đà Nẵng, lấy tuyến đường trực tiếp từ A đến B
                    const responseAtoB = await axios.get(
                        `https://router.project-osrm.org/route/v1/driving/${pointA[1]},${pointA[0]};${pointB[1]},${pointB[0]}?overview=full&geometries=geojson`
                    );
                    const coordinatesAtoB = responseAtoB.data.routes[0].geometry.coordinates;
                    const formattedCoordsAtoB = coordinatesAtoB.map(([lng, lat]) => [lat, lng]);
                    setRouteCoordsAtoDaNang(formattedCoordsAtoB);  // Dùng lại state này để lưu tuyến đường A -> B

                    // Tạo bounds cho tuyến đường trực tiếp A -> B
                    const bounds = L.latLngBounds(formattedCoordsAtoB);
                    setBounds(bounds);
                    setRouteCoordsDaNangToB([]); // Không cần vẽ tuyến đường từ Đà Nẵng đến B
                }
            } catch (error) {
                console.error('Error fetching route:', error);
                // setError('Có lỗi xảy ra khi tải tuyến đường.');
            }
        };

        fetchRoute();
    }, [pointA, pointB]);


    return (
        <div>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <MapContainer center={pointA} zoom={6} style={{ height: '500px', width: '100%' }}>
                {/* Tự động zoom vào tuyến đường */}
                {bounds && <AutoZoom bounds={bounds} />}

                {/* Lớp gạch bản đồ */}
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* Marker cho điểm A */}
                <Marker position={pointA} icon={whiteDotIcon}>
                    <Popup>Điểm A: {pointA}</Popup>
                </Marker>

                {/* Marker cho điểm B */}
                <Marker position={pointB} icon={redIcon}>
                    <Popup>Điểm B: {pointB}</Popup>
                </Marker>

                {/* Marker cho Đà Nẵng */}
                <Marker position={daNangCoord} icon={emptyIcon}>
                    <Popup>Đà Nẵng</Popup>
                </Marker>

                {/* Vẽ đường tuyến từ A đến Đà Nẵng */}
                {routeCoordsAtoDaNang.length > 0 && <Polyline positions={routeCoordsAtoDaNang} color="blue" />}

                {/* Vẽ đường tuyến từ Đà Nẵng đến B */}
                {routeCoordsDaNangToB.length > 0 && <Polyline positions={routeCoordsDaNangToB} color="blue" />}
            </MapContainer>
        </div>
    );
};

export default CarRouteMap;
