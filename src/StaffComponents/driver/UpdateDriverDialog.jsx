import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
} from '@mui/material';
import ApiService from '../../Components/Utils/apiService';
import notificationWithIcon from '../../Components/Utils/notification';

function UpdateDriverDialog({ open, onClose, driver }) {
  const [newDriver, setNewDriver] = useState({
    id: "",
    name: "",
    phone: "",
    license: "",
    imgUrl: "",
    img: null,  // Giữ trường img để hiển thị ảnh
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (driver) {
      setNewDriver({
        id: driver.id || "",
        name: driver.name || "",
        phone: driver.phone || "",
        license: driver.license || "",
        imgUrl: driver.img ? `http://localhost:8080/api/drivers/avatar/${driver.img}` : "",
        img: null,  
      });
    }
  }, [driver]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewDriver({ ...newDriver, [name]: value });
  };

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setNewDriver({ ...newDriver, imgUrl: URL.createObjectURL(event.target.files[0]) ,img: event.target.files[0] });
    }
  };

  const validateForm = () => {
    const { name, phone, license } = newDriver;

    if (!name || !phone || !license) {
      return "Tất cả các trường đều phải được điền!";
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return "Số điện thoại phải có 10 chữ số!";
    }

    return null;
  };

  const handleClickClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const formData = new FormData();
    formData.append("name", newDriver.name);
    formData.append("phone", newDriver.phone);
    formData.append("license", newDriver.license);
    if (newDriver.img) {
      formData.append("file", newDriver.img);
    }

    try {
      const response = await ApiService.put("/api/drivers/" + newDriver.id, formData);
      console.log(response.data);
      notificationWithIcon("success", "Cập nhật", "Cập nhật thông tin tài xế thành công!");
      onClose();
    } catch (err) {
      console.log(err?.response?.data?.message || err?.message);
      setError("Không thể cập nhật thông tin tài xế vì: " + (err?.response?.data?.message || err?.message));
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Cập nhật thông tin tài xế</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          name="name"
          label="Họ tên"
          type="text"
          fullWidth
          variant="outlined"
          value={newDriver.name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="phone"
          label="Số điện thoại"
          type="text"
          fullWidth
          variant="outlined"
          value={newDriver.phone}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="license"
          label="Giấy phép lái xe"
          type="text"
          fullWidth
          variant="outlined"
          value={newDriver.license}
          onChange={handleChange}
        />
        <div style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
          <h4 style={{ margin: "0 10px 0 0" }}>Thêm avatar :</h4>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        {newDriver.imgUrl && (
          <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <img
              src={newDriver.imgUrl}
              alt="Driver avatar"
              style={{ width: "200px", height: "200px", marginTop: "10px", objectFit: "cover" }}
            />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClickClose}>Hủy</Button>
        <Button onClick={handleSubmit}>Lưu</Button>
      </DialogActions>
      {error && (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          onClose={() => setError("")}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={() => setError("")} severity="error">
            {error}
          </Alert>
        </Snackbar>
      )}
    </Dialog>
  );
}

export default UpdateDriverDialog;