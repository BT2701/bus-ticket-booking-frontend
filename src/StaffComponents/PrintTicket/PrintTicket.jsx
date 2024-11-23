import React, { useState,useEffect } from 'react';
import notificationWithIcon from '../../Components/Utils/notification'; // Nhập hàm thông báo
import { lookupTicketById, updateTicketStatus } from './PrintTicketUntil'; // Import hàm lấy dữ liệu
import { Modal, Button, Spinner } from 'react-bootstrap'; // Hoặc thư viện modal bạn đang sử dụng
import { Scanner } from '@yudiel/react-qr-scanner'; // Import the new Scanner component
import CropFree from '@mui/icons-material/CropFree';

const PrintTicketComponent = () => {
  const [ticketCode, setTicketCode] = useState('');
  const [ticketInfo, setTicketInfo] = useState(null); // State để lưu thông tin vé
  const [showTicketModal, setShowTicketModal] = useState(false); // State để quản lý modal thông tin vé
  const [showQRModal, setShowQRModal] = useState(false); // State để quản lý modal QR Code
  const [loading, setLoading] = useState(false); // State để quản lý trạng thái loading
  const [isScanning, setIsScanning] = useState(false); // Trạng thái quét QR
  const [isQrSuccess, setIsQrSuccess] = useState(false); // Trạng thái quét QR

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
              setShowTicketModal(true); // Mở modal thông tin vé

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

  const handleCloseTicketModal = () => setShowTicketModal(false); // Hàm để đóng modal thông tin vé
  const handleCloseQRModal = () => setShowQRModal(false); // Hàm để đóng modal quét QR

  // Hàm để in vé
  const handlePrint = async () => {
    if (ticketInfo) {
      setLoading(true); // Bắt đầu loading
      // Giả định in
      const response = await updateTicketStatus(2); // Gọi hàm updateTicketStatus
      setTimeout(() => {
        if (response === true) { // Kiểm tra với kiểu boolean
          setLoading(false); // Kết thúc loading sau khi in xong
          setShowTicketModal(false); // Đóng modal
          setTicketCode(''); // Reset giá trị ticketCode
          setTicketInfo(null); // Reset thông tin vé
          notificationWithIcon('success', 'In vé thành công.', '');
        } else {
          notificationWithIcon('error', 'Có lỗi trong quá trình in vé vui lòng thử lại.', '');
          setLoading(false); // Kết thúc loading sau khi in xong
        }
      }, 3000); // Chờ 5 giây trước khi thực hiện in
    }
  };

  const handleScan = (result) => {
    if (result && result.length > 0) {
      // Lấy rawValue từ kết quả quét QR
      const rawValue = result[0]?.rawValue;
  
      // Cắt phần sau dấu ":" trong rawValue
      if (rawValue && rawValue.includes('TicketID:')) {
        const ticketId = rawValue.split(':')[1]; // Lấy giá trị sau "TicketID:"
        setTicketCode(ticketId); // Set ticketCode là giá trị sau "TicketID:"
        setIsScanning(false); // Dừng quét QR
        setIsQrSuccess(true);
      }
    }
  };
  
  const handleError = (err) => {
    console.error('Error scanning QR code:', err);
    
    // Hiển thị thông báo lỗi
    notificationWithIcon('error', 'Đã xảy ra lỗi khi quét mã QR.', '');
    
    // Tắt modal và reset trạng thái
    setIsScanning(false); // Dừng quét QR
    setTicketCode(''); // Reset ticketCode về chuỗi rỗng (hoặc giá trị mặc định)
    setShowQRModal(false); // Đóng modal quét QR
  };

  useEffect(() => {
    if (ticketCode && isQrSuccess) {
      handlePrintTicket(); // Gọi handlePrintTicket khi ticketCode thay đổi vì quét qr
    }
    setIsQrSuccess(false);
  }, [ticketCode]); // Chạy lại khi ticketCode thay đổi vì quét qr
  

  return (
    <>
      <div className="print-ticket-container text-center"> {/* Căn giữa nội dung */}
        <strong htmlFor="ticketCode" className="form-label fs-4">Mã vé:</strong>
        <div className="d-flex justify-content-center"> {/* Thêm div này để căn giữa input */}
          <input
            type="text"
            id="ticketCode"
            value={ticketCode}
            onChange={handleInputChange}
            className="form-control ticket-input w-25" // Thêm lớp CSS cho input
            placeholder="Nhập mã vé"
            onKeyDown={(event) => {
                // Kiểm tra nếu phím nhấn là Enter (key code 13)
                if (event.key === 'Enter') {
                  handlePrintTicket(); // Gọi hàm handlePrintTicket
                }
            }}
          />
        </div>
        <button
          onClick={handlePrintTicket}
          className="btn btn-primary mt-2"
        >
        In vé
        </button>
        <button
            onClick={() => {
                setIsScanning(!isScanning); // Chuyển trạng thái quét QR
                setShowQRModal(true); // Mở modal quét QR
            }}
            className="btn btn-outline-primary qr-button mt-2 ms-2"
            >
            <CropFree fontSize="large" />
        </button>
      </div>

      {/* QR Scanner Modal */}
      {isScanning && (
        <Modal show={showQRModal} onHide={handleCloseQRModal} size="sm">
            <Modal.Header closeButton>
            <Modal.Title>Quét mã QR vé</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div className="qr-scanner-container text-center mt-3" style={{ width: '100%', height: '250px' }}>
                <Scanner
                onScan={handleScan} // Handling scan result
                onError={handleError} // Handling scan error
                style={{ width: '100%', height: '100%' }} // Điều chỉnh kích thước của Scanner
                />
            </div>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseQRModal}>
                Đóng
            </Button>
            </Modal.Footer>
        </Modal>
        )}


      {/* Ticket Info Modal */}
      <Modal show={showTicketModal} onHide={handleCloseTicketModal}>
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
          <Button variant="secondary" onClick={handleCloseTicketModal}>
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
