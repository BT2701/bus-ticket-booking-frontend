import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import ApiService from '../Utils/apiService';
import notificationWithIcon from '../Utils/notification'; // Nhập hàm thông báo

const ContactForm = () => {
  const [formData, setFormData] = useState({
    sender: '',
    email: '',
    phone: '',
    title: '',
    content: '',
    status: 0
  });

  const [errors, setErrors] = useState({}); // State để lưu trữ thông báo lỗi

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^0\d{9}$/; // Định dạng cho số điện thoại: bắt đầu bằng 0 và có 10 chữ số

    if (!formData.sender.trim()) {
      newErrors.sender = 'Họ và tên không được để trống.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống.';
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại không được để trống.';
    } else if (!phonePattern.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số.';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Ghi chú không được để trống.';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    console.log(formData);
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors); // Cập nhật state lỗi nếu có
    } else {
      // Gửi dữ liệu bằng Axios
      ApiService.post('/api/contact', formData)
        .then((response) => {
          notificationWithIcon('success', 'Gửi thành công', '');
          setErrors({}); // Reset thông báo lỗi nếu không có lỗi
          setFormData({ sender: '', email: '', phone: '', title: '', content: '' }); // Reset form
        })
        .catch((error) => {
          notificationWithIcon('error', 'Có lỗi khi thêm', 'Vui lòng thử lại sau.');
          // Xử lý lỗi nếu cần
        });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <h2>LIÊN HỆ VỚI CHÚNG TÔI</h2>
          <p><strong>CÔNG TY CỔ PHẦN XE KHÁCH PHƯƠNG TRANG - FUTA BUS LINES</strong></p>
          <p>Địa chỉ: Số 01 Tô Hiến Thành, Phường 3, Thành phố Đà Lạt, Tỉnh Lâm Đồng, Việt Nam</p>
          <p>Website: <a href="https://futabus.vn/">https://futabus.vn/</a></p>
          <p>Điện thoại: 02838386852</p>
          <p>Fax: 02838386853</p>
          <p>Email: hotro@futa.vn</p>
          <p>Hotline: 19006067</p>
        </div>
        <div className="col-md-6">
          <h3>Gửi thông tin liên hệ đến chúng tôi</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="name">Họ và tên</label>
              <input
                type="text"
                className="form-control"
                id="sender"
                name="sender"
                value={formData.sender}
                onChange={handleChange}
                required
              />
              {errors.sender && <small className="text-danger">{errors.sender}</small>}
            </div>
            <div className="form-group mb-3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <small className="text-danger">{errors.email}</small>}
            </div>
            <div className="form-group mb-3">
              <label htmlFor="phone">Điện thoại</label>
              <input
                type="text"
                className="form-control"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && <small className="text-danger">{errors.phone}</small>}
            </div>
            <div className="form-group mb-3">
              <label htmlFor="title">Nhập Tiêu đề</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
              {errors.title && <small className="text-danger">{errors.title}</small>}
            </div>
            <div className="form-group mb-3">
              <label htmlFor="content">Nhập ghi chú</label>
              <textarea
                className="form-control"
                id="content"
                name="content"
                rows="3"
                value={formData.content}
                onChange={handleChange}
              ></textarea>
              {errors.content && <small className="text-danger">{errors.content}</small>}
            </div>
            <button type="submit" className="btn btn-primary">Gửi</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
