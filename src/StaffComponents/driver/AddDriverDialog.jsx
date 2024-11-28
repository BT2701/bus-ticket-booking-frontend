import React, { useState } from 'react';
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

function AddDriverDialog({ open, onClose }) {
  const [newDriver, setNewDriver] = useState({
    name: "",
    phone: "",
    license: "",
    img: null, // Giữ trường img để hiển thị ảnh
  });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewDriver({ ...newDriver, [name]: value });
  };

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setNewDriver({ ...newDriver, img: event.target.files[0] });
    }
  };

  const validateForm = () => {
    const { name, phone, license, img } = newDriver;

    if (!name || !phone || !license || !img) {
      return "Tất cả các trường đều phải được điền!";
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return "Số điện thoại phải có 10 chữ số!";
    }

    return null;
  };

  const handleClickClose = () => {
    setNewDriver({
      name: "",
      phone: "",
      license: "",
      img: null, // Giữ trường img để hiển thị ảnh
    })
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
    formData.append("file", newDriver.img);

    console.log(
      {
        name : newDriver.name,
        phone : newDriver.phone,
        license : newDriver.license,
        file : newDriver.img
      }
    )

    try {
      const response = await ApiService.post("/api/drivers", formData);

      console.log(response.data);
      notificationWithIcon("success", "Thêm tài xế", "Thêm tài xế thành công!");
      handleClickClose();
    } catch (err) {
      console.log((typeof err === 'string') ? err : (err?.response?.data?.message || err?.message));
      setError("Không thể thêm tài xế vì: " + ((typeof err === 'string') ? err : (err?.response?.data?.message || err?.message)));
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Thêm tài xế mới</DialogTitle>
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
        <div style={{ display: "flex", alignItems: "center", marginTop: "10px"}}>
          <h4 style={{ margin: "0 10px 0 0" }}>Thêm avatar :</h4>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </div>
        {newDriver.img && (
          <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <img
              src={URL.createObjectURL(newDriver.img)}
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

export default AddDriverDialog;