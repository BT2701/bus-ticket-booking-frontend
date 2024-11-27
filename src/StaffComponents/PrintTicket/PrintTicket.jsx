import React, { useState, useEffect, useRef } from 'react';
import notificationWithIcon from '../../Components/Utils/notification'; // Nhập hàm thông báo
import { lookupTicketById, updateTicketStatus } from './PrintTicketUntil'; // Import hàm lấy dữ liệu
import { Modal, Button, Spinner } from 'react-bootstrap'; // Hoặc thư viện modal bạn đang sử dụng
import { Scanner } from '@yudiel/react-qr-scanner'; // Import the new Scanner component
import CropFree from '@mui/icons-material/CropFree';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import Header from "../dashboard/subComponents/Header";
import NotificationDialog from "../../sharedComponents/notificationDialog";
import { useBooking } from '../../Context/BookingContex';
import axios from 'axios';


const PrintTicketComponent = () => {
  const [ticketCode, setTicketCode] = useState('');
  const [ticketInfo, setTicketInfo] = useState(null); // State để lưu thông tin vé
  const [showTicketModal, setShowTicketModal] = useState(false); // State để quản lý modal thông tin vé
  const [showQRModal, setShowQRModal] = useState(false); // State để quản lý modal QR Code
  const [loading, setLoading] = useState(false); // State để quản lý trạng thái loading
  const [isScanning, setIsScanning] = useState(false); // Trạng thái quét QR
  const [isQrSuccess, setIsQrSuccess] = useState(false); // Trạng thái quét QR
  const printRef = useRef();
  const [showDialogPrint, setShowDialogPrint] = useState(false); // Trạng thái để hiển thị cảnh báo xóa
  const [payment, setPayment] = useState(false); // Trạng thái để hiển thị cảnh báo xóa
  const { setLoader } = useBooking();


  const PrintTicket = () => {
    if (payment) {
      handlePrint();
    } else {
      setShowDialogPrint(true); // Mở cảnh báo
    }
  };

  const confirmPrintTicket = () => {
    handlePrint();
    setShowDialogPrint(false); // Đóng cảnh báo
  };

  const cancelPrintTicket = () => {
    setShowDialogPrint(false); // Đóng cảnh báo mà không xóa
  };
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
      if (!payment) {
        const paymentResult = await handlePayment();

        if (!paymentResult) {
          // Xử lý khi thanh toán thất bại
          setLoading(false); // Kết thúc loading sau khi in xong
          return false;
        }
      }
      const response = await updateTicketStatus(2); // Gọi hàm updateTicketStatus
      setTimeout(() => {
        if (response === true) { // Kiểm tra với kiểu boolean
          // Tạo PDF khi in thành công
          printPDF(); // Tạo PDF từ thông tin vé
          setLoading(false); // Kết thúc loading sau khi in xong
          setShowTicketModal(false); // Đóng modal
          setTicketCode(''); // Reset giá trị ticketCode
          setTicketInfo(null); // Reset thông tin vé
          notificationWithIcon('success', 'In vé thành công.', '');
        } else {
          notificationWithIcon('error', 'Có lỗi trong quá trình in vé vui lòng thử lại.', '');
          setLoading(false); // Kết thúc loading sau khi in xong
        }
      }, 3000);
    }
  };
  const handlePayment = async () => {
    try {
      // Thực hiện POST request thanh toán
      const res = await axios.post('http://localhost:8080/api/payment', {
        bookingId: ticketInfo[9],
        method: 'cash',
        amount: ticketInfo[3],
      });

      if (res.status === 200) {
        // Thông báo thanh toán thành công
        notificationWithIcon('success', 'Thành Công', 'Thanh toán thành công');
        setLoader(1); // Cập nhật trạng thái loader
        return true;  // Trả về true nếu thanh toán thành công
      }
    } catch (error) {
      // Thông báo lỗi nếu thanh toán thất bại
      notificationWithIcon('error', 'Lỗi', 'Thanh toán thất bại');
      return false;  // Trả về false nếu có lỗi
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

  const printPDF = () => {
    html2canvas(printRef.current, { scrollX: 0, scrollY: -window.scrollY }).then((canvas) => {
      const pdf = new jsPDF();

      // Đo kích thước của canvas và điều chỉnh trang PDF cho phù hợp
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Kích thước A4 trong mm
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm

      // Tính tỷ lệ để phù hợp với chiều rộng trang PDF
      const scale = pdfWidth / canvasWidth;
      const scaledHeight = canvasHeight * scale;

      // Thêm ảnh vào PDF với kích thước phù hợp
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, pdfWidth - 20, scaledHeight);

      // Kiểm tra nếu chiều cao của nội dung vượt quá chiều dài trang A4
      let remainingHeight = scaledHeight;
      let position = 10;

      // Thêm các trang mới nếu nội dung vượt quá một trang
      while (remainingHeight > 0) {
        if (remainingHeight > pdfHeight) {
          pdf.addPage(); // Thêm trang mới nếu cần
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, position, pdfWidth - 20, pdfHeight);
          remainingHeight -= pdfHeight;
          position += pdfHeight;
        } else {
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, position, pdfWidth - 20, remainingHeight);
          remainingHeight = 0; // Nội dung đã hết
        }
      }

      // Thêm mã QR vào PDF (nếu có)
      const qrURL = `https://api.qrserver.com/v1/create-qr-code/?data=${ticketInfo[9]}&size=100x100`;
      fetch(qrURL)
        .then(response => response.blob())
        .then(qrBlob => {
          const qrReader = new FileReader();
          qrReader.onloadend = () => {
            const base64QR = qrReader.result;
            // Thêm mã QR vào vị trí mong muốn trong PDF
            pdf.addImage(base64QR, 'PNG', 165, 52, 25, 25); // Vị trí và kích thước mã QR
            pdf.save('ticket-info.pdf');
          };
          qrReader.readAsDataURL(qrBlob); // Đọc dữ liệu QR và chuyển sang base64
        });
    });
  };

  useEffect(() => {
    if (ticketInfo) {
      if (ticketInfo[10] !== null) {
        setPayment(true); // Đã thanh toán
      } else {
        setPayment(false); // Chưa thanh toán
      }
    }
  }, [ticketInfo]);

  return (
    <>
      <Header title="IN VÉ" subtitle="Quản lý in vé" />
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
      <NotificationDialog
        message="Bạn đã thu tiền mặt chưa?"
        isOpen={showDialogPrint}
        onClose={cancelPrintTicket}
        type="warning"
        onConfirm={confirmPrintTicket}
        onCancel={cancelPrintTicket}
        style={{ zIndex: 3050 }} // Đảm bảo giá trị z-index cao hơn Modal
      />

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
      <Modal show={showTicketModal} onHide={handleCloseTicketModal} size="lg" style={{ zIndex: 1050 }}>
        <Modal.Header closeButton>
          <Modal.Title>Thông tin vé</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {ticketInfo ? (
            <>
              <div className="ticket-info-container d-flex align-items-center border p-3 rounded" ref={printRef}>
                {/* Icon vé */}
                <div className="ticket-icon me-3">
                  <img
                    src="https://media.istockphoto.com/id/1293064741/vector/ticket-vector-icon.jpg?s=612x612&w=0&k=20&c=8QDWEKhTj-38jB8aBYGiyhWXoHR9uy8x39Nojaowhvo="
                    alt="Ticket Icon"
                    style={{ width: '120px', height: '120px' }}
                  />
                </div>
                {/* Thông tin vé */}
                <div>
                  <h5 className="mb-2" style={{ color: 'red', fontSize: '1.5rem' }}>
                    Nhà Xe Phương Trang
                  </h5>
                  <p className="mb-1" style={{ fontSize: '1.2rem' }}>
                    <strong>Loại xe:</strong> {ticketInfo[0]}
                  </p>
                  <p className="mb-1" style={{ fontSize: '1.2rem' }}>
                    <strong>Từ:</strong> {ticketInfo[6]}
                  </p>
                  <p className="mb-1" style={{ fontSize: '1.2rem' }}>
                    <strong>Đến:</strong> {ticketInfo[7]}
                  </p>
                  <p className="mb-1" style={{ fontSize: '1.2rem' }}>
                    <strong>Thời gian khởi hành:</strong>{' '}
                    {new Date(ticketInfo[1]).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    ({new Date(ticketInfo[1]).toLocaleDateString()})
                  </p>
                </div>
                {/* Giá vé và QR Code */}
                <div className="ms-auto text-center d-flex flex-column align-items-center">
                  <h4 style={{ color: 'blue', fontSize: '1.5rem' }}>
                    {ticketInfo[3].toLocaleString('vi-VN')} ₫
                  </h4>
                  <p className="mb-1" style={{ fontSize: '1.2rem' }}>
                    <strong>Mã ghế:</strong> {ticketInfo[4]}
                  </p>
                  <p className="mb-1" style={{ fontSize: '1.2rem' }}>
                    <strong>Mã vé:</strong> {ticketInfo[9]}
                  </p>
                  <div className="qr-code-container mt-2">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?data=${ticketInfo[9]}&size=100x100`}
                      alt="QR Code"
                      style={{ width: '100px', height: '100px' }}
                    />
                  </div>
                </div>
              </div>
              <div className="text-center">
                <strong
                  style={{
                    color: ticketInfo[10] == null ? 'red' : 'green',
                    fontSize: '1.2rem',
                  }}
                >
                  {ticketInfo[10] == null
                    ? `Vui lòng thu ${ticketInfo[3].toLocaleString('vi-VN')} ₫ trước khi in vé`
                    : 'Đã thanh toán'
                  }
                </strong>
              </div>
            </>

          ) : (
            <p>Không có thông tin vé.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseTicketModal}>
            Đóng
          </Button>
          {/* Kiểm tra ticketInfo và giá trị ticketInfo[10] */}
          {ticketInfo && (
            <Button variant="primary" onClick={PrintTicket} disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  In vé...
                </>
              ) : (
                'In vé'
              )}
            </Button>
          )}
        </Modal.Footer>
      </Modal>

    </>
  );
};

export default PrintTicketComponent;
