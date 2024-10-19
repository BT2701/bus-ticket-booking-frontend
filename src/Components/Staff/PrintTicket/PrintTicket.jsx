import React, { useState,useEffect  } from 'react';
import notificationWithIcon from '../../Utils/notification'; // Nhập hàm thông báo
import { lookupTicketById,updateTicketStatus } from './PrintTicketUntil'; // Import hàm lấy dữ liệu
import { Modal, Button ,Spinner} from 'react-bootstrap'; // Hoặc thư viện modal bạn đang sử dụng


const PrintTicketComponent = () => {
  const [ticketCode, setTicketCode] = useState('');
  const [ticketInfo, setTicketInfo] = useState(null); // State để lưu thông tin vé
  const [showModal, setShowModal] = useState(false); // State để quản lý modal
  const [loading, setLoading] = useState(false); // State để quản lý trạng thái loading

  const handleInputChange = (event) => {
    setTicketCode(event.target.value);
  };

  const handlePrintTicket = () => {
    if (ticketCode) {
        const searchParams = new URLSearchParams({
            ticketCode, // Thêm ticketCode vào query string
        }).toString();

        // Cập nhật URL với query string mới
        window.history.pushState(null, '', `?${searchParams}`);
        lookupTicketById()
            .then((data) => {
                if (data && data.length > 0) {
                    const ticketStatus = data[0][8]; // Truy cập trạng thái vé từ phản hồi

                    if (ticketStatus === 1) {
                        // Lưu thông tin vé vào state
                        setTicketInfo(data[0]); // Cập nhật state với thông tin vé
                        setShowModal(true); // Mở modal

                        // Logic để in vé ở đây (nếu cần)
                    } else if (ticketStatus === 2) {
                        notificationWithIcon('error', 'Vé đã được sử dụng.', '');
                    } else {
                        notificationWithIcon('error', 'Không tìm thấy vé.', '');
                    }
                } else {
                    notificationWithIcon('error', 'Không tìm thấy vé.', '');
                }
            })
            .catch((error) => {
                console.error('Error fetching ticket:', error);
                notificationWithIcon('error', 'Đã xảy ra lỗi khi tìm kiếm vé.', '');
            });
    } else {
        notificationWithIcon('error', 'Vui lòng nhập mã vé.', '');
    }
};

const handleCloseModal = () => setShowModal(false); // Hàm để đóng modal

// Hàm để in vé
const handlePrint = async () => {
    if (ticketInfo) {
        setLoading(true); // Bắt đầu loading
        // Giả định in
        const response = await updateTicketStatus(2); // Gọi hàm updateTicketStatus
        setTimeout(() => {
            if (response === true) { // Kiểm tra với kiểu boolean
                setLoading(false); // Kết thúc loading sau khi in xong
                setShowModal(false); // Đóng modal
                setTicketCode(''); // Reset giá trị ticketCode
                setTicketInfo(null); // Reset thông tin vé
                notificationWithIcon('success', 'In vé thành công.', '');
            }
            else{
                notificationWithIcon('error', 'Có lỗi trong quá trình in vé vui lòng thử lại.', '');
                setLoading(false); // Kết thúc loading sau khi in xong

            }
        }, 3000); // Chờ 5 giây trước khi thực hiện in
    }
};


  return (

    <>
    <div className="print-ticket-container text-center"> {/* Căn giữa nội dung */}
            <label htmlFor="ticketCode" className="form-label">Mã vé:</label>
            <div className="d-flex justify-content-center"> {/* Thêm div này để căn giữa input */}
            <input
                type="text"
                id="ticketCode"
                value={ticketCode}
                onChange={handleInputChange}
                className="form-control ticket-input w-25" // Thêm lớp CSS cho input
                placeholder="Nhập mã vé"
            />
            </div>
            <button
            onClick={handlePrintTicket}
            className="btn btn-primary mt-2"
            >
            In vé
            </button>
        </div>
    {/* Modal để hiển thị thông tin vé */}
    <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
            <Modal.Title>Thông tin vé</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {ticketInfo ? (
                <div>
                    <p><strong>Loại xe:</strong> {ticketInfo[0]}</p>
                    <p><strong>Thời gian khởi hành:</strong> {new Date(ticketInfo[1]).toLocaleString()}</p>
                    <p><strong>Thời gian đến:</strong> {new Date(ticketInfo[2]).toLocaleString()}</p>
                    <p><strong>Giá:</strong> {ticketInfo[3]} VND</p>
                    <p><strong>Số ghế:</strong> {ticketInfo[4]}</p>
                    <p><strong>Thời gian:</strong> {ticketInfo[5]}</p>
                    <p><strong>Bến đi:</strong> {ticketInfo[6]}</p>
                    <p><strong>Bến đến:</strong> {ticketInfo[7]}</p>
                </div>
            ) : (
                <p>Không có thông tin vé.</p>
            )}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
                Đóng
            </Button>
            <Button variant="primary" onClick={handlePrint} disabled={loading}>
                {loading ? (
                <>
                    <Spinner animation="border" size="sm" className="me-2" />
                        In vé...
                </>
                ) : (
                    'In vé'
                )}
            </Button>
        </Modal.Footer>
    </Modal>
    </>
  );
};

export default PrintTicketComponent;
