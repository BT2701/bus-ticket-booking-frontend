import axios from 'axios';
import React, { useEffect, useState } from 'react';
import NewsItem from './NewsItem';
const News = require("./NewsItem");

const NewsPage = () => {
    const [news, setNews] = useState([]);
    const [error, setError] = useState(null); // New state for error handling

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get("https://api.currentsapi.services/v1/latest-news", {
                    params: {
                        country: 'vn',
                        language: 'vi',
                        apiKey: 'GZ-ObsgVoL1aOOUGEru6VzUZeDlNQJVL6e6PT-PyaMYmV7en',
                        // limit: 5, // Set the limit here (e.g., 5 articles)
                    }
                });
                setNews(response.data.news.slice(0, 10));
            } catch (err) {
                setError('Failed to fetch news');
            }
        };
        fetchNews();
    }, []);

    return (
        <div className="container">
            <div className="weather">
                <div className=" mt-4">
                    <h2 className="text-center">Thời Tiết Hôm Nay TP.HCM</h2>
                </div>

                <div className=" mt-4">
                    <div className="row">

                        <div className="col-lg-4">
                            <div className="card text-center shadow-sm">
                                <div className="card-header">
                                    Thời tiết hiện tại
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">Hà Nội</h5>
                                    <p className="card-text">Nhiệt độ: 28°C</p>
                                    <p className="card-text">Trời nắng</p>
                                    <p className="card-text">Độ ẩm: 65%</p>
                                    <p className="card-text">Gió: 10 km/h</p>
                                </div>
                                <div className="card-footer text-muted">
                                    Cập nhật lúc: 10:00 AM
                                </div>
                            </div>
                        </div>


                        <div className="col-lg-4">
                            <div className="card text-center shadow-sm">
                                <div className="card-header">
                                    Dự báo ngày mai
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">Hà Nội</h5>
                                    <p className="card-text">Nhiệt độ: 30°C</p>
                                    <p className="card-text">Trời mưa</p>
                                    <p className="card-text">Độ ẩm: 75%</p>
                                    <p className="card-text">Gió: 12 km/h</p>
                                </div>
                                <div className="card-footer text-muted">
                                    Dự báo cho ngày mai
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="card text-center shadow-sm">
                                <div className="card-header">
                                    Dự báo tuần này
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">Hà Nội</h5>
                                    <ul className="list-unstyled">
                                        <li>Thứ 2: 28°C, Trời nắng</li>
                                        <li>Thứ 3: 29°C, Trời nhiều mây</li>
                                        <li>Thứ 4: 27°C, Trời mưa</li>
                                        <li>Thứ 5: 26°C, Trời quang đãng</li>
                                        <li>Thứ 6: 30°C, Trời nắng nóng</li>
                                    </ul>
                                </div>
                                <div className="card-footer text-muted">
                                    Dự báo hàng tuần
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="news">
                {error && <p>{error}</p>} {/* Display error message if any */}
                <div className="mt-5">
                    <div className="row">
                        <div className="col-md-8">
                            <div className=" mt-4">
                                <h2>Thời sự trong nước và quốc tế</h2>
                            </div>
                            {news.map((article, index) => (
                                <NewsItem article={article} key={index} />
                            ))}
                        </div>
                        <div className="col-md-4">
                            <div className="mt-4">
                                <h2>Tin tức thời tiết</h2>
                            </div>
                            <div className="card mb-3" style={{ maxWidth: "800px" }}>
                                <div className="row g-0">
                                    <div className="col-md-4">
                                        <img src="https://cdn.24h.com.vn/upload/3-2024/images/2024-09-30/255x170/1727684843-841-thumbnail-width740height495_anh_cat_3_2.jpg" className="img-fluid rounded-start" alt="Hình ảnh tin tức" />
                                    </div>
                                    <div className="col-md-8">
                                        <div className="card-body">
                                            <h5 className="card-title">Bão Krathon giật trên cấp 17 có ảnh hưởng đến đất liền nước ta?</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default NewsPage;
