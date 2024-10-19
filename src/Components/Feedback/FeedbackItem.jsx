import React, { useState,useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons"; // Import the solid icons

const FeedbackItem = ({ feedbackData,averageRating ,handleFilterRating }) => {
    const [currentFilter, setCurrentFilter] = useState(0); // State để lưu giá trị bộ lọc hiện tại
    // Hàm để render sao dựa trên rating
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating); // Số sao đầy
        const hasHalfStar = rating % 1 !== 0; // Có sao nửa hay không
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Số sao trống

        return (
            <>
                {/* Hiển thị các sao đầy */}
                {Array(fullStars).fill().map((_, i) => (
                    <FontAwesomeIcon key={i} icon={faStar} color="gold" />
                ))}
                {/* Hiển thị sao nửa nếu có */}
                {hasHalfStar && <FontAwesomeIcon icon={faStarHalfAlt} color="gold" />}
                {/* Hiển thị các sao rỗng */}
                {Array(emptyStars).fill().map((_, i) => (
                    <FontAwesomeIcon key={i + fullStars} icon={faStar} color="lightgray" />
                ))}
            </>
        );
    };
    const handleFilterClick = (rating) => {
        setCurrentFilter(rating);
        handleFilterRating(rating);
    };
    return (
        <div className="text-center">
            {averageRating > 0 ? (
                <>
                    <div className="d-flex">
                        <div className="pt-2 mx-2">
                            <div>
                                Số sao trung bình:
                                <strong className="ms-2">{averageRating.toFixed(1)}/5 sao</strong> 
                            </div>
                            <div className="d-flex justify-content-center fs-4">
                                {renderStars(averageRating)}
                                {/* Hiển thị số sao trung bình với 1 chữ số thập phân */}
                            </div> 
                        </div>
                        <div className="d-flex justify-content-center my-3 mx-5">
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                    key={rating}
                                    className="btn btn-outline-primary me-2"
                                    onClick={() => handleFilterClick(rating)}
                                    style={{
                                        backgroundColor: currentFilter === rating ? "blue" : "transparent",
                                        color: currentFilter === rating ? "white" : "",
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "blue")} // Hover effect
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = currentFilter === rating ? "blue" : "transparent")} // Reset hover
                                >
                                    {rating} <FontAwesomeIcon icon={faStar} />
                                </button>
                            ))}
                            <button
                                className="btn btn-outline-secondary ms-2"
                                onClick={() => handleFilterClick(0)}
                                style={{
                                    backgroundColor: currentFilter === 0 ? "blue" : "transparent",
                                    color: currentFilter === 0 ? "white" : "",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "blue")} // Hover effect
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = currentFilter === 0 ? "blue" : "transparent")} // Reset hover
                            >
                                Tất cả
                            </button>
                        </div>
                    </div>
                    <hr />
                    
                 </>
            ) : null}
            {feedbackData && feedbackData.length > 0 ? (
                <>
                    <div>
                        {/* Nếu có dữ liệu, hiển thị các phản hồi */}
                        {feedbackData.map((feedback, index) => (
                            <>                             
                                <div key={index} className="feedback-item  p-3 d-flex">
                                    <div className="align-items-center "style={{ flex: '0 0 30%' }}>
                                        <div className="d-flex">
                                            {/* Avatar và tên người dùng */}
                                            <img 
                                                src="https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg" 
                                                alt="User Avatar" 
                                                className="rounded-circle me-3"
                                                style={{ width: '40px', height: '40px' }}
                                            />
                                            
                                            <div>
                                                <strong>{feedback.Cusname}</strong>
                                                {/* Đánh giá sao */}
                                                <div className="mt-2 mb-2 d-flex align-items-start"> {/* Thêm d-flex cho sao */}
                                                    {[...Array(5)].map((_, starIndex) => (
                                                        <FontAwesomeIcon
                                                            key={starIndex}
                                                            icon={faStar}
                                                            color={starIndex < feedback.rating ? "gold" : "lightgray"}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-muted small text-start">Đánh giá ngày:
                                                {new Date(feedback.date).toLocaleDateString()} {/* Chuyển đổi định dạng ngày */}
                                        </div>
                                    
                                    </div>
                                
                                    <div className="d-flex flex-column ms-3" style={{ flex: '0 0 70%' , textAlign: 'left'}}> {/* Thêm d-flex để căn hàng */}
                                        {/* Nội dung đánh giá */}
                                        <p>{feedback.content}</p>
                                    </div>
                                </div>
                                <div>
                                    <hr style={{ border: '1px solid #ccc', margin: ' 0' }} /> {/* Đường kẻ với kiểu dáng cụ thể */}
                                </div>
                            </>

                        ))}
                    </div>
                </>
            ) : (
                <p>Không có đánh giá.</p>
            )}
        </div>
    );
};

export default FeedbackItem;
