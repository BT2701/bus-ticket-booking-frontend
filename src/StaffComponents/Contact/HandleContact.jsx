import React, { useEffect, useState } from 'react';
import { fetchContactRequests, sendMailAndUpdateStatus } from './HandleContactStaff'; // Import hàm lấy dữ liệu
import { Modal, Button, Form } from 'react-bootstrap'; // Import Bootstrap modal và button
// import notificationWithIcon from '../../Utils/notification'; // Nhập hàm thông báo
import notificationWithIcon from '../../Components/Utils/notification'; // Nhập hàm thông báo
import Pagination from '@mui/material/Pagination';
import Header from "../dashboard/subComponents/Header";


const HandleContact = () => {
    const [requests, setRequests] = useState([]); // State lưu trữ danh sách yêu cầu
    const [loading, setLoading] = useState(true); // State quản lý trạng thái tải dữ liệu
    const [error, setError] = useState(null); // State lưu trữ thông báo lỗi nếu có
    const [selectedRequest, setSelectedRequest] = useState(null); // State lưu trữ yêu cầu đang xử lý
    const [showModal, setShowModal] = useState(false); // State quản lý modal
    const [resolvedRequests, setResolvedRequests] = useState([]); // State lưu trữ các yêu cầu đã xử lý
    const [resolveTitle, setResolveTitle] = useState(''); // State lưu trữ tiêu đề giải quyết
    const [resolveContent, setResolveContent] = useState(''); // State lưu trữ nội dung giải quyết
    const [isSendingMail, setIsSendingMail] = useState(false); // State quản lý trạng thái gửi mail
    const [countdown, setCountdown] = useState(900); // 15 phút tính bằng giây
    const [canUpdate, setCanUpdate] = useState(false); // Quản lý trạng thái nút cập nhật
    const [pageNum, setPageNum] = useState(1);
    const [totalPages, setTotalPages] = useState(10);  // Tổng số trang
    const limit = 10;

    const handleUpdate = async () => {
        const data = await fetchContactRequests(pageNum, limit); // Gọi hàm lấy dữ liệu
        setRequests(data.contacts); // Cập nhật state với dữ liệu lấy được
        setTotalPages(data.totalPages);
        setLoading(false); // Tắt trạng thái loading khi dữ liệu đã sẵn sàng  
        // Đặt lại countdown và không cho phép cập nhật cho đến khi countdown lại bắt đầu
        setCountdown(900); // Reset về 15 phút
        setCanUpdate(false);
        // Gọi lại hàm lấy dữ liệu  
    };

    // Hàm lấy dữ liệu yêu cầu liên hệ từ API
    useEffect(() => {
        const getRequests = async () => {
            // Gọi hàm cập nhật ngay khi component mount
            handleUpdate();
        };

        getRequests(); // Gọi hàm lấy dữ liệu khi component mount
    }, []); // Chỉ chạy một lần khi component mount

    // Giảm countdown mỗi giây
    useEffect(() => {
        let timer = null;
        if (!canUpdate && countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev === 1) {
                        setCanUpdate(true); // Cho phép cập nhật khi countdown về 0
                        clearInterval(timer); // Dừng timer
                        return 0; // Đặt countdown về 0
                    }
                    return prev - 1; // Giảm countdown
                });
            }, 1000); // Giảm mỗi giây
        }

        return () => clearInterval(timer); // Dọn dẹp khi component unmount
    }, [canUpdate, countdown]);

    useEffect(() => {
        // Gọi lại fetchAllRoutes() khi pageNum thay đổi
        handleUpdate();
    }, [pageNum]);  // Chạy lại effect khi pageNum thay đổi

    // Hiển thị thông báo loading hoặc lỗi nếu có
    if (loading) return <div>Đang tải...</div>;
    if (error) return <div>{error}</div>;


    // Hàm mở modal khi nhấn "Xử lý"
    const handleResolve = (request) => {
        setSelectedRequest(request); // Lưu yêu cầu được chọn vào state
        setShowModal(true); // Hiển thị modal
    };

    // Hàm đóng modal
    const handleCloseModal = () => {
        setShowModal(false);
        setResolveTitle('');
        setResolveContent('');
        setIsSendingMail(false); // Đặt lại trạng thái gửi mail khi đóng modal
    };

    // Hàm xử lý gửi mail
    const handleSendMail = async () => {
        // Kiểm tra xem tiêu đề và nội dung có tồn tại hay không
        if (!resolveTitle || !resolveContent) {
            notificationWithIcon('error', 'Vui lòng nhập tiêu đề và nội dung', '');
            return; // Dừng thực hiện hàm nếu không có tiêu đề hoặc nội dung
        }
        setIsSendingMail(true); // Bật trạng thái loading khi bắt đầu gửi mail
        // Gọi hàm sendMailAndUpdateStatus và truyền requestId, resolveTitle và resolveContent
        try {
            const response = await sendMailAndUpdateStatus(
                selectedRequest.id,          // ID của yêu cầu đang được chọn
                resolveTitle,                // Tiêu đề giải quyết nhập từ input
                resolveContent,              // Nội dung giải quyết nhập từ input
                selectedRequest.email        // Email của người gửi yêu cầu
            );
            console.log(response);

            if (response == true) {
                notificationWithIcon('success', 'Giải quyết thành công', '');

                // Thêm yêu cầu vào danh sách đã xử lý
                setResolvedRequests([...resolvedRequests, selectedRequest.id]);

                // Đóng modal sau khi gửi mail thành công
                handleCloseModal();
            } else {
                notificationWithIcon('error', 'yêu cầu đã được xử lý :', '');
                setResolvedRequests([...resolvedRequests, selectedRequest.id]);
                handleCloseModal();
            }
        } catch (error) {
            notificationWithIcon('error', 'Có lỗi xảy ra khi gửi mail:', '');
        }
    };
    const handlePageChange = (newPageNum) => {
        setPageNum(newPageNum);
    };
    const renderPagination = () => {
        return (
            <Pagination
                count={totalPages}  // Tổng số trang
                page={pageNum}  // Trang hiện tại
                onChange={(event, value) => handlePageChange(value)}  // Cập nhật trang khi người dùng click
                shape="rounded"  // Hình dạng của các nút phân trang
                color="primary"  // Màu sắc cho nút phân trang
                siblingCount={2}  // Số lượng trang hiển thị ở gần trang hiện tại
                boundaryCount={1}  // Số lượng trang hiển thị ở đầu và cuối
            />
        );
    };


    // Trả về giao diện hiển thị bảng yêu cầu liên hệ
    return (
        <div>
            <Header title="LIÊN HỆ" subtitle="Quản lý liên hệ" />
            <div className="d-flex justify-content-between align-items-center">
                <h2></h2>
                <Button
                    variant="primary"
                    onClick={handleUpdate}
                    disabled={!canUpdate} // Vô hiệu hóa nút khi không thể cập nhật
                    className="m-1" // Sử dụng ml-auto để đẩy nút về bên phải
                >
                    {canUpdate ? "Cập nhật" : `Cập nhật (${countdown} giây)`}
                </Button>
            </div>
            <table className="table table-striped table-bordered table-hover">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col" style={{ width: '5%' }}>ID</th>
                        <th scope="col" style={{ width: '15%' }}>Tên</th>
                        <th scope="col" style={{ width: '12%' }}>Email</th>
                        <th scope="col" style={{ width: '10%' }}>Điện Thoại</th>
                        <th scope="col" style={{ width: '12%' }}>Tiêu đề</th>
                        <th scope="col" style={{ width: '20%' }}>Nội dung</th>
                        <th scope="col" style={{ width: '10%' }}>Ngày</th>
                        <th scope="col" style={{ width: '13%' }}>...</th>
                    </tr>
                </thead>
                <tbody>
                    {requests?.map(request => (
                        <tr key={request.id}>
                            <td>{request.id}</td>
                            <td>{request.sender}</td>
                            <td>{request.email}</td>
                            <td>{request.phone}</td>
                            <td>{request.title}</td>
                            <td>{request.content}</td>
                            <td>{new Date(request.create_at).toLocaleDateString()}</td> {/* Format ngày */}
                            <td>
                                {resolvedRequests.includes(request.id) ? (
                                    <span>Đã xử lý</span> // Hiển thị "Đã xử lý" nếu đã xử lý
                                ) : (
                                    <button className="btn btn-primary" onClick={() => handleResolve(request)}>Xử lý</button> // Nút xử lý nếu chưa xử lý
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Hiển thị phân trang */}
            <div className="d-flex justify-content-center">
                {renderPagination()}
            </div>

            {/* Modal để xử lý yêu cầu */}
            {selectedRequest && (
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Giải quyết yêu cầu</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><strong>Khách hàng:</strong> {selectedRequest.sender}</p>
                        <p><strong>Email:</strong> {selectedRequest.email}</p>
                        <p><strong>Tiêu đề:</strong> {selectedRequest.title}</p>
                        <p><strong>Nội dung:</strong> {selectedRequest.content}</p>
                        <Form>
                            <Form.Group controlId="resolveTitle ">
                                <strong className="mb-3">Tiêu đề giải quyết</strong>
                                <Form.Control type="text" value={resolveTitle} placeholder="Nhập tiêu đề..." onChange={(e) => setResolveTitle(e.target.value)} className="mb-2" />
                            </Form.Group>
                            <Form.Group controlId="resolveContent">
                                <strong className="mb-3">Nội dung giải quyết</strong>
                                <Form.Control as="textarea" rows={3} value={resolveContent} placeholder="Nhập nội dung..." onChange={(e) => setResolveContent(e.target.value)} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>Đóng</Button>
                        <Button
                            variant="primary"
                            onClick={handleSendMail}
                            disabled={isSendingMail} // Vô hiệu hóa nút khi đang gửi mail
                        >
                            {isSendingMail ?
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"> </span>
                                    Đang gửi...
                                </>
                                :
                                'Gửi Mail'}
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default HandleContact;
