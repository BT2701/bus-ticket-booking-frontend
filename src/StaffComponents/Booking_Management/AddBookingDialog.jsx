// AddBookingDialog.jsx
import React from 'react';
const AddBookingDialog = ({
    showDialog,
    setShowDialog,
    newBooking,
    setNewBooking,
    handleAddBooking,
    handleSaveEdit,
    isEditing,
    seats
}) => {
    const handleSeatChange = (seat) => {
        setNewBooking((prevBooking) => {
            const updatedSeats = Array.isArray(prevBooking.seats)
                ? prevBooking.seats.includes(seat)
                    ? prevBooking.seats.filter(s => s !== seat)
                    : [...prevBooking.seats, seat]
                : [seat]; // Default to an array if it's undefined
            return { ...prevBooking, seats: updatedSeats };
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBooking((prevBooking) => ({
            ...prevBooking,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        if (isEditing) {
            handleSaveEdit(newBooking);
        } else {
            handleAddBooking();
        }
    };

    return (
        <div className={`modal fade ${showDialog ? 'show' : ''}`} style={{ display: showDialog ? 'block' : 'none' }} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{isEditing ? 'Edit Booking' : 'Add New Booking'}</h5>
                        <button type="button" className="btn-close" onClick={() => setShowDialog(false)} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="mb-3">
                                <label htmlFor="customerName" className="form-label">Họ và Tên</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="customerName"
                                    name="customerName"
                                    value={newBooking.customerName}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    value={newBooking.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="phoneNumber" className="form-label">Số Điện Thoại</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={newBooking.phoneNumber}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="from" className="form-label">Lộ Trình</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="from"
                                    name="from"
                                    value={newBooking.from}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="departureTime" className="form-label">Khởi Hành Lúc</label>
                                <input
                                    type="datetime-local"
                                    className="form-control"
                                    id="departureTime"
                                    name="departureTime"
                                    value={newBooking.departureTime}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="status" className="form-label">Trạng Thái</label>
                                <select
                                    className="form-select"
                                    id="status"
                                    name="status"
                                    value={newBooking.status}
                                    onChange={handleInputChange}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Số Ghế</label>
                                {seats.map((seat, index) => (
                                    <div key={index}>
                                        <input
                                            type="checkbox"
                                            id={`seat-${seat}`}
                                            value={seat}
                                            checked={Array.isArray(newBooking.seats) && newBooking.seats.includes(seat)}
                                            onChange={() => handleSeatChange(seat)}
                                        />
                                        <label htmlFor={`seat-${seat}`}>{seat}</label>
                                    </div>
                                ))}
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowDialog(false)}>Close</button>
                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                            {isEditing ? 'Save Changes' : 'Add Booking'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default AddBookingDialog;
