import React, { useState,useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons"; // Import the solid icons
import { getAllFeedback } from './HandleFeedback'; // Import hàm fetch dữ liệu
import { useFeedback } from "../../Context/FeedbackProvider";


const FeedbackButton = ({ scheduleId, onFeedbackUpdate , page, size}) => {
    const { openFeedback, closeFeedback,isOpenFeedback,setIsOpenFeedback} = useFeedback();
    // const [isOpenFeedback, setIsOpenFeedback] = useState(false);

    const getFeedback = async () => {
        setIsOpenFeedback(!isOpenFeedback);
        if (isOpenFeedback==true) {
            // Nếu trạng thái là đóng (isOpenFeedback = false), trả về mảng rỗng
            onFeedbackUpdate([]);
            return; // Không gọi API
        }
        try {
            const response = await getAllFeedback(scheduleId, page, size);
            const feedbacks = response.map(feedback => ({
                content: feedback[0],
                rating: feedback[1],
                date: feedback[2],
                Cusname: feedback[3]
            }));
            onFeedbackUpdate(feedbacks); // Cập nhật dữ liệu cho component cha thông qua hàm callback
        } catch (error) {
            console.error('Error fetching feedback:', error);
        }
    };

    return (
        <button 
            type="button" 
            className="btn btn-link"  
            onClick={getFeedback} // Lấy dữ liệu khi nhấn nút
        >
            <span>Xem đánh giá chuyến xe </span>
            {isOpenFeedback ? (
                <FontAwesomeIcon icon={faChevronUp} />
            ) : (
                <FontAwesomeIcon icon={faChevronDown} />
            )}
        </button>
    );
};

export default FeedbackButton;
